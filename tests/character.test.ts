import { describe, expect, it } from "vitest";
import { addSkill, newCharacter } from "../src/engine/character";

describe("character skill merging", () => {
  it("increments non-fixed skill gains and caps at 4", () => {
    const character = newCharacter();
    addSkill(character, "Gun Combat", 1, "slug");
    addSkill(character, "Gun Combat", 1, "slug");
    addSkill(character, "Gun Combat", 5, "slug");
    expect(character.skills.find((skill) => skill.name === "Gun Combat" && skill.speciality === "slug")?.level).toBe(4);
    expect(character.skills.find((skill) => skill.name === "Gun Combat" && !skill.speciality)?.level).toBe(0);
  });

  it("keeps fixed-level grants only when better", () => {
    const character = newCharacter();
    addSkill(character, "Medic", 2, null, true);
    addSkill(character, "Medic", 1, null, true);
    expect(character.skills[0].level).toBe(2);
  });
});
