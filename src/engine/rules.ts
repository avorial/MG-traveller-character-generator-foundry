import type { RuleBundle } from "./types";

export const TABLE_FILES = [
  "aging",
  "aslan_background",
  "aslan_life_events",
  "asim_life_events",
  "background_packages",
  "background_skills",
  "career_packages",
  "droyne_life_events",
  "drinax_palace_life_events",
  "drinax_wasteland_life_events",
  "education",
  "hiver_life_events",
  "injury",
  "kkree_life_events",
  "life_events",
  "mustering_benefits",
  "psionics",
  "skill_packages",
  "skills",
  "societies",
  "solomani_life_events",
  "vargr_extents_life_events",
  "zhodani_life_events"
];

export class RulesIndex {
  constructor(readonly bundle: RuleBundle) {}

  species(id: string): any | undefined {
    return this.bundle.species[id];
  }

  speciesList(): any[] {
    return Object.values(this.bundle.species).sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)));
  }

  career(id: string): any | undefined {
    return this.bundle.careers[id];
  }

  careerList(): any[] {
    return Object.values(this.bundle.careers).sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)));
  }

  table<T = any>(id: string): T {
    return this.bundle.tables[id] as T;
  }
}

export async function loadRules(baseUrl: string): Promise<RulesIndex> {
  const normalized = baseUrl.replace(/\/$/, "");
  const [species, careers, tables] = await Promise.all([
    loadDirectory(`${normalized}/species/index.json`, `${normalized}/species`),
    loadDirectory(`${normalized}/careers/index.json`, `${normalized}/careers`),
    loadTables(normalized)
  ]);
  return new RulesIndex({ species, careers, tables });
}

async function loadTables(baseUrl: string): Promise<Record<string, any>> {
  const entries = await Promise.all(TABLE_FILES.map(async (name) => [name, await fetchJson(`${baseUrl}/tables/${name}.json`)] as const));
  return Object.fromEntries(entries);
}

async function loadDirectory(indexUrl: string, dirUrl: string): Promise<Record<string, any>> {
  const files = await fetchJson(indexUrl) as string[];
  const entries: [string, any][] = [];
  for (const file of files) {
    const raw = await fetchJson(`${dirUrl}/${file}`);
    const records = Array.isArray(raw) ? raw : [raw];
    for (const record of records) {
      if (record?.deprecated) continue;
      if (record?.id) entries.push([record.id, record]);
    }
  }
  return Object.fromEntries(entries);
}

async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
  return response.json();
}

