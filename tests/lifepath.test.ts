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
});
