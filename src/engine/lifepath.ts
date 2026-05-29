import { addSkill, cloneCharacter, CORE_CHARACTERISTICS, getCharacteristic, newCharacter, setCharacteristic } from "./character";
import { characteristicDm, DiceRoller } from "./dice";
import type { CharacteristicKey, RollResult, TravellerCharacter } from "./types";
import type { RulesIndex } from "./rules";

export interface EngineResult {
  character: TravellerCharacter;
  [key: string]: unknown;
}

export class TravellerLifepathEngine {
  constructor(readonly rules: RulesIndex, readonly roller = new DiceRoller()) {}

  freshCharacter(): TravellerCharacter {
    return newCharacter();
  }

  rollInitialCharacteristics(character: TravellerCharacter, heroic = false): EngineResult {
    const next = cloneCharacter(character);
    const rolls: Record<string, RollResult> = {};
    const heroicStats = new Set<string>();

    if (heroic) {
      const firstPass = CORE_CHARACTERISTICS.map((stat) => ({ stat, roll: this.roller.roll2D() }));
      firstPass.sort((a, b) => b.roll.total - a.roll.total);
      heroicStats.add(firstPass[0].stat);
      heroicStats.add(firstPass[1].stat);
    }

    for (const stat of CORE_CHARACTERISTICS) {
      const roll = this.roller.rollCharacteristic(heroic && heroicStats.has(stat));
      next.characteristics[stat] = roll.total;
      rolls[stat] = roll;
    }
    next.phase = "society";
    next.notes.push("Rolled initial characteristics.");
    return { rolls, character: next };
  }

  rollExtraCharacteristics(character: TravellerCharacter, stats: CharacteristicKey[], heroic = false): EngineResult {
    const next = cloneCharacter(character);
    const rolls: Record<string, RollResult> = {};
    for (const stat of stats) {
      const roll = this.roller.rollCharacteristic(heroic);
      setCharacteristic(next, stat, roll.total);
      if (stat === "PSI") next.psi = roll.total;
      rolls[stat] = roll;
    }
    next.notes.push(`Rolled extra characteristics: ${stats.join(", ")}.`);
    return { rolls, character: next };
  }

  chooseSociety(character: TravellerCharacter, societyId: string): EngineResult {
    const next = cloneCharacter(character);
    next.society_id = societyId;
    next.phase = "species";
    next.notes.push(`Society of origin: ${societyId}.`);
    return { character: next };
  }

  applySpecies(character: TravellerCharacter, speciesId: string): EngineResult {
    const species = this.rules.species(speciesId);
    if (!species) throw new Error(`Unknown species: ${speciesId}`);
    const next = cloneCharacter(character);
    next.species_id = speciesId;

    for (const [stat, delta] of Object.entries(species.characteristic_modifiers ?? {})) {
      setCharacteristic(next, stat as CharacteristicKey, getCharacteristic(next, stat as CharacteristicKey) + Number(delta));
    }

    if (species.starting_age) next.age = Number(species.starting_age);
    if (species.uses_cha) {
      const roll = this.roller.d6() + 2;
      setCharacteristic(next, "CHA", roll);
      next.characteristics.SOC = 0;
    }
    if (species.extra_characteristics_required) {
      for (const stat of species.extra_characteristics_required as CharacteristicKey[]) {
        if (!getCharacteristic(next, stat)) setCharacteristic(next, stat, this.roller.roll2D().total);
      }
    }
    next.forbidden_skills = [...(species.forbidden_skills ?? [])];
    next.traits = [...(species.traits ?? [])];

    if (speciesId.includes("aslan")) {
      next.phase = "aslan_setup";
      next.aslan_setup_status = { phase: "gender" };
    } else if (species.psionic_training_at_start || (speciesId.includes("zhodani") && next.characteristics.SOC >= 10)) {
      next.phase = "zhodani_training";
    } else {
      next.phase = "background";
    }

    next.notes.push(`Applied species: ${species.name ?? speciesId}.`);
    return { species, character: next };
  }

  applyBackgroundSkills(character: TravellerCharacter, chosen: string[]): EngineResult {
    const next = cloneCharacter(character);
    const allowed = Math.max(0, 3 + characteristicDm(next.characteristics.EDU));
    for (const skillText of chosen.slice(0, allowed)) {
      const [name, speciality] = splitSkillSpeciality(skillText);
      addSkill(next, name, 0, speciality);
    }
    next.phase = "pre_career";
    next.notes.push(`Chose ${Math.min(chosen.length, allowed)} background skills.`);
    return { allowed, chosen: chosen.slice(0, allowed), character: next };
  }

  applyBackgroundPackage(character: TravellerCharacter, packageId: string, skillChoices: Record<string, string> = {}): EngineResult {
    const packages = this.rules.table<any>("background_packages").packages ?? this.rules.table<Record<string, any>>("background_packages");
    const pkg = packages[packageId];
    if (!pkg) throw new Error(`Unknown background package: ${packageId}`);
    const next = cloneCharacter(character);

    for (const [stat, delta] of Object.entries(pkg.characteristic_modifiers ?? pkg.stat_mods ?? {})) {
      setCharacteristic(next, stat as CharacteristicKey, getCharacteristic(next, stat as CharacteristicKey) + Number(delta));
    }
    for (const skill of pkg.skills ?? []) {
      const key = typeof skill === "string" ? skill : `${skill.name}${skill.speciality ? ` (${skill.speciality})` : ""}`;
      const resolved = skillChoices[key] ?? skill;
      if (typeof resolved === "string") {
        const [name, speciality, level] = parseSkillGain(resolved);
        addSkill(next, name, level === 1 && !/\d+$/.test(resolved.trim()) ? 0 : level, speciality);
      } else {
        addSkill(next, resolved.name, Number(resolved.level ?? 0), resolved.speciality ?? null);
      }
    }
    next.credits += Number(pkg.credits ?? 0);
    for (const item of pkg.equipment ?? []) next.equipment.push({ name: String(item), quantity: 1, notes: null });
    next.age = Math.max(next.age, 22);
    next.phase = "career";
    next.notes.push(`Applied background package: ${pkg.name ?? packageId}.`);
    return { package: pkg, character: next };
  }

  applyCareerPackage(character: TravellerCharacter, packageId: string): EngineResult {
    const data = this.rules.table<any>("career_packages");
    const list = Array.isArray(data?.packages) ? data.packages : Array.isArray(data) ? data : Object.values(data.packages ?? data);
    const pkg = list.find((entry: any) => entry.id === packageId);
    if (!pkg) throw new Error(`Unknown career package: ${packageId}`);
    const next = cloneCharacter(character);

    for (const [stat, delta] of Object.entries(pkg.characteristic_modifiers ?? pkg.characteristics ?? pkg.stat_mods ?? {})) {
      setCharacteristic(next, stat as CharacteristicKey, getCharacteristic(next, stat as CharacteristicKey) + Number(delta));
    }
    for (const skill of pkg.skills ?? []) {
      if (typeof skill === "string") {
        const [name, speciality, level] = parseSkillGain(skill);
        addSkill(next, name, level, speciality);
      } else {
        addSkill(next, skill.name, Number(skill.level ?? 0), skill.speciality ?? null, true);
      }
    }
    next.credits += Number(pkg.credits ?? 0);
    for (const item of pkg.equipment ?? []) next.equipment.push({ name: String(item), quantity: 1, notes: null });
    for (let i = 0; i < Number(pkg.contacts ?? 0); i++) next.associates.push({ kind: "contact", description: pkg.contact_description ?? "career package contact" });
    for (let i = 0; i < Number(pkg.allies ?? 0); i++) next.associates.push({ kind: "ally", description: pkg.ally_description ?? "career package ally" });
    next.age += this.roller.d3();
    next.career_package_id = packageId;
    next.career_package_taken = true;
    next.completed_careers.push({
      career_id: packageId,
      assignment_id: "career_package",
      terms_served: 1,
      final_rank: Number(pkg.rank ?? 0),
      final_rank_title: pkg.rank_title ?? null,
      commissioned: false,
      left_due_to: "career_package",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    });
    next.phase = "skill_package";
    next.notes.push(`Applied career package: ${pkg.name ?? packageId}.`);
    return { package: pkg, character: next };
  }

  applySkillPackage(character: TravellerCharacter, packageId: string): EngineResult {
    const packages = this.rules.table<any>("skill_packages").packages ?? this.rules.table<Record<string, any>>("skill_packages");
    const pkg = packages[packageId];
    if (!pkg) throw new Error(`Unknown skill package: ${packageId}`);
    const next = cloneCharacter(character);
    for (const skillText of pkg.skills ?? []) {
      const [name, speciality] = splitSkillSpeciality(skillText);
      addSkill(next, name, 1, speciality);
    }
    next.phase = "done";
    next.notes.push(`Applied skill package: ${pkg.name ?? packageId}.`);
    return { package: pkg, character: next };
  }

  skipPreCareer(character: TravellerCharacter): EngineResult {
    const next = cloneCharacter(character);
    next.phase = "career";
    next.notes.push("Skipped pre-career education.");
    return { character: next };
  }

  qualifyForCareer(): never {
    throw new Error("Full career qualification is not ported yet. Use career packages until the parity career loop is implemented.");
  }

  startTerm(): never {
    throw new Error("Term-by-term career creation is not ported yet. Use career packages until the parity career loop is implemented.");
  }

  survivalRoll(): never {
    throw new Error("Career survival rolls are not ported yet. Use career packages until the parity career loop is implemented.");
  }

  eventRoll(): never {
    throw new Error("Career event rolls are not ported yet. Use career packages until the parity event handlers are implemented.");
  }

  mishapRoll(): never {
    throw new Error("Career mishap rolls are not ported yet. Use career packages until the parity mishap handlers are implemented.");
  }

  advancementRoll(): never {
    throw new Error("Career advancement rolls are not ported yet. Use career packages until the parity career loop is implemented.");
  }

  musterOutRoll(): never {
    throw new Error("Mustering out is not ported yet. Career package cash, equipment, contacts, and allies are applied directly.");
  }

  finalizeRobot(robotConfig: Record<string, unknown>): EngineResult {
    const character = newCharacter();
    character.character_type = "robot";
    character.robot_config = robotConfig;
    character.name = String(robotConfig.name ?? "Traveller Robot");
    character.age = 0;
    character.characteristics = {
      STR: Number(robotConfig.STR ?? 0),
      DEX: Number(robotConfig.DEX ?? 0),
      END: Number(robotConfig.END ?? 0),
      INT: Number(robotConfig.INT ?? 0),
      EDU: Number(robotConfig.EDU ?? 0),
      SOC: 0
    };
    character.phase = "done";
    character.notes.push("Created robot placeholder from supplied robot configuration.");
    return { character };
  }

  generateNpc(): EngineResult {
    let character = newCharacter();
    character.name = "Generated Traveller";
    character = this.rollInitialCharacteristics(character).character;
    character = this.chooseSociety(character, "third_imperium").character;
    character = this.applySpecies(character, "imperial_human").character;
    character = this.applyBackgroundSkills(character, ["Admin", "Streetwise", "Vacc Suit"]).character;
    character = this.applyCareerPackage(character, "scout").character;
    character.phase = "done";
    return { character };
  }
}

export function splitSkillSpeciality(text: string): [string, string | null] {
  const match = text.match(/^(.+?)\s*\((.+)\)\s*$/);
  if (!match) return [text.trim(), null];
  return [match[1].trim(), match[2].trim()];
}

export function parseSkillGain(text: string): [string, string | null, number] {
  const trimmed = text.trim();
  const levelMatch = trimmed.match(/\s+(\d+)$/);
  const level = levelMatch ? Number(levelMatch[1]) : 1;
  const skillText = levelMatch ? trimmed.slice(0, levelMatch.index).trim() : trimmed;
  const [name, speciality] = splitSkillSpeciality(skillText);
  return [name, speciality, level];
}
