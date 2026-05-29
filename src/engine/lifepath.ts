import { addSkill, cloneCharacter, CORE_CHARACTERISTICS, getCharacteristic, newCharacter, setCharacteristic } from "./character";
import { characteristicDm, DiceRoller } from "./dice";
import type { CareerTerm, CharacteristicKey, RollResult, TravellerCharacter } from "./types";
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
      const resolved: any = skillChoices[key] ?? skill;
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

  qualifyForPreCareer(character: TravellerCharacter, trackId: string, options: Record<string, string> = {}): EngineResult {
    const track = this.rules.table<any>("education").tracks?.[trackId];
    if (!track) throw new Error(`Unknown pre-career track: ${trackId}`);
    const next = cloneCharacter(character);
    const service = options.service ? track.services?.[options.service] : null;
    const curriculum = options.curriculum ? track.curricula?.[options.curriculum] : null;
    const qualification = service?.qualification ?? track.qualification ?? {};
    const dm = this.checkDm(next, qualification);
    const roll = qualification.automatic ? null : this.roller.roll2D(dm);
    const qualified = qualification.automatic || Boolean(roll && roll.total >= Number(qualification.target ?? 0));

    if (!qualified) {
      next.phase = "career";
      next.notes.push(`Failed ${track.name ?? trackId} qualification${roll ? ` (${roll.total})` : ""}.`);
      return { track, roll, qualified, character: next };
    }

    this.applyStatBlock(next, track.enrollment_bonus ?? {});
    this.applySkillResults(next, track.enrollment_auto_skills ?? [], 0);
    const skillPool = this.preCareerSkillPool(track, service, curriculum);
    const picked = this.applyChosenSkills(next, options.skills, skillPool, Number(track.enrollment_skill_picks ?? 0), Number(track.enrollment_pick_level ?? 0));

    if (curriculum?.enrollment_skill_table) {
      const gain = this.rollOnExternalSkillTable(next, curriculum.enrollment_skill_table.career, curriculum.enrollment_skill_table.table);
      if (gain) picked.push(gain);
    }
    for (let i = 0; i < Number(track.enrollment_service_skill_random ?? 0); i++) {
      const gain = this.rollOnExternalSkillTable(next, service?.career_id ?? "merchant", "service_skills");
      if (gain) picked.push(gain);
    }
    if (qualification.requires_psi_test && !next.psi_tested) {
      const psiRoll = this.roller.roll2D();
      next.psi = psiRoll.total;
      setCharacteristic(next, "PSI", psiRoll.total);
      next.psi_tested = true;
    }

    next.pre_career_status = {
      track_id: trackId,
      service_id: service?.id ?? options.service ?? null,
      career_id: service?.career_id ?? null,
      curriculum_id: curriculum?.id ?? options.curriculum ?? null,
      enrolled: true,
      skill_pool: skillPool,
      enrollment_skills: picked
    };
    next.phase = "pre_career";
    next.notes.push(`Qualified for ${track.name ?? trackId}.`);
    return { track, roll, qualified, character: next };
  }

  graduatePreCareer(character: TravellerCharacter, chosenSkills: string[] = []): EngineResult {
    const status = character.pre_career_status ?? {};
    const trackId = String(status.track_id ?? "");
    const track = this.rules.table<any>("education").tracks?.[trackId];
    if (!track) throw new Error("No active pre-career track to graduate.");
    const next = cloneCharacter(character);
    const graduation = track.graduation ?? {};
    if (status.forced_graduation_failure) {
      next.pre_career_status = { ...status, graduated: false, honours: false, graduation_roll: null, outcome_note: graduation.on_failure?.note ?? "Failed to graduate." };
      next.age += Number(track.age_cost ?? 0);
      next.pre_career_terms += Number(track.age_cost ?? 0) > 0 ? 1 : 0;
      next.phase = "career";
      next.notes.push(`Failed to graduate from ${track.name ?? trackId} due to pre-career event.`);
      return { track, roll: null, graduated: false, honours: false, character: next };
    }
    const dm = this.checkDm(next, graduation);
    const roll = this.roller.roll2D(dm);
    const honours = roll.total >= Number(graduation.honours_target ?? Infinity);
    const graduated = honours || roll.total >= Number(graduation.target ?? 0);
    const outcome = graduated ? (honours ? graduation.on_honours : graduation.on_graduation) ?? {} : graduation.on_failure ?? {};

    if (graduated) this.applyPreCareerOutcome(next, track, outcome, chosenSkills);
    next.age = Math.max(next.age + Number(track.age_cost ?? 0), this.rollAgeOverride(outcome.age_override) ?? 0);
    next.pre_career_terms += Number(track.age_cost ?? 0) > 0 ? 1 : 0;
    next.pre_career_status = { ...status, graduated, honours, graduation_roll: roll.total, outcome_note: outcome.note ?? null };
    next.phase = "career";
    next.notes.push(`${graduated ? (honours ? "Graduated with honours from" : "Graduated from") : "Failed to graduate from"} ${track.name ?? trackId}.`);
    return { track, roll, graduated, honours, character: next };
  }

  preCareerEventRoll(character: TravellerCharacter, aslan = false): EngineResult {
    const next = cloneCharacter(character);
    const education = this.rules.table<any>("education");
    const table = aslan ? education.aslan_pre_career_events : education.pre_career_events;
    const roll = this.roller.roll2D();
    const key = String(Math.max(2, Math.min(12, roll.total)));
    const event = String(table?.[key] ?? "No event.");
    this.applyPreCareerEventEffects(next, roll.total, event, aslan);
    next.pre_career_status = { ...(next.pre_career_status ?? {}), last_event_roll: roll.total, last_event: event };
    next.notes.push(`Pre-career event: ${event}`);
    return { roll, event, character: next };
  }

  qualifyForCareer(character: TravellerCharacter, careerId: string): EngineResult {
    const career = this.rules.career(careerId);
    if (!career) throw new Error(`Unknown career: ${careerId}`);
    const next = cloneCharacter(character);
    const blockedReason = this.careerBlocked(next, career);
    if (blockedReason) {
      next.notes.push(`Cannot qualify for ${career.name ?? careerId}: ${blockedReason}.`);
      return { career, qualified: false, blockedReason, character: next };
    }
    const automatic = next.auto_entry_career_id === careerId || next.auto_qualify_career_ids.includes(careerId);
    const dm = this.checkDm(next, career.qualification ?? {})
      + next.dm_next_qualification
      + Number(next.permanent_qualification_dm_by_career[careerId] ?? 0)
      - next.failed_qualifications_this_term;
    const roll = automatic || career.qualification?.automatic ? null : this.roller.roll2D(dm);
    const qualified = automatic || career.qualification?.automatic || Boolean(roll && roll.total >= Number(career.qualification?.target ?? 0));
    next.dm_next_qualification = 0;
    if (qualified) {
      next.failed_qualifications_this_term = 0;
      next.notes.push(`Qualified for ${career.name ?? careerId}.`);
    } else {
      next.failed_qualifications_this_term += 1;
      next.notes.push(`Failed qualification for ${career.name ?? careerId}${roll ? ` (${roll.total})` : ""}.`);
    }
    return { career, roll, qualified, character: next };
  }

  startTerm(character: TravellerCharacter, careerId: string, assignmentId?: string): EngineResult {
    const career = this.rules.career(careerId);
    if (!career) throw new Error(`Unknown career: ${careerId}`);
    const assignments = Object.keys(career.assignments ?? {});
    const resolvedAssignment = assignmentId ?? assignments[0];
    if (!career.assignments?.[resolvedAssignment]) throw new Error(`Unknown assignment ${resolvedAssignment} for ${careerId}`);
    const next = cloneCharacter(character);
    const careerTerms = next.term_history.filter((term) => term.career_id === careerId).length;
    const commissioned = Boolean(career.all_commissioned) || next.starts_commissioned_career_id === careerId || Boolean(next.completed_careers.find((record) => record.career_id === careerId && record.commissioned));
    const rank = commissioned ? Number(next.starts_commissioned_rank ?? 1) : 0;
    const term: CareerTerm = {
      career_id: careerId,
      assignment_id: resolvedAssignment,
      term_number: careerTerms + 1,
      overall_term_number: next.total_terms + next.pre_career_terms + 1,
      rank,
      rank_title: this.rankTitle(career, commissioned, rank),
      commissioned,
      events: [],
      skills_gained: [],
      survived: null,
      advanced: null,
      mishap: null,
      basic_training: careerTerms === 0 && !career.hiver_no_basic_training,
      benefit_forfeited: false,
      survival_roll_total: null,
      advancement_roll_total: null,
      cover_career_id: null,
      frozen_watch: false
    };
    next.current_term = term;
    if (term.basic_training) {
      for (const result of Object.values(career.skill_tables?.service_skills ?? {}).filter((value) => typeof value === "string") as string[]) {
        const note = this.applySkillOrStat(next, result, 0);
        if (note) term.skills_gained.push(note);
      }
      this.applyRankBonus(next, career, term);
    }
    for (const skill of career.career_start_skills ?? []) {
      const note = this.applySkillOrStat(next, String(skill), 0);
      if (note) term.skills_gained.push(note);
    }
    next.phase = "career";
    next.notes.push(`Started ${career.name ?? careerId} term ${term.term_number}.`);
    return { career, term, character: next };
  }

  rollOnSkillTable(character: TravellerCharacter, tableId: string): EngineResult {
    const next = cloneCharacter(character);
    const term = this.requireCurrentTerm(next);
    const career = this.rules.career(term.career_id);
    const result = this.rollOnCareerSkillTable(next, career, tableId);
    if (result.note) term.skills_gained.push(result.note);
    return { career, tableId, roll: result.roll, result: result.entry, character: next };
  }

  survivalRoll(character: TravellerCharacter): EngineResult {
    const next = cloneCharacter(character);
    const term = this.requireCurrentTerm(next);
    const career = this.rules.career(term.career_id);
    if (career.no_survival) {
      term.survived = true;
      term.survival_roll_total = null;
      next.notes.push(`${career.name ?? term.career_id} has no survival roll.`);
      return { career, roll: null, survived: true, character: next };
    }
    const assignment = career.assignments[term.assignment_id];
    const check = career.survival ?? assignment.survival ?? {};
    const dm = this.checkDm(next, check) + next.dm_next_survival;
    const roll = this.roller.roll2D(dm);
    const survived = roll.natural !== 2 && roll.total >= Number(check.target ?? 0);
    term.survived = survived;
    term.survival_roll_total = roll.total;
    next.dm_next_survival = 0;
    if (!survived) term.events.push("Failed survival roll; roll on the Mishap table.");
    next.notes.push(`${survived ? "Passed" : "Failed"} survival in ${career.name ?? term.career_id}.`);
    return { career, roll, survived, character: next };
  }

  eventRoll(character: TravellerCharacter): EngineResult {
    const next = cloneCharacter(character);
    const term = this.requireCurrentTerm(next);
    const career = this.rules.career(term.career_id);
    const roll = this.roller.roll2D(next.dm_next_events);
    const text = String(career.events?.[String(Math.max(2, Math.min(12, roll.total)))] ?? "No event.");
    term.events.push(text);
    this.applyInlineEventEffects(next, term, text);
    next.dm_next_events = 0;
    next.notes.push(`Career event: ${text}`);
    return { career, roll, event: text, character: next };
  }

  mishapRoll(character: TravellerCharacter): EngineResult {
    const next = cloneCharacter(character);
    const term = this.requireCurrentTerm(next);
    const career = this.rules.career(term.career_id);
    const roll = this.roller.rollD(6);
    const text = String(career.mishaps?.[String(Math.max(1, Math.min(6, roll.total)))] ?? "Mishap.");
    term.mishap = text;
    term.survived = false;
    term.events.push(text);
    this.applyInlineEventEffects(next, term, text);
    next.force_career_end = true;
    next.notes.push(`Career mishap: ${text}`);
    return { career, roll, mishap: text, character: next };
  }

  advancementRoll(character: TravellerCharacter): EngineResult {
    const next = cloneCharacter(character);
    const term = this.requireCurrentTerm(next);
    const career = this.rules.career(term.career_id);
    const assignment = career.assignments[term.assignment_id];
    const check = career.advancement ?? assignment.advancement ?? {};
    const dm = this.checkDm(next, check)
      + next.dm_next_advancement
      + next.dm_permanent_advancement
      + Number(next.permanent_advancement_dm_by_career[term.career_id] ?? 0);
    const roll = this.roller.roll2D(dm);
    const advanced = roll.total >= Number(check.target ?? 0);
    term.advanced = advanced;
    term.advancement_roll_total = roll.total;
    next.dm_next_advancement = 0;
    if (advanced) {
      term.rank = Math.min(6, term.rank + 1);
      term.rank_title = this.rankTitle(career, term.commissioned, term.rank);
      this.applyRankBonus(next, career, term);
    }
    next.notes.push(`${advanced ? "Advanced" : "Did not advance"} in ${career.name ?? term.career_id}.`);
    return { career, roll, advanced, character: next };
  }

  commissionRoll(character: TravellerCharacter): EngineResult {
    const next = cloneCharacter(character);
    const term = this.requireCurrentTerm(next);
    const career = this.rules.career(term.career_id);
    const commission = career.commission;
    if (!commission) throw new Error(`${career.name ?? term.career_id} does not have commission rolls.`);
    if (term.commissioned || next.term_history.some((entry) => entry.career_id === term.career_id && entry.commissioned)) {
      throw new Error("Already commissioned in this career.");
    }
    if (term.term_number > 1 && getCharacteristic(next, "SOC") < 9) throw new Error("Commission after the first term requires SOC 9+.");
    const termPenalty = -(term.term_number - 1);
    const academyDm = next.academy_commission_career_id === term.career_id ? next.academy_commission_dm : 0;
    const hardKnocksDm = next.completed_careers.length === 0 ? Number(next.pre_career_permanent_dms.first_career_commission_dm ?? 0) : 0;
    const dm = this.checkDm(next, commission) + termPenalty + academyDm + hardKnocksDm + next.dm_next_advancement + next.dm_permanent_advancement;
    const roll = this.roller.roll2D(dm);
    const commissioned = roll.total >= Number(commission.target ?? 8);
    if (commissioned) {
      term.commissioned = true;
      term.rank = 1;
      term.rank_title = this.rankTitle(career, true, 1);
      this.applyRankBonus(next, career, term);
      term.advanced = false;
    }
    next.dm_next_advancement = 0;
    next.academy_commission_career_id = null;
    next.academy_commission_dm = 0;
    next.notes.push(`${commissioned ? "Commissioned" : "Failed commission"} in ${career.name ?? term.career_id}.`);
    return { career, roll, commissioned, character: next };
  }

  endTerm(character: TravellerCharacter, leaveCareer = false, leftDueTo = "voluntary"): EngineResult {
    const next = cloneCharacter(character);
    const term = this.requireCurrentTerm(next);
    const career = this.rules.career(term.career_id);
    next.term_history.push(term);
    next.total_terms += 1;
    next.age += 4;
    const aging = this.applyAgingIfNeeded(next);
    next.current_term = null;
    next.failed_qualifications_this_term = 0;
    const mustLeave = leaveCareer || next.force_career_end || term.survived === false;
    if (mustLeave) {
      const careerTerms = next.term_history.filter((entry) => entry.career_id === term.career_id).length;
      const earned = career.mustering_out === null
        ? 0
        : this.benefitRollsEarned(careerTerms * Number(career.mustering_out_rolls_per_term ?? 1), term.rank, term.benefit_forfeited);
      next.pending_benefit_rolls += earned;
      next.completed_careers.push({
        career_id: term.career_id,
        assignment_id: term.assignment_id,
        terms_served: careerTerms,
        final_rank: term.rank,
        final_rank_title: term.rank_title ?? null,
        commissioned: term.commissioned,
        left_due_to: leftDueTo,
        benefit_rolls_used: 0,
        benefit_rolls_earned: earned
      });
      next.force_career_end = false;
      next.phase = next.pending_benefit_rolls > 0 ? "mustering" : "career";
    }
    next.notes.push(`Ended ${career.name ?? term.career_id} term ${term.term_number}.`);
    return { career, term, aging, character: next };
  }

  musterOutRoll(character: TravellerCharacter, careerId?: string, column: "cash" | "benefit" = "benefit"): EngineResult {
    const next = cloneCharacter(character);
    const record = careerId
      ? [...next.completed_careers].reverse().find((entry) => entry.career_id === careerId)
      : next.completed_careers[next.completed_careers.length - 1];
    if (!record) throw new Error("No completed career to muster out from.");
    if (next.pending_benefit_rolls <= 0) throw new Error("No pending benefit rolls.");
    const career = this.rules.career(record.career_id);
    if (career.mustering_out === null) throw new Error(`${career.name ?? record.career_id} grants no mustering-out benefits.`);
    const rankDm = record.final_rank >= 5 ? 1 : 0;
    const gamblerDm = column === "cash" && next.skills.some((skill) => skill.name.toLowerCase() === "gambler") ? 1 : 0;
    const charDm = career.mustering_out_dm_characteristic ? characteristicDm(getCharacteristic(next, career.mustering_out_dm_characteristic as CharacteristicKey)) : 0;
    const dm = next.dm_next_benefit + rankDm + gamblerDm + charDm;
    const rawRoll = career.hiver_career ? this.roller.roll2D(dm) : this.roller.rollD(6);
    const numericRows = Object.keys(career.mustering_out ?? {}).filter((key) => /^\d+$/.test(key)).map(Number);
    const minRow = Math.min(...numericRows, career.hiver_career ? 2 : 1);
    const maxRow = Math.max(...numericRows, 7);
    const total = Math.max(minRow, Math.min(maxRow, rawRoll.total + (career.hiver_career ? 0 : dm)));
    const entry = career.mustering_out?.[String(total)] ?? {};
    const resolvedColumn = column === "cash" && next.cash_rolls_used < 3 && entry.cash != null ? "cash" : "benefit";
    const result = entry[resolvedColumn];
    if (resolvedColumn === "cash") {
      next.credits += Number(result ?? 0);
      next.cash_rolls_used += 1;
    } else {
      this.applyMusterBenefit(next, String(result ?? "Benefit"));
    }
    next.pending_benefit_rolls -= 1;
    record.benefit_rolls_used += 1;
    next.dm_next_benefit = 0;
    if (next.pending_benefit_rolls <= 0) next.phase = "skill_package";
    next.notes.push(`Mustering out ${resolvedColumn}: ${result}.`);
    return { career, roll: rawRoll, tableRoll: total, column: resolvedColumn, result, character: next };
  }

  applyInjury(character: TravellerCharacter, result?: number): EngineResult {
    const next = cloneCharacter(character);
    const roll = result ? { dice: [], natural: result, total: result, dm: 0 } : this.roller.rollD(6);
    const table = this.rules.table<any>("injury");
    const entry = table.entries?.[String(Math.max(1, Math.min(6, roll.total)))] ?? {};
    const pending = this.injuryPending(entry, roll.total);
    if (pending) {
      next.pending_injury_choice = pending;
      next.notes.push(`Injury: ${entry.title ?? "Injury"}; characteristic choice pending.`);
    } else {
      next.notes.push(`Injury: ${entry.title ?? "Lightly Injured"}; no permanent effect.`);
    }
    return { roll, entry, pendingChoice: pending, character: next };
  }

  resolveInjuryChoice(character: TravellerCharacter, chosenStat: "STR" | "DEX" | "END"): EngineResult {
    const next = cloneCharacter(character);
    const pending = next.pending_injury_choice;
    if (!pending) throw new Error("No pending injury choice.");
    const choices = pending.choices as string[] | undefined;
    if (choices?.length && !choices.includes(chosenStat)) throw new Error(`${chosenStat} is not a valid injury choice.`);
    const damage = Number(pending.damage_to_chosen ?? 0);
    const auto = Number(pending.auto_reduce_others ?? 0);
    const others = (["STR", "DEX", "END"] as const).filter((stat) => stat !== chosenStat);
    const primaryLoss = Math.min(getCharacteristic(next, chosenStat), damage);
    const secondaryLosses = others.map((stat) => ({ stat, loss: Math.min(getCharacteristic(next, stat), auto) })).filter((entry) => entry.loss > 0);
    const totalLoss = primaryLoss + secondaryLosses.reduce((sum, entry) => sum + entry.loss, 0);
    const grossDebt = totalLoss * 5000;
    next.pending_injury_treatment_choice = {
      chosen_stat: chosenStat,
      damage_to_chosen: damage,
      auto_reduce_others: auto,
      secondary_losses: secondaryLosses,
      total_loss: totalLoss,
      gross_debt: grossDebt,
      net_debt: grossDebt,
      title: pending.title ?? "Injury"
    };
    next.pending_injury_choice = null;
    return { chosenStat, totalLoss, grossDebt, character: next };
  }

  resolveInjuryPayment(character: TravellerCharacter, pay: boolean): EngineResult {
    const next = cloneCharacter(character);
    const pending = next.pending_injury_treatment_choice;
    if (!pending) throw new Error("No pending injury treatment choice.");
    if (pay) {
      next.medical_debt += Number(pending.net_debt ?? pending.gross_debt ?? 0);
    } else {
      const chosen = String(pending.chosen_stat) as CharacteristicKey;
      setCharacteristic(next, chosen, getCharacteristic(next, chosen) - Number(pending.damage_to_chosen ?? 0));
      for (const entry of pending.secondary_losses as Array<{ stat: CharacteristicKey; loss: number }> ?? []) {
        setCharacteristic(next, entry.stat, getCharacteristic(next, entry.stat) - entry.loss);
      }
    }
    next.pending_injury_treatment_choice = null;
    next.notes.push(pay ? "Paid for injury treatment." : "Accepted injury characteristic loss.");
    return { paid: pay, character: next };
  }

  private checkDm(character: TravellerCharacter, check: any): number {
    let dm = characteristicDm(getCharacteristic(character, check?.characteristic as CharacteristicKey));
    for (const modifier of check?.modifiers ?? []) {
      if (modifier.type === "per_previous_term") dm += Number(modifier.dm ?? 0) * character.total_terms;
      if (modifier.type === "per_previous_career") dm += Number(modifier.dm ?? 0) * character.completed_careers.length;
      if (modifier.type === "characteristic_threshold" && getCharacteristic(character, modifier.characteristic) >= Number(modifier.threshold ?? 0)) dm += Number(modifier.dm ?? 0);
    }
    return dm;
  }

  private applyStatBlock(character: TravellerCharacter, block: Record<string, unknown>): void {
    for (const [key, delta] of Object.entries(block)) {
      if (CORE_CHARACTERISTICS.includes(key as any) || key === "PSI" || key === "CHA") {
        setCharacteristic(character, key as CharacteristicKey, getCharacteristic(character, key as CharacteristicKey) + Number(delta));
        if (key === "PSI") character.psi = getCharacteristic(character, "PSI");
      }
    }
  }

  private applyPreCareerOutcome(character: TravellerCharacter, track: any, outcome: any, chosenSkills: string[]): void {
    this.applyStatBlock(character, outcome);
    if (outcome.EDU_penalty_dice === "D3") setCharacteristic(character, "EDU", getCharacteristic(character, "EDU") - this.roller.d3());
    if (outcome.jack_of_all_trades) addSkill(character, "Jack-of-All-Trades", Number(outcome.jack_of_all_trades), null, true);
    this.applySkillResults(character, outcome.fixed_skills ?? [], 1);

    const pool = (character.pre_career_status?.skill_pool as string[] | undefined) ?? this.preCareerSkillPool(track, null, null);
    const neededLevel1 = Number(outcome.skills_at_level_1 ?? 0) + Number(outcome.skills_upgrade_from_enrollment ?? 0) + Number(outcome.skills_from_enrollment_1 ?? 0);
    this.applyChosenSkills(character, chosenSkills, pool, neededLevel1, 1);
    this.applyChosenSkills(character, chosenSkills.slice(neededLevel1), pool, Number(outcome.additional_skills_from_enrollment_0 ?? 0), 0);
    for (const associate of outcome.associates ?? []) {
      character.associates.push({ kind: associate.kind ?? "contact", description: associate.description ?? `${track.name} associate` });
    }
    const permanent = outcome.permanent ?? {};
    for (const careerId of permanent.advancement_dm_careers ?? []) {
      character.permanent_advancement_dm_by_career[careerId] = Number(permanent.advancement_dm ?? 0);
    }
    if (permanent.qualification_dm) {
      for (const career of this.rules.careerList()) character.permanent_qualification_dm_by_career[career.id] = Number(permanent.qualification_dm);
      for (const careerId of permanent.bonus_qualify_careers ?? []) character.permanent_qualification_dm_by_career[careerId] = Number(permanent.bonus_qualify_dm ?? 0);
    }
    if (permanent.psion_career_auto_entry) character.auto_qualify_career_ids.push("psion");
    if (outcome.auto_entry && character.pre_career_status?.career_id) character.auto_entry_career_id = String(character.pre_career_status.career_id);
    if (outcome.commission_dm && character.pre_career_status?.career_id) {
      character.academy_commission_career_id = String(character.pre_career_status.career_id);
      character.academy_commission_dm = Number(outcome.commission_dm);
    }
    if (outcome.starts_commissioned_rank && character.pre_career_status?.career_id) {
      character.starts_commissioned_career_id = String(character.pre_career_status.career_id);
      character.starts_commissioned_rank = Number(outcome.starts_commissioned_rank);
    }
    if (outcome.permanent?.auto_rank && character.pre_career_status?.career_id) {
      character.starts_commissioned_career_id = String(character.pre_career_status.career_id);
      character.starts_commissioned_rank = Number(outcome.permanent.auto_rank);
      character.auto_entry_career_id = String(character.pre_career_status.career_id);
    }
  }

  private preCareerSkillPool(track: any, service: any, curriculum: any): string[] {
    const genderPool = thisGenderSkillPool(track);
    return [
      ...(track.skill_list ?? []),
      ...genderPool,
      ...(track.enrollment_skill_pool ?? []),
      ...(service?.skill_list ?? []),
      ...(curriculum?.skill_list ?? [])
    ].map(String);
  }

  private applyChosenSkills(character: TravellerCharacter, raw: unknown, pool: string[], count: number, level: number): string[] {
    const choices = Array.isArray(raw) ? raw.map(String) : typeof raw === "string" ? raw.split(",").map((entry) => entry.trim()).filter(Boolean) : [];
    const picked = choices.length ? choices : pool;
    const applied: string[] = [];
    for (const choice of picked.slice(0, Math.max(0, count))) {
      const base = pool.find((entry) => entry.toLowerCase() === choice.toLowerCase()) ?? choice;
      const [name, speciality, parsedLevel] = parseSkillGain(/\d+$/.test(base.trim()) ? base : `${base} ${level}`);
      applied.push(addSkill(character, name, parsedLevel, speciality, true));
    }
    return applied;
  }

  private applySkillResults(character: TravellerCharacter, results: string[], defaultLevel: number): string[] {
    return results.map((result) => this.applySkillOrStat(character, result, defaultLevel)).filter(Boolean) as string[];
  }

  private rollAgeOverride(value: unknown): number | null {
    if (value === "22+2D3") return 22 + this.roller.d3() + this.roller.d3();
    return null;
  }

  private careerBlocked(character: TravellerCharacter, career: any): string | null {
    if (character.banned_career_ids.includes(career.id)) return "career is banned by a prior result";
    if (character.forced_next_career_id && character.forced_next_career_id !== career.id) return `must enter ${character.forced_next_career_id}`;
    if (career.blocked_societies?.includes(character.society_id)) return `blocked for ${character.society_id}`;
    if (career.allowed_societies?.length && !career.allowed_societies.includes(character.society_id)) return `not available for ${character.society_id}`;
    if (career.blocked_species?.includes(character.species_id)) return `blocked for ${character.species_id}`;
    if (career.allowed_species?.length && !career.allowed_species.includes(character.species_id)) return `not available for ${character.species_id}`;
    const species = this.rules.species(character.species_id);
    if (species?.blocked_careers?.includes(career.id)) return `blocked for ${species.name ?? character.species_id}`;
    if (species?.allowed_species_careers?.length && !species.allowed_species_careers.includes(career.id)) return `not in species career list`;
    return null;
  }

  private requireCurrentTerm(character: TravellerCharacter): NonNullable<TravellerCharacter["current_term"]> {
    if (!character.current_term) throw new Error("No active career term.");
    return character.current_term;
  }

  private rankTrack(career: any, commissioned: boolean): any {
    if (commissioned && career.ranks?.officer) return career.ranks.officer;
    if (!commissioned && career.ranks?.enlisted) return career.ranks.enlisted;
    return career.ranks?.default ?? career.ranks?.all ?? career.ranks?.enlisted ?? career.ranks?.officer ?? {};
  }

  private rankTitle(career: any, commissioned: boolean, rank: number): string | null {
    return this.rankTrack(career, commissioned)?.[String(rank)]?.title ?? null;
  }

  private applyRankBonus(character: TravellerCharacter, career: any, term: NonNullable<TravellerCharacter["current_term"]>): void {
    const bonus = this.rankTrack(career, term.commissioned)?.[String(term.rank)]?.bonus;
    if (!bonus) return;
    const note = this.applySkillOrStat(character, String(bonus), 1);
    if (note) term.skills_gained.push(note);
  }

  private rollOnExternalSkillTable(character: TravellerCharacter, careerId: string, tableId: string): string | null {
    const career = this.rules.career(careerId);
    if (!career) return null;
    return this.rollOnCareerSkillTable(character, career, tableId).note;
  }

  private rollOnCareerSkillTable(character: TravellerCharacter, career: any, tableId: string): { roll: RollResult; entry: string; note: string | null } {
    const table = career.skill_tables?.[tableId];
    if (!table) throw new Error(`Unknown skill table ${tableId} for ${career.id}`);
    if (table.requires_edu && getCharacteristic(character, "EDU") < Number(table.requires_edu)) throw new Error(`${table.name ?? tableId} requires EDU ${table.requires_edu}+.`);
    const roll = this.roller.rollD(6);
    const entry = String(table[String(Math.max(1, Math.min(6, roll.total)))] ?? "");
    const note = this.applySkillOrStat(character, entry, 1);
    return { roll, entry, note };
  }

  private applySkillOrStat(character: TravellerCharacter, result: string, defaultLevel: number): string | null {
    const option = result.split(/\s+or\s+/i)[0].replace(/\b(any|one of)\b/gi, "").trim();
    const statMatch = option.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
    if (statMatch) {
      const key = statMatch[1] as CharacteristicKey;
      setCharacteristic(character, key, getCharacteristic(character, key) + Number(statMatch[2]));
      if (key === "PSI") character.psi = getCharacteristic(character, "PSI");
      return `${key} +${statMatch[2]}`;
    }
    const cleaned = option.replace(/\s*\((?:any|Small Craft or Spacecraft|riding or Training)\)\s*/i, "").trim();
    if (!cleaned) return null;
    const [name, speciality, level] = parseSkillGain(/\d+$/.test(cleaned) ? cleaned : `${cleaned} ${defaultLevel}`);
    const normalizedSpeciality = typeof speciality === "string" && speciality.toLowerCase() === "any" ? null : speciality;
    return addSkill(character, normalizeSkillName(name), level, normalizedSpeciality, true);
  }

  private applyInlineEventEffects(character: TravellerCharacter, term: NonNullable<TravellerCharacter["current_term"]>, text: string): void {
    const benefitDm = text.match(/DM\+(\d+) to (?:any one |your next )Benefit/i);
    if (benefitDm) character.dm_next_benefit += Number(benefitDm[1]);
    const advancementDm = text.match(/DM\+(\d+) to your next Advancement/i);
    if (advancementDm) character.dm_next_advancement += Number(advancementDm[1]);
    if (/automatically promoted/i.test(text)) {
      const career = this.rules.career(term.career_id);
      term.rank = Math.min(6, term.rank + 1);
      term.advanced = true;
      term.rank_title = this.rankTitle(career, term.commissioned, term.rank);
      this.applyRankBonus(character, career, term);
    }
    const skillMatches = [...text.matchAll(/\b([A-Z][A-Za-z-]+(?:\s+[A-Z][A-Za-z-]+)?(?:\s+\([^)]+\))?)\s+(\d)\b/g)];
    for (const match of skillMatches.slice(0, 2)) {
      const [name, speciality, level] = parseSkillGain(`${match[1]} ${match[2]}`);
      if (["Roll", "Gain", "Table", "DM"].includes(name)) continue;
      const note = addSkill(character, name, level, speciality, true);
      term.skills_gained.push(note);
    }
    if (/Gain (?:a|one) Contact/i.test(text)) character.associates.push({ kind: "contact", description: `Contact from ${term.career_id} event` });
    if (/Gain (?:an|one) Ally/i.test(text)) character.associates.push({ kind: "ally", description: `Ally from ${term.career_id} event` });
    if (/Gain (?:an|one) Enemy/i.test(text)) character.associates.push({ kind: "enemy", description: `Enemy from ${term.career_id} event` });
    if (/Gain (?:a|one) Rival/i.test(text)) character.associates.push({ kind: "rival", description: `Rival from ${term.career_id} event` });
  }

  private applyPreCareerEventEffects(character: TravellerCharacter, rollTotal: number, text: string, aslan: boolean): void {
    if (/Carouse 1/i.test(text)) addSkill(character, "Carouse", 1, null, true);
    if (/Increase your SOC by \+1/i.test(text)) setCharacteristic(character, "SOC", getCharacteristic(character, "SOC") + 1);
    if (/Gain D3 Allies/i.test(text)) {
      const count = this.roller.d3();
      for (let i = 0; i < count; i++) character.associates.push({ kind: "ally", description: "Ally from pre-career education" });
    }
    if (/Gain a Rival/i.test(text)) character.associates.push({ kind: "rival", description: "Rival from pre-career education" });
    if (/Gain an Enemy/i.test(text)) character.associates.push({ kind: "enemy", description: "Enemy from pre-career education" });
    if (/Gain one Ally/i.test(text)) character.associates.push({ kind: "ally", description: "Ally from pre-career education" });
    if (/gain an Enemy in a rival clan/i.test(text)) character.associates.push({ kind: "enemy", description: "Enemy in a rival clan" });
    if (/any one skill at level 0/i.test(text) || /any skill of your choice/i.test(text)) {
      character.pending_life_event_choice = { kind: "pre_career_any_skill", level: 0, excluded: ["Jack-of-All-Trades"], prompt: text };
    }
    if (/crash and fail to graduate|cannot redeem yourself in time to graduate/i.test(text)) {
      character.pre_career_status = { ...(character.pre_career_status ?? {}), forced_graduation_failure: true };
    }
    if (/Prisoner career in your next term/i.test(text) && rollTotal === 4) character.forced_next_career_id = "prisoner";
    if (/join the Drifter career next term/i.test(text)) {
      character.pending_life_event_choice = { kind: "pre_career_war_choice", options: ["drifter", "draft", "avoid"], prompt: text };
    }
    if (aslan && /become Outcast|must become Outcast/i.test(text)) character.forced_next_career_id = "aslan_outcast";
    if (aslan && /Outlaw or Wanderer career without a qualification roll/i.test(text)) {
      character.auto_qualify_career_ids.push("aslan_outlaw", "aslan_wanderer");
    }
  }

  private benefitRollsEarned(terms: number, rank: number, forfeited: boolean): number {
    let rolls = Math.max(0, terms);
    if (rank >= 1) rolls += 1;
    if (rank >= 3) rolls += 1;
    if (rank >= 5) rolls += 1;
    if (forfeited) rolls = Math.max(0, rolls - 1);
    return rolls;
  }

  private applyMusterBenefit(character: TravellerCharacter, result: string): void {
    if (/TAS Membership/i.test(result)) character.tas_member = true;
    else if (/Ship Share/i.test(result)) character.ship_shares += 1;
    else if (/Scout Ship/i.test(result)) character.equipment.push({ name: "Scout Ship", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Weapon/i.test(result)) character.equipment.push({ name: "Weapon", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Armou?r/i.test(result)) character.equipment.push({ name: "Armour", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Blade/i.test(result)) character.equipment.push({ name: "Blade", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Gun/i.test(result)) character.equipment.push({ name: "Gun", quantity: 1, notes: "Mustering-out benefit" });
    else if (/Ship's Boat/i.test(result)) character.equipment.push({ name: "Ship's Boat", quantity: 1, notes: "Mustering-out benefit" });
    else {
      const stat = result.match(/\b(STR|DEX|END|INT|EDU|SOC|CHA|TER|PSI|WLT|LCK|MRL|STY|RES|FOL|REP)\s*\+(\d+)/);
      if (stat) setCharacteristic(character, stat[1] as CharacteristicKey, getCharacteristic(character, stat[1] as CharacteristicKey) + Number(stat[2]));
      else character.equipment.push({ name: result, quantity: 1, notes: "Mustering-out benefit" });
    }
  }

  private injuryPending(entry: any, result: number): Record<string, unknown> | null {
    const effects = entry.effects ?? [];
    if (!effects.length) return null;
    const physical = ["STR", "DEX", "END"];
    const random = effects.find((effect: any) => effect.type === "reduce_physical_random");
    const choice = effects.find((effect: any) => effect.type === "reduce_choice");
    const other = effects.find((effect: any) => effect.type === "reduce_physical_other");
    if (random) {
      return {
        roll: result,
        title: entry.title ?? "Injury",
        damage_to_chosen: random.amount === "1D" ? this.roller.d6() : Number(random.amount ?? 0),
        auto_reduce_others: Number(other?.amount ?? 0),
        choices: physical,
        prompt: entry.text ?? "Choose which physical characteristic takes the damage."
      };
    }
    if (choice) {
      return {
        roll: result,
        title: entry.title ?? "Injury",
        damage_to_chosen: Number(choice.amount ?? 0),
        auto_reduce_others: 0,
        choices: choice.characteristics ?? physical,
        prompt: entry.text ?? "Choose which characteristic takes the damage."
      };
    }
    return null;
  }

  private applyAgingIfNeeded(character: TravellerCharacter): Record<string, unknown> | null {
    const species = this.rules.species(character.species_id) ?? {};
    const startsAt = Number(species.aging_starts_term ?? this.rules.table<any>("aging").triggers_at_term ?? 4);
    if (character.total_terms < startsAt) return null;
    const roll = this.roller.roll2D(-character.total_terms);
    const table = this.rules.table<any>("aging");
    const entry = this.agingEntry(table, roll.total);
    const reductions = this.applyAgingEffects(character, entry.effects ?? []);
    const crisis = reductions.some((entry) => getCharacteristic(character, entry.stat as CharacteristicKey) <= 0);
    if (crisis) {
      const debt = this.roller.d6() * 10000;
      character.pending_injury_treatment_choice = {
        kind: "aging_crisis",
        gross_debt: debt,
        net_debt: debt,
        title: "Aging crisis"
      };
      character.notes.push("Aging crisis: medical care needed to keep reduced characteristics at 1.");
    }
    character.notes.push(`Aging roll ${roll.total}: ${entry.title ?? "Aging"}.`);
    return { roll, entry, reductions, crisis };
  }

  private agingEntry(table: any, total: number): any {
    if (total <= -6) return table.entries?.["-6_or_less"] ?? {};
    if (total >= 1) return table.entries?.["1_or_more"] ?? {};
    return table.entries?.[String(total)] ?? {};
  }

  private applyAgingEffects(character: TravellerCharacter, effects: any[]): Array<{ stat: string; amount: number }> {
    const reductions: Array<{ stat: string; amount: number }> = [];
    const physical: CharacteristicKey[] = ["STR", "DEX", "END"];
    const mental: CharacteristicKey[] = ["INT", "EDU", "SOC"];
    for (const effect of effects) {
      const pool = effect.type === "reduce_mental" ? mental : physical;
      const count = Math.min(Number(effect.count ?? 1), pool.length);
      const amount = Number(effect.amount ?? 0);
      for (const stat of pool.slice(0, count)) {
        setCharacteristic(character, stat, getCharacteristic(character, stat) - amount);
        reductions.push({ stat, amount });
      }
    }
    return reductions;
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

function thisGenderSkillPool(track: any): string[] {
  return [...(track.skill_list_male ?? []), ...(track.skill_list_female ?? [])].map(String);
}

function normalizeSkillName(name: string): string {
  if (name === "Jack-of-all-Trades") return "Jack-of-All-Trades";
  if (name === "Jack-of-all-trades") return "Jack-of-All-Trades";
  return name.trim();
}
