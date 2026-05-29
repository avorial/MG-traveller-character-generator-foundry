import { cp, mkdir, readdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const source = process.env.TRAVELLER_GENERATOR_DIR;
if (!source) {
  console.error("Set TRAVELLER_GENERATOR_DIR to a checkout of avorial/MG-traveller-character-generator.");
  process.exit(1);
}

const dataSource = path.join(source, "app", "data");
if (!existsSync(dataSource)) {
  console.error(`Missing source data directory: ${dataSource}`);
  process.exit(1);
}

const dest = path.resolve("public", "data");
await mkdir(dest, { recursive: true });
await cp(dataSource, dest, { recursive: true, force: true });

const versionFile = path.join(source, "VERSION");
if (existsSync(versionFile)) await cp(versionFile, path.resolve("public", "SOURCE_VERSION"), { force: true });

await writeIndexes(dest);
console.log(`Synced Traveller generator data into ${dest}`);

async function writeIndexes(base) {
  for (const dir of ["species", "careers"]) {
    const files = (await readdir(path.join(base, dir))).filter((file) => file.endsWith(".json")).sort();
    await writeFile(path.join(base, dir, "index.json"), `${JSON.stringify(files, null, 2)}\n`, "utf8");
  }
}
