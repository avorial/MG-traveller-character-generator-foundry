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
const speciesRecords = await countLoadableRecords("species");
const careerRecords = await countLoadableRecords("careers");
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

if (failures) process.exit(1);
console.log("Traveller rule data validated.");

async function countLoadableRecords(dirName) {
  const dir = path.join(dataRoot, dirName);
  const files = (await readdir(dir)).filter((file) => file.endsWith(".json") && file !== "index.json");
  let count = 0;
  for (const file of files) {
    const raw = JSON.parse(await readFile(path.join(dir, file), "utf8"));
    const records = Array.isArray(raw) ? raw : [raw];
    count += records.filter((record) => record?.id && !record?.deprecated).length;
  }
  return count;
}
