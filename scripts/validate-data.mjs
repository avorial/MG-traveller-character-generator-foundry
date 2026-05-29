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

if (failures) process.exit(1);
console.log("Traveller rule data validated.");
