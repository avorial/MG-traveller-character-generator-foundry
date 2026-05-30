import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const dataRoot = path.resolve("public", "data");
let failures = 0;

for (const dir of ["species", "careers", "tables"]) {
  const full = path.join(dataRoot, dir);
  const files = (await readdir(full)).filter((file) => file.endsWith(".json"));
  for (const file of files) {
    try {
      JSON.parse(await readFile(path.join(full, file), "utf8"));
    } catch (error) {
      failures++;
      console.error(`${dir}/${file}: ${error.message}`);
    }
  }
}

for (const dir of ["species", "careers"]) {
  const files = (await readdir(path.join(dataRoot, dir))).filter((file) => file.endsWith(".json") && file !== "index.json").sort();
  const index = JSON.parse(await readFile(path.join(dataRoot, dir, "index.json"), "utf8"));
  if (JSON.stringify(files) !== JSON.stringify(index)) {
    failures++;
    console.error(`${dir}/index.json is stale. Run npm run sync:data or regenerate indexes.`);
  }
}

const catalog = JSON.parse(await readFile(path.join(dataRoot, "catalog.json"), "utf8"));
const species = await loadRecords("species");
const careers = await loadRecords("careers");
const speciesRecords = species.length;
const careerRecords = careers.length;
if (catalog.counts.species !== speciesRecords) {
  failures++;
  console.error(`catalog species count ${catalog.counts.species} does not match loadable species records ${speciesRecords}`);
}
if (catalog.counts.careers !== careerRecords) {
  failures++;
  console.error(`catalog career count ${catalog.counts.careers} does not match loadable career records ${careerRecords}`);
}
for (const society of catalog.societies ?? []) {
  const known = new Set(catalog.species.map((entry) => entry.id));
  for (const speciesId of society.speciesIds ?? []) {
    if (!known.has(speciesId)) {
      failures++;
      console.error(`catalog society ${society.id} references missing species ${speciesId}`);
    }
  }
}

const knownSpecies = new Set(species.map((record) => record.id));
const knownCareers = new Set(careers.map((record) => record.id));
const knownSocieties = new Set([
  ...(catalog.societies ?? []).map((record) => record.id),
  ...Object.keys(catalog.careersBySociety ?? {}),
  "any",
  "glorious_empire"
]);
const tableFiles = new Set((await readdir(path.join(dataRoot, "tables"))).filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, "")));

for (const record of species) {
  for (const careerId of [...(record.blocked_careers ?? []), ...(record.allowed_species_careers ?? [])]) {
    if (!knownCareers.has(careerId)) fail(`species ${record.id} references missing career ${careerId}`);
  }
  for (const societyId of record.societies ?? []) {
    if (!knownSocieties.has(societyId)) fail(`species ${record.id} references missing society ${societyId}`);
  }
  if (record.life_events_table && !tableFiles.has(record.life_events_table) && !tableFiles.has(`${record.life_events_table}_life_events`)) {
    fail(`species ${record.id} references missing life-events table ${record.life_events_table}`);
  }
}

for (const career of careers) {
  for (const speciesId of [...(career.allowed_species ?? []), ...(career.blocked_species ?? [])]) {
    if (!knownSpecies.has(speciesId)) fail(`career ${career.id} references missing species ${speciesId}`);
  }
  for (const societyId of [...(career.societies ?? []), ...(career.allowed_societies ?? []), ...(career.blocked_societies ?? [])]) {
    if (!knownSocieties.has(societyId)) fail(`career ${career.id} references missing society ${societyId}`);
  }
  for (const careerId of career.requires_source_career ?? []) {
    if (!knownCareers.has(careerId)) fail(`career ${career.id} references missing source career ${careerId}`);
  }
  const assignments = assignmentIds(career);
  for (const [tableId, table] of Object.entries(career.skill_tables ?? {})) {
    if (table.assignment_only && !assignments.has(table.assignment_only)) fail(`career ${career.id} table ${tableId} references missing assignment ${table.assignment_only}`);
  }
}

if (failures) process.exit(1);
console.log("Traveller rule data validated.");

function fail(message) {
  failures++;
  console.error(message);
}

async function loadRecords(dirName) {
  const dir = path.join(dataRoot, dirName);
  const files = (await readdir(dir)).filter((file) => file.endsWith(".json") && file !== "index.json");
  const records = [];
  for (const file of files) {
    const raw = JSON.parse(await readFile(path.join(dir, file), "utf8"));
    records.push(...(Array.isArray(raw) ? raw : [raw]).filter((record) => record?.id && !record?.deprecated));
  }
  return records;
}

function assignmentIds(career) {
  if (Array.isArray(career.assignments)) return new Set(career.assignments.map((assignment) => assignment.id));
  return new Set(Object.keys(career.assignments ?? {}));
}
