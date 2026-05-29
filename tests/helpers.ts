import { readFileSync } from "node:fs";
import path from "node:path";
import { RulesIndex, TABLE_FILES } from "../src/engine/rules";

export function loadTestRules(): RulesIndex {
  const root = path.resolve("public", "data");
  const species = loadDir(root, "species");
  const careers = loadDir(root, "careers");
  const tables = Object.fromEntries(TABLE_FILES.map((name) => [name, readJson(path.join(root, "tables", `${name}.json`))]));
  const catalog = readJson(path.join(root, "catalog.json"));
  return new RulesIndex({ species, careers, tables, catalog: catalog as any });
}

function loadDir(root: string, dir: string): Record<string, any> {
  const files = readJson(path.join(root, dir, "index.json")) as string[];
  const entries: [string, any][] = [];
  for (const file of files) {
    const raw = readJson(path.join(root, dir, file));
    const records = Array.isArray(raw) ? raw : [raw];
    for (const record of records) {
      if (record?.deprecated) continue;
      if (record?.id) entries.push([record.id, record]);
    }
  }
  return Object.fromEntries(entries);
}

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, "utf8"));
}
