import { describe, expect, it } from "vitest";
import { DiceRoller } from "../src/engine/dice";
import { TravellerLifepathEngine } from "../src/engine/lifepath";
import { loadTestRules } from "./helpers";

describe("TravellerLifepathEngine", () => {
  it("rolls initial characteristics and advances to society", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([8, 8, 8, 8, 8, 8]));
    const result = engine.rollInitialCharacteristics(engine.freshCharacter());
    expect(result.character.characteristics.STR).toBe(8);
    expect(result.character.phase).toBe("society");
  });

  it("applies species modifiers from copied source data", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    character = engine.applySpecies(character, "imperial_vargr").character;
    expect(character.species_id).toBe("imperial_vargr");
    expect(character.phase).toBe("background");
  });

  it("applies package fast path through skill package completion", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([8, 8, 8, 8, 8, 8]));
    let character = engine.rollInitialCharacteristics(engine.freshCharacter()).character;
    character = engine.chooseSociety(character, "third_imperium").character;
    character = engine.applySpecies(character, "imperial_human").character;
    character = engine.applyBackgroundPackage(character, "belter").character;
    character = engine.applyCareerPackage(character, "scout").character;
    character = engine.applySkillPackage(character, "traveller").character;
    expect(character.phase).toBe("done");
    expect(character.skills.length).toBeGreaterThan(0);
  });

  it("qualifies for and graduates from university using education data", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([8, 10]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 9, EDU: 8, SOC: 7 };
    character = engine.qualifyForPreCareer(character, "university", { skills: "Admin, Medic" }).character;
    expect(character.phase).toBe("pre_career");
    expect(character.characteristics.EDU).toBe(9);
    character = engine.graduatePreCareer(character, ["Admin", "Medic"]).character;
    expect(character.phase).toBe("career");
    expect(character.characteristics.EDU).toBe(11);
    expect(character.skills.find((skill) => skill.name === "Admin")?.level).toBe(1);
    expect(character.skills.find((skill) => skill.name === "Medic")?.level).toBe(1);
  });

  it("runs a data-driven scout term and musters out", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([9, 1, 8, 12, 5, 6]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 8, INT: 8, EDU: 9, SOC: 7 };
    character = engine.qualifyForCareer(character, "scout").character;
    character = engine.startTerm(character, "scout", "courier").character;
    expect(character.current_term?.skills_gained.length).toBeGreaterThan(0);
    character = engine.rollOnSkillTable(character, "courier").character;
    character = engine.survivalRoll(character).character;
    character = engine.eventRoll(character).character;
    character = engine.advancementRoll(character).character;
    character = engine.endTerm(character, true).character;
    expect(character.term_history).toHaveLength(1);
    expect(character.pending_benefit_rolls).toBeGreaterThan(0);
    while (character.pending_benefit_rolls > 0) character = engine.musterOutRoll(character, "scout", "benefit").character;
    expect(character.phase).toBe("skill_package");
    expect(character.equipment.some((item) => item.name === "Scout Ship")).toBe(true);
  });

  it("handles military commission rolls from career data", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([10]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 8, INT: 8, EDU: 8, SOC: 9 };
    character = engine.startTerm(character, "navy", "line_crew").character;
    character = engine.commissionRoll(character).character;
    expect(character.current_term?.commissioned).toBe(true);
    expect(character.current_term?.rank).toBe(1);
    expect(character.current_term?.rank_title).toBe("Ensign");
  });

  it("creates and resolves injury choices", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([4]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    character = engine.applyInjury(character, 5).character;
    expect(character.pending_injury_choice?.title).toBe("Injured");
    character = engine.resolveInjuryChoice(character, "END").character;
    character = engine.resolveInjuryPayment(character, false).character;
    expect(character.characteristics.END).toBe(6);
    expect(character.pending_injury_treatment_choice).toBeNull();
  });

  it("applies aging after the fourth term", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([2]));
    let character = engine.freshCharacter();
    character.total_terms = 3;
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    character = engine.startTerm(character, "scout", "courier").character;
    character = engine.endTerm(character, true).character;
    expect(character.total_terms).toBe(4);
    expect(character.characteristics.STR).toBeLessThan(7);
  });

  it("handles pre-career education events", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([5]));
    let character = engine.freshCharacter();
    character = engine.preCareerEventRoll(character).character;
    expect(character.skills.find((skill) => skill.name === "Carouse")?.level).toBe(1);
  });

  it("can force pre-career graduation failure from event data", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([8, 3]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 9, EDU: 8, SOC: 7 };
    character = engine.qualifyForPreCareer(character, "university").character;
    character = engine.preCareerEventRoll(character).character;
    character = engine.graduatePreCareer(character, ["Admin", "Medic"]).character;
    expect(character.pre_career_status.graduated).toBe(false);
    expect(character.phase).toBe("career");
  });

  it("honors all-commissioned career flags", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character = engine.startTerm(character, "zhodani_guard", "support").character;
    expect(character.current_term?.commissioned).toBe(true);
    expect(character.current_term?.rank_title).toBe("Specialist");
  });

  it("honors no-survival Hiver careers and two-roll mustering", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([8, 8, 10]));
    let character = engine.freshCharacter();
    character.species_id = "hiver";
    character.society_id = "hiver_federation";
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 9, SOC: 10 };
    character = engine.startTerm(character, "hiver_academic", "researcher").character;
    character = engine.survivalRoll(character).character;
    expect(character.current_term?.survived).toBe(true);
    character = engine.endTerm(character, true).character;
    expect(character.completed_careers.at(-1)?.benefit_rolls_earned).toBe(2);
    character = engine.musterOutRoll(character, "hiver_academic", "benefit").character;
    expect(character.pending_benefit_rolls).toBe(1);
  });

  it("applies richer mustering benefit strings", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([5, 5]));
    let character = engine.freshCharacter();
    character.completed_careers.push({
      career_id: "navy",
      assignment_id: "line_crew",
      terms_served: 1,
      final_rank: 0,
      final_rank_title: null,
      commissioned: false,
      left_due_to: "voluntary",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 2
    });
    character.pending_benefit_rolls = 2;
    character = engine.musterOutRoll(character, "navy", "benefit").character;
    expect(character.tas_member).toBe(true);
    character = engine.musterOutRoll(character, "navy", "benefit").character;
    expect(character.ship_shares).toBe(2);
  });

  it("uses cash benefits to pay medical debt before credits", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([1]));
    let character = engine.freshCharacter();
    character.medical_debt = 12000;
    character.completed_careers.push({
      career_id: "scout",
      assignment_id: "courier",
      terms_served: 1,
      final_rank: 0,
      final_rank_title: null,
      commissioned: false,
      left_due_to: "voluntary",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 1
    });
    character.pending_benefit_rolls = 1;
    character = engine.musterOutRoll(character, "scout", "cash").character;
    expect(character.medical_debt).toBe(0);
    expect(character.credits).toBe(8000);
  });

  it("applies core life event results", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([10]));
    let character = engine.freshCharacter();
    character = engine.lifeEventRoll(character).character;
    expect(character.dm_next_benefit).toBe(2);
    expect(character.good_fortune_benefit_dm).toBe(2);
  });

  it("leaves ambiguous life events as resolvable choices", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([4]));
    let character = engine.freshCharacter();
    character = engine.lifeEventRoll(character).character;
    expect(character.pending_life_event_choice?.kind).toBe("relationship_end");
    character = engine.resolveLifeEventChoice(character, "enemy").character;
    expect(character.associates.at(-1)?.kind).toBe("enemy");
  });

  it("rolls a life event from career event 7", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([7, 9]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    character = engine.startTerm(character, "scout", "courier").character;
    character = engine.eventRoll(character).character;
    expect(character.dm_next_qualification).toBe(2);
  });

  it("consumes transfer offers as automatic qualification", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.pending_transfer_career_id = "marine";
    character = engine.qualifyForCareer(character, "marine").character;
    expect(character.failed_qualifications_this_term).toBe(0);
    expect(character.pending_transfer_career_id).toBeNull();
  });

  it("honors no-eject mishap careers", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([5, 5]));
    let character = engine.freshCharacter();
    character = engine.startTerm(character, "bounty_hunter", "hunter").character;
    character = engine.mishapRoll(character).character;
    expect(character.current_term?.survived).toBe(true);
    expect(character.force_career_end).toBe(false);
    expect(character.pending_injury_choice?.title).toBe("Injured");
  });

  it("applies Frozen Watch mishap flags", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([2]));
    let character = engine.freshCharacter();
    character.age = 22;
    character = engine.startTerm(character, "confederation_navy", "line_crew").character;
    character = engine.mishapRoll(character).character;
    expect(character.current_term?.frozen_watch).toBe(true);
    expect(character.current_term?.survived).toBe(true);
    expect(character.age).toBe(18);
  });

  it("creates and resolves career skill choices", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([4]));
    let character = engine.freshCharacter();
    character = engine.startTerm(character, "navy", "line_crew").character;
    character = engine.eventRoll(character).character;
    expect(character.pending_career_event_choice?.kind).toBe("skill_choice");
    character = engine.resolveCareerEventChoice(character, "Survival 1").character;
    expect(character.skills.find((skill) => skill.name === "Survival")?.level).toBe(1);
  });

  it("resolves career skill checks into follow-up skill choices", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([3, 11]));
    let character = engine.freshCharacter();
    character = engine.startTerm(character, "navy", "line_crew").character;
    character = engine.eventRoll(character).character;
    expect(character.pending_career_event_choice?.kind).toBe("skill_check");
    character = engine.resolveCareerEventChoice(character, "Gunner").character;
    expect(character.pending_career_event_choice?.kind).toBe("skill_choice");
  });

  it("runs the Aslan background setup sequence", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([4, 5, 7, 8, 8, 7]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 9, DEX: 8, END: 7, INT: 8, EDU: 7, SOC: 8 };
    character.species_id = "aslan";
    character = engine.beginAslanSetup(character).character;
    character = engine.chooseAslanGender(character, "male").character;
    character = engine.rollAslanClan(character).character;
    character = engine.rollAslanAncestry(character).character;
    expect(character.extra_characteristics.TER).toBeGreaterThanOrEqual(0);
    character = engine.rollAslanFamily(character).character;
    character = engine.rollAslanRite(character).character;
    expect(character.phase).toBe("background");
    expect(character.aslan_setup_status?.phase).toBe("done");
    expect(Number(character.aslan_setup_status?.rite_score)).toBeGreaterThan(0);
  });

  it("rolls Hiver nest type during species setup", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([9]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    character = engine.applySpecies(character, "hiver").character;
    expect(character.hiver_nest_type).toBe("academic");
    expect(character.characteristics.EDU).toBe(10);
  });

  it("uses Hiver status advancement thresholds", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([15]));
    let character = engine.freshCharacter();
    character.species_id = "hiver";
    character.hiver_nest_type = "academic";
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 9, SOC: 10 };
    character = engine.startTerm(character, "hiver_academic", "researcher").character;
    character = engine.advancementRoll(character).character;
    expect(character.current_term?.rank).toBe(2);
    expect(character.hiver_manipulator_bonus_awarded).toBe(true);
  });

  it("tests and trains psionic talents", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([10, 12, 9]));
    let character = engine.freshCharacter();
    character.credits = 50000;
    character = engine.testPsionics(character).character;
    expect(character.psi).toBe(12);
    character = engine.trainPsionicTalent(character, "telepathy").character;
    expect(character.psi_trained_talents).toContain("telepathy");
    expect(character.medical_debt).toBe(150000);
    expect(character.skills.find((skill) => skill.name === "Telepathy")?.level).toBe(0);
  });

  it("blocks psionics for species that cannot develop PSI", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    const character = engine.freshCharacter();
    character.species_id = "hiver";
    expect(() => engine.testPsionics(character)).toThrow(/cannot develop/);
  });

  it("applies age qualification modifiers", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([6]));
    let character = engine.freshCharacter();
    character.age = 30;
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    const result = engine.qualifyForCareer(character, "army");
    expect(result.roll).toMatchObject({ natural: 6, total: 4, dm: -2 });
    expect(result.qualified).toBe(false);
  });

  it("applies last career qualification modifiers", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([3]));
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    character.completed_careers.push({
      career_id: "agent",
      assignment_id: "law_enforcement",
      terms_served: 1,
      final_rank: 0,
      final_rank_title: null,
      commissioned: false,
      left_due_to: "voluntary",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    });
    const result = engine.qualifyForCareer(character, "bounty_hunter");
    expect(result.roll).toMatchObject({ natural: 3, total: 6, dm: 3 });
    expect(result.qualified).toBe(true);
  });

  it("blocks hard SOC qualification gates", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.society_id = "zhodani_consulate";
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 10 };
    let result = engine.qualifyForCareer(character, "zhodani_prole");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toBe("requires SOC 9-");

    character.characteristics.SOC = 9;
    result = engine.qualifyForCareer(character, "zhodani_guard");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toBe("requires SOC 10+");
  });

  it("blocks Aslan gender and rite-gated careers", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.species_id = "aslan";
    character.society_id = "aslan_hierate";
    character.gender = "male";
    character.aslan_setup_status = { rite_score: 9 };
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    let result = engine.qualifyForCareer(character, "aslan_management");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toBe("requires female gender");

    result = engine.qualifyForCareer(character, "aslan_scientist");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toBe("requires Rite 10+");
  });

  it("blocks Hiver careers that are not open to the nest type", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.species_id = "hiver";
    character.society_id = "hiver_federation";
    character.hiver_nest_type = "industrial";
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    const result = engine.qualifyForCareer(character, "hiver_academic");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toBe("not open to industrial nest Hivers");
  });

  it("runs Droyne species and caste setup", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([3, 3, 3, 3, 3, 8, 6]));
    let character = engine.freshCharacter();
    character = engine.applySpecies(character, "droyne").character;
    expect(character.age).toBe(12);
    expect(character.characteristics.STR).toBe(4);
    expect(character.characteristics.SOC).toBe(0);
    expect(character.psi).toBe(8);

    character = engine.rollDroyneCaste(character, "technician").character;
    expect(character.droyne_caste).toBe("technician");
    expect(character.droyne_caste_number).toBe(4);
    expect(character.characteristics.DEX).toBe(7);
    expect(character.characteristics.INT).toBe(8);
    expect(character.skills.find((skill) => skill.name === "Flight")?.level).toBe(0);
  });

  it("blocks Droyne careers outside the character caste", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.species_id = "droyne";
    character.society_id = "droyne_oytrip";
    character.droyne_caste = "worker";
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 0 };
    const result = engine.qualifyForCareer(character, "droyne_warrior");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toBe("requires warrior caste");
  });

  it("blocks gender-restricted assignments", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.species_id = "aslan";
    character.gender = "female";
    expect(() => engine.startTerm(character, "aslan_spacer", "pilot")).toThrow(/not available to female/);
  });

  it("blocks restricted career skill tables", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 7 };
    character = engine.startTerm(character, "agent", "law_enforcement").character;
    expect(() => engine.rollOnSkillTable(character, "intelligence")).toThrow(/only available/);
    expect(() => engine.rollOnSkillTable(character, "advanced_education")).toThrow(/requires EDU 8/);
  });

  it("blocks commission and alien characteristic skill tables", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 8, SOC: 7 };
    character = engine.startTerm(character, "army", "infantry").character;
    expect(() => engine.rollOnSkillTable(character, "officer")).toThrow(/requires a commission/);

    character = engine.freshCharacter();
    character.species_id = "hiver";
    character.hiver_nest_type = "academic";
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 8, SOC: 7 };
    character.extra_characteristics.RES = 6;
    character = engine.startTerm(character, "hiver_academic", "researcher").character;
    expect(() => engine.rollOnSkillTable(character, "active_academic")).toThrow(/requires RES 7/);
  });

  it("blocks careers that require prior source-career service", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.society_id = "third_imperium";
    character.characteristics = { STR: 10, DEX: 7, END: 10, INT: 9, EDU: 9, SOC: 9 };
    let result = engine.qualifyForCareer(character, "ini");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toMatch(/requires prior service/);

    character.completed_careers.push({
      career_id: "navy",
      assignment_id: "line_crew",
      terms_served: 1,
      final_rank: 1,
      final_rank_title: null,
      commissioned: true,
      left_due_to: "voluntary",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    });
    result = engine.qualifyForCareer(character, "ini");
    expect(result.blockedReason).toBeUndefined();
  });

  it("blocks Imperial Guard until a source career has advanced", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.society_id = "third_imperium";
    character.characteristics = { STR: 10, DEX: 7, END: 10, INT: 7, EDU: 7, SOC: 9 };
    character.completed_careers.push({
      career_id: "army",
      assignment_id: "infantry",
      terms_served: 1,
      final_rank: 0,
      final_rank_title: null,
      commissioned: false,
      left_due_to: "voluntary",
      benefit_rolls_used: 0,
      benefit_rolls_earned: 0
    });
    let result = engine.qualifyForCareer(character, "imperial_guard");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toBe("requires advancement in a source career");

    character.term_history.push({
      career_id: "army",
      assignment_id: "infantry",
      term_number: 1,
      overall_term_number: 1,
      rank: 1,
      rank_title: null,
      commissioned: false,
      events: [],
      skills_gained: [],
      survived: true,
      advanced: true,
      mishap: null,
      basic_training: true,
      benefit_forfeited: false,
      survival_roll_total: 8,
      advancement_roll_total: 10,
      cover_career_id: null,
      frozen_watch: false
    });
    result = engine.qualifyForCareer(character, "imperial_guard");
    expect(result.blockedReason).toBeUndefined();
  });

  it("applies K'kree species setup and family state", () => {
    const engine = new TravellerLifepathEngine(loadTestRules());
    let character = engine.freshCharacter();
    character.characteristics = { STR: 7, DEX: 7, END: 7, INT: 7, EDU: 7, SOC: 8 };
    character = engine.applySpecies(character, "kkree").character;
    expect(character.age).toBe(14);
    expect(character.gender).toBe("male");
    expect(character.kkree_wives).toBe(1);
    expect(character.kkree_soc_rank_degree).toBe("merchant");
    expect(character.skills.find((skill) => skill.name === "Patriarchy")?.level).toBe(0);

    character = engine.setupKkreeFamily(character, 2, [{ role: "warrior", name: "Escort" }]).character;
    expect(character.kkree_wives).toBe(2);
    expect(character.kkree_family_members).toHaveLength(1);
  });

  it("enforces K'kree SOC caste careers and Patriarchy checks", () => {
    const engine = new TravellerLifepathEngine(loadTestRules(), new DiceRoller([3]));
    let character = engine.freshCharacter();
    character.species_id = "kkree";
    character.society_id = "two_thousand_worlds";
    character.gender = "male";
    character.characteristics = { STR: 13, DEX: 7, END: 7, INT: 9, EDU: 9, SOC: 8 };
    let result = engine.qualifyForCareer(character, "kkree_noble");
    expect(result.qualified).toBe(false);
    expect(result.blockedReason).toBe("requires SOC 11+");

    character.skills.push({ name: "Patriarchy", level: 1, speciality: null });
    character = engine.startTerm(character, "kkree_servant", "service").character;
    result = engine.advancementRoll(character);
    expect(result.roll).toMatchObject({ natural: 3, total: 4, dm: 1 });
    expect(result.advanced).toBe(true);
  });
});
