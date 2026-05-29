import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const dataRoot = path.resolve("public", "data");
const outPath = path.join(dataRoot, "catalog.json");

const species = await loadRecords("species");
const careers = await loadRecords("careers");
const tables = await loadTables();
const sourceVersion = await readOptional(path.resolve("public", "SOURCE_VERSION"));

const societies = normalizeSocieties(tables.societies);
const speciesBySociety = Object.fromEntries(societies.map((society) => [
  society.id,
  society.speciesIds.map((id) => species[id]).filter(Boolean).map(summarySpecies)
]));

const careerSummaries = Object.values(careers).map(summaryCareer).sort(byName);
const careersBySociety = groupCareersBySociety(careerSummaries, societies);

const catalog = {
  source: {
    repository: "avorial/MG-traveller-character-generator",
    version: sourceVersion.trim() || "unknown"
  },
  generatedAt: new Date().toISOString(),
  counts: {
    societies: societies.length,
    species: Object.keys(species).length,
    careers: Object.keys(careers).length,
    tables: Object.keys(tables).length,
    backgroundPackages: Object.keys(tables.background_packages?.packages ?? {}).length,
    careerPackages: Object.keys(tables.career_packages?.packages ?? {}).length,
    skillPackages: Object.keys(tables.skill_packages?.packages ?? {}).length
  },
  societies,
  species: Object.values(species).map(summarySpecies).sort(byName),
  speciesBySociety,
  careers: careerSummaries,
  careersBySociety,
  packages: {
    background: summarizePackages(tables.background_packages?.packages ?? {}),
    career: summarizePackages(tables.career_packages?.packages ?? {}),
    skill: summarizePackages(tables.skill_packages?.packages ?? {})
  },
  skills: {
    core: tables.skills?.core ?? [],
    speciality: tables.skills?.speciality ?? {},
    background: tables.background_skills?.skills ?? []
  },
  education: Object.values(tables.education?.tracks ?? {}).map((track) => ({
    id: track.id,
    name: track.name,
    ageCost: track.age_cost ?? 0,
    maxAge: track.max_age ?? null,
    services: Object.keys(track.services ?? {}),
    skillCount: Array.isArray(track.skill_list) ? track.skill_list.length : 0
  })).sort(byName),
  tables: Object.fromEntries(Object.entries(tables).map(([id, table]) => [id, tableSummary(id, table)]))
};

await writeFile(outPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath}`);

async function loadRecords(dir) {
  const records = {};
  const files = JSON.parse(await readFile(path.join(dataRoot, dir, "index.json"), "utf8"));
  for (const file of files) {
    const raw = JSON.parse(await readFile(path.join(dataRoot, dir, file), "utf8"));
    const entries = Array.isArray(raw) ? raw : [raw];
    for (const entry of entries) {
      if (entry?.deprecated || !entry?.id) continue;
      records[entry.id] = entry;
    }
  }
  return records;
}

async function loadTables() {
  const dir = path.join(dataRoot, "tables");
  const files = (await readdir(dir)).filter((file) => file.endsWith(".json")).sort();
  const tables = {};
  for (const file of files) {
    tables[path.basename(file, ".json")] = JSON.parse(await readFile(path.join(dir, file), "utf8"));
  }
  return tables;
}

async function readOptional(file) {
  try {
    return await readFile(file, "utf8");
  } catch {
    return "";
  }
}

function normalizeSocieties(raw) {
  return (raw?.societies ?? []).map((society) => ({
    id: society.id,
    name: society.name,
    subtitle: society.subtitle ?? "",
    speciesIds: society.species_ids ?? []
  })).sort(byName);
}

function summarySpecies(species) {
  return {
    id: species.id,
    name: species.name,
    societies: species.societies ?? [],
    aliases: species.aliases ?? [],
    source: species.source ?? "",
    characteristicModifiers: species.characteristic_modifiers ?? {},
    requiredExtraCharacteristics: species.extra_characteristics_required ?? [],
    forbiddenSkills: species.forbidden_skills ?? [],
    allowedSpeciesCareers: species.allowed_species_careers ?? [],
    blockedCareers: species.blocked_careers ?? [],
    traits: (species.traits ?? []).map((trait) => trait.name ?? trait.id ?? String(trait)),
    sortOrder: species.sort_order ?? 9999
  };
}

function summaryCareer(career) {
  const assignments = Object.entries(career.assignments ?? {}).map(([id, assignment]) => ({
    id,
    name: assignment.name ?? id,
    survival: assignment.survival ?? null,
    advancement: assignment.advancement ?? null
  })).sort(byName);
  const skillTables = Object.entries(career.skill_tables ?? {}).map(([id, table]) => ({
    id,
    name: table.name ?? id,
    assignmentOnly: table.assignment_only ?? null,
    requiresEdu: table.requires_edu ?? null,
    results: Object.keys(table).filter((key) => /^\d+$/.test(key)).length
  })).sort(byName);
  return {
    id: career.id,
    name: career.name,
    source: career.source ?? "",
    societies: career.societies ?? [],
    qualification: career.qualification ?? null,
    assignments,
    assignmentCount: assignments.length,
    skillTables,
    skillTableCount: skillTables.length,
    rankTracks: Object.keys(career.ranks ?? {}),
    eventResults: Object.keys(career.events ?? {}).filter((key) => /^\d+$/.test(key)).map(Number).sort((a, b) => a - b),
    mishapResults: Object.keys(career.mishaps ?? {}).filter((key) => /^\d+$/.test(key)).map(Number).sort((a, b) => a - b),
    musteringOut: career.mustering_out ? Object.keys(career.mustering_out) : []
  };
}

function groupCareersBySociety(careers, societies) {
  const groups = Object.fromEntries(societies.map((society) => [society.id, []]));
  groups.any = [];
  for (const career of careers) {
    const ids = career.societies.length ? career.societies : ["any"];
    for (const id of ids) {
      groups[id] ??= [];
      groups[id].push({ id: career.id, name: career.name });
    }
  }
  for (const list of Object.values(groups)) list.sort(byName);
  return groups;
}

function summarizePackages(packages) {
  return Object.values(packages).map((pkg) => ({
    id: pkg.id ?? "",
    name: pkg.name,
    statMods: pkg.stat_mods ?? pkg.characteristic_modifiers ?? {},
    skillCount: Array.isArray(pkg.skills) ? pkg.skills.length : 0,
    credits: pkg.credits ?? 0,
    equipmentCount: Array.isArray(pkg.equipment) ? pkg.equipment.length : 0,
    rank: pkg.rank ?? null,
    rankTitle: pkg.rank_title ?? null
  })).sort(byName);
}

function tableSummary(id, table) {
  if (Array.isArray(table)) return { id, kind: "array", entries: table.length };
  if (table && typeof table === "object") {
    return {
      id,
      kind: "object",
      topLevelKeys: Object.keys(table).length,
      packageCount: Object.keys(table.packages ?? {}).length,
      trackCount: Object.keys(table.tracks ?? {}).length
    };
  }
  return { id, kind: typeof table };
}

function byName(a, b) {
  return String(a.name ?? a.id).localeCompare(String(b.name ?? b.id));
}
