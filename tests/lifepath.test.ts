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
});
