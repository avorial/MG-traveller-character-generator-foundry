import { describe, expect, it } from "vitest";
import { addSkill, newCharacter } from "../src/engine/character";
import { exportActorData } from "../src/foundry/actor-export";

describe("mgt2e actor export", () => {
  it("creates traveller actor data with flags and skill specialties", () => {
    const character = newCharacter();
    character.name = "Test Traveller";
    character.characteristics = { STR: 7, DEX: 8, END: 9, INT: 10, EDU: 11, SOC: 12 };
    character.phase = "done";
    addSkill(character, "Gun Combat", 1, "Slug");
    const actor = exportActorData(character, { sourceVersion: "test", entryYear: 1105 });
    expect(actor.type).toBe("traveller");
    expect(actor.system.characteristics.STR.value).toBe(7);
    expect(actor.system.skills.guncombat.specialities.slug.value).toBe("1");
    expect(actor.flags.travellerCreator.sourceVersion).toBe("test");
  });
});
