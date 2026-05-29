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
});
