import type { RollResult } from "./types";

export class DiceRoller {
  private forced: number[];

  constructor(forcedRolls: number[] = []) {
    this.forced = [...forcedRolls];
  }

  setForcedRolls(rolls: number[]): void {
    this.forced = [...rolls];
  }

  clearForcedRolls(): void {
    this.forced = [];
  }

  d6(): number {
    return this.rollDie(6);
  }

  d3(): number {
    return Math.ceil(this.d6() / 2);
  }

  roll2D(dm = 0): RollResult {
    if (this.forced.length) {
      const total = this.forced.shift() ?? 0;
      return { dice: [], natural: total, total: total + dm, dm };
    }
    const dice = [this.d6(), this.d6()];
    const natural = dice[0] + dice[1];
    return { dice, natural, total: natural + dm, dm };
  }

  rollCharacteristic(heroic = false): RollResult {
    if (!heroic) return this.roll2D();
    if (this.forced.length) return this.roll2D();
    const dice = [this.d6(), this.d6(), this.d6()].sort((a, b) => b - a);
    const kept = dice.slice(0, 2);
    return { dice, natural: kept[0] + kept[1], total: kept[0] + kept[1], dm: 0 };
  }

  private rollDie(sides: number): number {
    return Math.floor(Math.random() * sides) + 1;
  }
}

export function characteristicDm(value: number): number {
  if (value <= 0) return -3;
  if (value <= 2) return -2;
  return Math.floor(value / 3) - 2;
}
