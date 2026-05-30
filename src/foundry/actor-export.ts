import { ALL_CHARACTERISTICS, getCharacteristic } from "../engine/character";
import type { TravellerCharacter } from "../engine/types";
import { skillId, specialityId } from "./skill-map";

export interface ExportOptions {
  sourceVersion?: string;
  entryYear?: number;
}

export function exportActorData(character: TravellerCharacter, options: ExportOptions = {}): any {
  const entryYear = options.entryYear ?? 1105;
  const skills = exportSkills(character);
  const characteristics = Object.fromEntries(ALL_CHARACTERISTICS.map((key) => {
    const value = key === "PSI" ? (character.psi || getCharacteristic(character, key)) : getCharacteristic(character, key);
    return [key, { value, current: value, show: isShownCharacteristic(key, value), default: false }];
  }));

  const hitsMax = character.characteristics.STR + character.characteristics.DEX + character.characteristics.END;
  const items = [
    ...exportAlienState(character),
    ...exportAssociates(character),
    ...exportTerms(character),
    ...exportEquipment(character)
  ];

  const name = character.name || "Unnamed Traveller";
  return {
    name,
    type: "traveller",
    img: "systems/mgt2e/icons/actors/traveller.svg",
    system: {
      speed: { base: 6, value: 6 },
      initiative: { base: 0, value: 0 },
      size: 0,
      rads: 0,
      weightCarried: 0,
      heavyLoad: character.characteristics.STR * 10,
      maxLoad: character.characteristics.STR * 20,
      modifiers: {},
      hits: { value: hitsMax, max: hitsMax, damage: 0, tmpDamage: 0 },
      description: character.capsule_description ? htmlParagraphs(character.capsule_description) : "",
      settings: {
        hideUntrained: false,
        onlyBackground: false,
        resetOnRoll: false,
        columns: "3",
        lockCharacteristics: false,
        sortByCategory: false,
        lockSkills: false,
        autoAge: true,
        autoHits: true
      },
      characteristics,
      skills,
      damage: { STR: { value: 0 }, DEX: { value: 0 }, END: { value: 0, tmp: 0 } },
      sophont: {
        age: String(character.age),
        species: titleCase(character.species_id.replaceAll("_", " ")),
        speciesTraits: character.traits.map((trait: any) => trait.name ?? trait.id ?? "").filter(Boolean).join(", "),
        gender: character.gender || "Unknown",
        weight: 0,
        height: 0,
        profession: careerSummary(character),
        homeworld: character.homeworld
      },
      finance: {
        cash: String(character.credits),
        pension: String(character.pension_per_year),
        medicalDebt: String(character.medical_debt),
        mortgage: "0",
        livingCosts: "0",
        otherIncome: "0",
        shipShares: character.ship_shares,
        description: character.ship_shares ? `Ship Shares: ${character.ship_shares}` : ""
      },
      terms: character.total_terms || character.completed_careers.reduce((sum, career) => sum + career.terms_served, 0),
      startAge: character.character_type === "robot" ? 0 : 18,
      termLength: character.character_type === "robot" ? 0 : 4,
      entryYear,
      entryAge: character.age,
      currentYear: entryYear,
      birthYear: entryYear - character.age
    },
    items,
    effects: [],
    folder: null,
    flags: {
      travellerCreator: {
        sourceVersion: options.sourceVersion ?? "unknown",
        creationState: character,
        createdAt: new Date().toISOString()
      },
      mgt2e: {}
    },
    prototypeToken: {
      name,
      displayName: 0,
      actorLink: true,
      width: 1,
      height: 1
    }
  };
}

function exportSkills(character: TravellerCharacter): Record<string, any> {
  const working: Record<string, { base: number; specs: Record<string, number> }> = {};
  for (const skill of character.skills) {
    const id = skillId(skill.name);
    if (!id) continue;
    working[id] ??= { base: -1, specs: {} };
    if (!skill.speciality || skill.speciality.toLowerCase() === "any") {
      working[id].base = Math.max(working[id].base, skill.level);
    } else {
      const spec = specialityId(skill.speciality);
      if (spec) working[id].specs[spec] = Math.max(working[id].specs[spec] ?? -1, skill.level);
    }
  }

  return Object.fromEntries(Object.entries(working).map(([id, data]) => {
    const entry: any = { id, value: data.base > 0 ? String(data.base) : Math.max(data.base, 0), trained: true };
    if (Object.keys(data.specs).length) {
      entry.specialities = Object.fromEntries(Object.entries(data.specs).map(([spec, value]) => [spec, { id: spec, value: String(value) }]));
    }
    return [id, entry];
  }));
}

function exportAssociates(character: TravellerCharacter): any[] {
  const defaults: Record<string, any> = {
    ally: { affinity: 3, enmity: 0, power: 2, influence: 2 },
    contact: { affinity: 3, enmity: 0, power: 0, influence: 4 },
    rival: { affinity: 1, enmity: 0, power: 2, influence: 1 },
    enemy: { affinity: 0, enmity: -3, power: 3, influence: 1 }
  };
  return character.associates.map((associate) => {
    const kind = String(associate.kind || "contact").toLowerCase();
    const values = defaults[kind] ?? defaults.contact;
    return itemShell(associate.description || `Unnamed ${titleCase(kind)}`, "associate", {
      associate: { relationship: kind, ...values },
      relation: kind,
      description: associate.description
    });
  });
}

function exportAlienState(character: TravellerCharacter): any[] {
  const items: any[] = [];
  const lines: string[] = [];
  if (character.aslan_setup_status?.rite_score != null) lines.push(`Rite of Passage: ${character.aslan_setup_status.rite_score}`);
  if (character.aslan_setup_status?.clan_name) lines.push(`Clan: ${character.aslan_setup_status.clan_name}`);
  if (character.droyne_caste) lines.push(`Caste: ${titleCase(character.droyne_caste)} (${character.droyne_caste_number || "unknown"})`);
  if (character.hiver_nest_type) lines.push(`Nest: ${titleCase(character.hiver_nest_type)}`);
  if (character.kkree_wives || character.kkree_family_members.length) {
    lines.push(`Family: ${character.kkree_wives} wives, ${character.kkree_family_members.length} other members`);
    if (character.kkree_soc_rank_degree) lines.push(`Rank degree: ${titleCase(character.kkree_soc_rank_degree.replaceAll("_", " "))}`);
  }
  if (character.character_type === "robot" && character.robot_config) {
    lines.push("Type: Robot");
    for (const [key, value] of Object.entries(character.robot_config)) {
      if (["skills", "equipment", "traits"].includes(key)) continue;
      if (value != null && value !== "") lines.push(`${titleCase(key.replaceAll("_", " "))}: ${String(value)}`);
    }
  }
  if (lines.length) {
    items.push(itemShell("Creation Details", "item", {
      tl: 0,
      weight: 0,
      cost: 0,
      notes: lines.join("\n"),
      active: false,
      quantity: 1,
      status: "carried",
      legality: 0,
      description: htmlParagraphs(lines.join("\n"))
    }, "systems/mgt2e/icons/items/software.svg"));
  }
  for (const member of character.kkree_family_members) {
    items.push(itemShell(String(member.name ?? member.role ?? "K'kree Family Member"), "associate", {
      associate: { relationship: "family", affinity: 3, enmity: 0, power: 1, influence: 1 },
      relation: "family",
      description: Object.entries(member).map(([key, value]) => `${key}: ${String(value)}`).join("\n")
    }));
  }
  return items;
}

function exportTerms(character: TravellerCharacter): any[] {
  return character.term_history.map((term, index) => {
    const career = titleCase(term.career_id.replaceAll("_", " "));
    const assignment = titleCase(term.assignment_id.replaceAll("_", " "));
    const label = `${career}${assignment ? `: ${assignment}` : ""}${term.rank_title ? ` (${term.rank_title})` : ""}`;
    const description = [label, ...term.events.map((event) => `* ${event}`)].join("\n");
    return itemShell(`Term ${index + 1}: ${label}`, "term", {
      term: { number: index + 1, termLength: 4, assignment: label, randomTerm: false, randomLength: "" },
      name: "Term",
      description
    }, "systems/mgt2e/icons/misc/career.svg");
  });
}

function exportEquipment(character: TravellerCharacter): any[] {
  return character.equipment.map((equipment) => itemShell(equipment.name, "item", {
    tl: 0,
    weight: 0,
    cost: 0,
    notes: equipment.notes ?? "",
    active: false,
    quantity: equipment.quantity || 1,
    status: "carried",
    legality: 9,
    description: equipment.notes ?? ""
  }));
}

function itemShell(name: string, type: string, system: any, img = "systems/mgt2e/icons/items/item.svg"): any {
  const now = Date.now();
  return {
    name,
    type,
    system,
    _id: randomId(),
    img,
    effects: [],
    folder: null,
    sort: 0,
    flags: {},
    _stats: {
      compendiumSource: null,
      duplicateSource: null,
      exportSource: null,
      coreVersion: "13.351",
      systemId: "mgt2e",
      systemVersion: "0.21.0.0",
      lastModifiedBy: null,
      createdTime: now,
      modifiedTime: now
    },
    ownership: { default: 0 }
  };
}

function isShownCharacteristic(key: string, value: number): boolean {
  return ["STR", "DEX", "END", "INT", "EDU", "SOC"].includes(key) || (key === "PSI" && value > 0);
}

function careerSummary(character: TravellerCharacter): string {
  const last = character.completed_careers.at(-1);
  if (!last) return "";
  const career = titleCase(last.career_id.replaceAll("_", " "));
  const assignment = last.assignment_id && last.assignment_id !== "career_package" ? titleCase(last.assignment_id.replaceAll("_", " ")) : "";
  return assignment ? `${career}: ${assignment}` : career;
}

function htmlParagraphs(value: string): string {
  return `<p>${escapeHtml(value).replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br>")}</p>`;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function titleCase(value: string): string {
  return value.replace(/\w\S*/g, (part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase());
}

function randomId(): string {
  return crypto.getRandomValues(new Uint32Array(2)).reduce((id, part) => id + part.toString(16).padStart(8, "0"), "").slice(0, 16);
}
