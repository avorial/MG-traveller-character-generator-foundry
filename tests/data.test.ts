import { describe, expect, it } from "vitest";
import { loadTestRules } from "./helpers";

describe("copied rule data", () => {
  it("loads indexed species, careers, and tables", () => {
    const rules = loadTestRules();
    expect(rules.speciesList().length).toBeGreaterThan(20);
    expect(rules.careerList().length).toBeGreaterThan(20);
    expect(rules.table("skills")).toBeTruthy();
  });
});
