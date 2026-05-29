export type CharacteristicKey =
  | "STR" | "DEX" | "END" | "INT" | "EDU" | "SOC"
  | "CHA" | "TER" | "PSI" | "WLT" | "LCK" | "MRL" | "STY" | "RES" | "FOL" | "REP";

export type CharacterPhase =
  | "characteristics"
  | "society"
  | "species"
  | "aslan_setup"
  | "zhodani_training"
  | "background"
  | "pre_career"
  | "career"
  | "mustering"
  | "skill_package"
  | "robot_build"
  | "done";

export interface Characteristics {
  STR: number;
  DEX: number;
  END: number;
  INT: number;
  EDU: number;
  SOC: number;
}

export interface Skill {
  name: string;
  level: number;
  speciality?: string | null;
}

export interface Associate {
  kind: "ally" | "contact" | "rival" | "enemy" | string;
  description: string;
}

export interface Equipment {
  name: string;
  quantity: number;
  notes?: string | null;
  protection?: number | null;
}

export interface CareerTerm {
  career_id: string;
  assignment_id: string;
  term_number: number;
  overall_term_number: number;
  rank: number;
  rank_title?: string | null;
  commissioned: boolean;
  events: string[];
  skills_gained: string[];
  survived?: boolean | null;
  advanced?: boolean | null;
  mishap?: string | null;
  basic_training: boolean;
  benefit_forfeited: boolean;
  survival_roll_total?: number | null;
  advancement_roll_total?: number | null;
  cover_career_id?: string | null;
  frozen_watch: boolean;
}

export interface CareerRecord {
  career_id: string;
  assignment_id: string;
  terms_served: number;
  final_rank: number;
  final_rank_title?: string | null;
  commissioned: boolean;
  left_due_to: string;
  benefit_rolls_used: number;
  benefit_rolls_earned: number;
}

export interface TravellerCharacter {
  name: string;
  homeworld: string;
  homeworld_uwp: string;
  species_id: string;
  society_id: string;
  characteristics: Characteristics;
  age: number;
  skills: Skill[];
  current_term?: CareerTerm | null;
  completed_careers: CareerRecord[];
  term_history: CareerTerm[];
  total_terms: number;
  pre_career_terms: number;
  credits: number;
  medical_debt: number;
  ship_shares: number;
  pension_per_year: number;
  equipment: Equipment[];
  associates: Associate[];
  traits: Record<string, unknown>[];
  pending_benefit_rolls: number;
  cash_rolls_used: number;
  dm_next_advancement: number;
  dm_permanent_advancement: number;
  dm_next_qualification: number;
  dm_next_benefit: number;
  dm_next_survival: number;
  dm_next_events: number;
  good_fortune_benefit_dm: number;
  failed_qualifications_this_term: number;
  pending_life_event_choice?: Record<string, unknown> | null;
  pending_injury_choice?: Record<string, unknown> | null;
  pending_injury_treatment_choice?: Record<string, unknown> | null;
  pending_career_mishap_choice?: Record<string, unknown> | null;
  pending_career_event_choice?: Record<string, unknown> | null;
  pending_muster_benefit_choice?: Record<string, unknown> | null;
  tas_member: boolean;
  pre_career_status: Record<string, unknown>;
  pre_career_permanent_dms: Record<string, unknown>;
  auto_entry_career_id?: string | null;
  auto_qualify_career_ids: string[];
  starts_commissioned_career_id?: string | null;
  starts_commissioned_rank?: number | null;
  academy_commission_career_id?: string | null;
  academy_commission_dm: number;
  permanent_advancement_dm_by_career: Record<string, number>;
  permanent_qualification_dm_by_career: Record<string, number>;
  banned_career_ids: string[];
  forced_next_career_id?: string | null;
  pending_transfer_career_id?: string | null;
  pending_transfer_rank?: number | null;
  gender?: string | null;
  clan_shares: number;
  aslan_setup_status?: Record<string, unknown> | null;
  kkree_wives: number;
  kkree_family_members: Record<string, unknown>[];
  kkree_soc_rank_degree: string;
  kkree_specialist_area?: string | null;
  solsec_monitor: boolean;
  solsec_monitor_rank: number;
  user_notes: string;
  boon_rolls_total: number;
  boon_rolls_remaining: number;
  extra_characteristics: Partial<Record<CharacteristicKey, number>>;
  reputation: number;
  psi: number;
  psi_tested: boolean;
  psi_trained_talents: string[];
  forbidden_skills: string[];
  career_package_id?: string | null;
  career_package_taken: boolean;
  droyne_caste?: string | null;
  droyne_caste_number: number;
  droyne_caste_mods_applied: boolean;
  hiver_nest_type?: string | null;
  hiver_senior_bonus_awarded: boolean;
  hiver_manipulator_bonus_awarded: boolean;
  capsule_description: string;
  pre_outcast_soc: number;
  force_career_end: boolean;
  ejected_by_event: boolean;
  character_type: "biological" | "robot";
  robot_config?: Record<string, unknown> | null;
  phase: CharacterPhase;
  notes: string[];
  dead: boolean;
  death_reason?: string | null;
}

export interface RollResult {
  dice: number[];
  total: number;
  dm: number;
  natural: number;
}

export interface RuleBundle {
  species: Record<string, any>;
  careers: Record<string, any>;
  tables: Record<string, any>;
  catalog: RulesCatalog;
}

export interface RulesCatalog {
  source: {
    repository: string;
    version: string;
  };
  generatedAt: string;
  counts: Record<string, number>;
  societies: CatalogSociety[];
  species: CatalogSpecies[];
  speciesBySociety: Record<string, CatalogSpecies[]>;
  careers: CatalogCareer[];
  careersBySociety: Record<string, Pick<CatalogCareer, "id" | "name">[]>;
  packages: {
    background: CatalogPackage[];
    career: CatalogPackage[];
    skill: CatalogPackage[];
  };
  skills: {
    core: string[];
    speciality: Record<string, string[]>;
    background: string[];
  };
  education: CatalogEducationTrack[];
  tables: Record<string, unknown>;
}

export interface CatalogSociety {
  id: string;
  name: string;
  subtitle: string;
  speciesIds: string[];
}

export interface CatalogSpecies {
  id: string;
  name: string;
  societies: string[];
  aliases: string[];
  source: string;
  characteristicModifiers: Record<string, number>;
  requiredExtraCharacteristics: string[];
  forbiddenSkills: string[];
  allowedSpeciesCareers: string[];
  blockedCareers: string[];
  traits: string[];
  sortOrder: number;
}

export interface CatalogCareer {
  id: string;
  name: string;
  source: string;
  societies: string[];
  qualification: unknown;
  assignments: CatalogAssignment[];
  assignmentCount: number;
  skillTables: CatalogSkillTable[];
  skillTableCount: number;
  rankTracks: string[];
  eventResults: number[];
  mishapResults: number[];
  musteringOut: string[];
}

export interface CatalogAssignment {
  id: string;
  name: string;
  survival: unknown;
  advancement: unknown;
}

export interface CatalogSkillTable {
  id: string;
  name: string;
  assignmentOnly: string | null;
  requiresEdu: number | null;
  results: number;
}

export interface CatalogPackage {
  id: string;
  name: string;
  statMods: Record<string, number>;
  skillCount: number;
  credits: number;
  equipmentCount: number;
  rank: number | null;
  rankTitle: string | null;
}

export interface CatalogEducationTrack {
  id: string;
  name: string;
  ageCost: number;
  maxAge: number | null;
  services: string[];
  skillCount: number;
}
