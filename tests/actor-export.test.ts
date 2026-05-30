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

  it("exports alien creation state as visible items", () => {
    const character = newCharacter();
    character.name = "Kkree Envoy";
    character.species_id = "kkree";
    character.characteristics = { STR: 13, DEX: 7, END: 7, INT: 9, EDU: 9, SOC: 8 };
    character.kkree_wives = 2;
    character.kkree_soc_rank_degree = "merchant";
    character.kkree_family_members = [{ name: "Escort", role: "warrior" }];
    const actor = exportActorData(character);
    expect(actor.items.find((item: any) => item.name === "Creation Details")?.system.notes).toContain("2 wives");
    expect(actor.items.find((item: any) => item.name === "Escort")?.type).toBe("associate");
  });

  it("exports robot configuration details", () => {
    const character = newCharacter();
    character.character_type = "robot";
    character.robot_config = { chassis: "Probe", cost: 25000 };
    character.characteristics = { STR: 4, DEX: 8, END: 6, INT: 5, EDU: 0, SOC: 0 };
    const actor = exportActorData(character);
    expect(actor.system.termLength).toBe(0);
    expect(actor.items.find((item: any) => item.name === "Creation Details")?.system.notes).toContain("Type: Robot");
  });
});
