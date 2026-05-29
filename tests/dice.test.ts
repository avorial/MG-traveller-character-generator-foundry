import { describe, expect, it } from "vitest";
import { characteristicDm, DiceRoller } from "../src/engine/dice";

describe("DiceRoller", () => {
  it("consumes forced 2D totals in order", () => {
    const roller = new DiceRoller([8, 10]);
    expect(roller.roll2D().total).toBe(8);
    expect(roller.roll2D(1).total).toBe(11);
  });

  it("calculates Traveller characteristic DMs", () => {
    expect(characteristicDm(0)).toBe(-3);
    expect(characteristicDm(2)).toBe(-2);
    expect(characteristicDm(7)).toBe(0);
    expect(characteristicDm(12)).toBe(2);
  });
});
