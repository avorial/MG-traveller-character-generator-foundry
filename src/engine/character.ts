import type { CharacteristicKey, Skill, TravellerCharacter } from "./types";

export const CORE_CHARACTERISTICS = ["STR", "DEX", "END", "INT", "EDU", "SOC"] as const;
export const ALL_CHARACTERISTICS: CharacteristicKey[] = [
  "STR", "DEX", "END", "INT", "EDU", "SOC", "CHA", "TER", "PSI", "WLT", "LCK", "MRL", "STY", "RES", "FOL", "REP"
];

export function newCharacter(): TravellerCharacter {
  return {
    name: "",
    homeworld: "",
    homeworld_uwp: "",
    species_id: "imperial_human",
    society_id: "third_imperium",
    characteristics: { STR: 0, DEX: 0, END: 0, INT: 0, EDU: 0, SOC: 0 },
    age: 18,
    skills: [],
    current_term: null,
    completed_careers: [],
    term_history: [],
    total_terms: 0,
    pre_career_terms: 0,
    credits: 0,
    medical_debt: 0,
    ship_shares: 0,
    pension_per_year: 0,
    equipment: [],
    associates: [],
    traits: [],
    pending_benefit_rolls: 0,
    cash_rolls_used: 0,
    dm_next_advancement: 0,
    dm_permanent_advancement: 0,
    dm_next_qualification: 0,
    dm_next_benefit: 0,
    dm_next_survival: 0,
    dm_next_events: 0,
    good_fortune_benefit_dm: 0,
    failed_qualifications_this_term: 0,
    pending_life_event_choice: null,
    pending_injury_choice: null,
    pending_injury_treatment_choice: null,
    pending_career_mishap_choice: null,
    pending_career_event_choice: null,
    pending_muster_benefit_choice: null,
    tas_member: false,
    pre_career_status: {},
    pre_career_permanent_dms: {},
    auto_entry_career_id: null,
    auto_qualify_career_ids: [],
    starts_commissioned_career_id: null,
    starts_commissioned_rank: null,
    academy_commission_career_id: null,
    academy_commission_dm: 0,
    permanent_advancement_dm_by_career: {},
    permanent_qualification_dm_by_career: {},
    banned_career_ids: [],
    forced_next_career_id: null,
    pending_transfer_career_id: null,
    pending_transfer_rank: null,
    gender: null,
    clan_shares: 0,
    aslan_setup_status: null,
    kkree_wives: 0,
    kkree_family_members: [],
    kkree_soc_rank_degree: "servant_of_rankholder",
    kkree_specialist_area: null,
    solsec_monitor: false,
    solsec_monitor_rank: 0,
    user_notes: "",
    boon_rolls_total: 0,
    boon_rolls_remaining: 0,
    extra_characteristics: {},
    reputation: 0,
    psi: 0,
    psi_tested: false,
    psi_trained_talents: [],
    forbidden_skills: [],
    career_package_id: null,
    career_package_taken: false,
    droyne_caste: null,
    droyne_caste_number: 0,
    droyne_caste_mods_applied: false,
    hiver_nest_type: null,
    hiver_senior_bonus_awarded: false,
    hiver_manipulator_bonus_awarded: false,
    capsule_description: "",
    pre_outcast_soc: 0,
    force_career_end: false,
    ejected_by_event: false,
    character_type: "biological",
    robot_config: null,
    phase: "characteristics",
    notes: [],
    dead: false,
    death_reason: null
  };
}

export function cloneCharacter(character: TravellerCharacter): TravellerCharacter {
  return structuredClone(character);
}

export function getCharacteristic(character: TravellerCharacter, key: CharacteristicKey): number {
  if (key in character.characteristics) return Number(character.characteristics[key as keyof typeof character.characteristics] ?? 0);
  return Number(character.extra_characteristics[key] ?? 0);
}

export function setCharacteristic(character: TravellerCharacter, key: CharacteristicKey, value: number): void {
  const safe = Math.max(0, Math.trunc(value));
  if (key in character.characteristics) {
    character.characteristics[key as keyof typeof character.characteristics] = safe;
  } else {
    character.extra_characteristics[key] = safe;
  }
}

export function addSkill(character: TravellerCharacter, name: string, level = 0, speciality: string | null = null, fixedLevel = false): string {
  if (character.forbidden_skills.includes(name) || (speciality && character.forbidden_skills.includes(`${name} (${speciality})`))) {
    return `Skipped ${formatSkill(name, speciality)} (forbidden by species)`;
  }

  const existing = character.skills.find((skill) => skill.name === name && (skill.speciality ?? null) === speciality);
  if (existing) {
    if (level === 0) return `Already has ${formatSkill(name, speciality)} ${existing.level}`;
    if (fixedLevel) {
      if (level > existing.level) {
        existing.level = Math.min(level, 4);
        sortSkills(character.skills);
        return `Increased ${formatSkill(name, speciality)} to ${existing.level}`;
      }
      return `${formatSkill(name, speciality)} unchanged (already ${existing.level})`;
    }
    existing.level = Math.min(existing.level + level, 4);
    sortSkills(character.skills);
    return `Increased ${formatSkill(name, speciality)} to ${existing.level}`;
  }

  const newLevel = Math.max(0, level);
  character.skills.push({ name, level: newLevel, speciality });
  if (speciality && newLevel >= 1 && !character.skills.some((skill) => skill.name === name && !skill.speciality)) {
    character.skills.push({ name, level: 0, speciality: null });
  }
  sortSkills(character.skills);
  return `Gained ${formatSkill(name, speciality)} ${newLevel}`;
}

export function formatSkill(name: string, speciality?: string | null): string {
  return `${name}${speciality ? ` (${speciality})` : ""}`;
}

function sortSkills(skills: Skill[]): void {
  skills.sort((a, b) => `${a.name.toLowerCase()}\u0000${a.speciality ?? ""}`.localeCompare(`${b.name.toLowerCase()}\u0000${b.speciality ?? ""}`));
}
