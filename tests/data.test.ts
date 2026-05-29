import { describe, expect, it } from "vitest";
import { loadTestRules } from "./helpers";

describe("copied rule data", () => {
  it("loads indexed species, careers, and tables", () => {
    const rules = loadTestRules();
    expect(rules.speciesList().length).toBeGreaterThan(20);
    expect(rules.careerList().length).toBeGreaterThan(20);
    expect(rules.table("skills")).toBeTruthy();
  });

  it("loads the normalized catalog for full data browsing", () => {
    const rules = loadTestRules();
    expect(rules.catalog.counts.species).toBe(rules.speciesList().length);
    expect(rules.catalog.counts.careers).toBe(rules.careerList().length);
    expect(rules.catalog.societies.length).toBeGreaterThan(5);
    expect(rules.catalog.packages.background.length).toBeGreaterThan(5);
    expect(rules.catalog.packages.career.length).toBeGreaterThan(10);
    expect(rules.catalog.packages.skill.length).toBeGreaterThan(5);
  });

  it("resolves species and careers by society from catalog indexes", () => {
    const rules = loadTestRules();
    expect(rules.speciesForSociety("third_imperium").map((species) => species.id)).toContain("imperial_human");
    expect(rules.speciesForSociety("vargr_extents").map((species) => species.id)).toContain("extents_vargr");
    expect(rules.careersForSociety("third_imperium").map((career) => career.id)).toContain("scout");
  });
});
