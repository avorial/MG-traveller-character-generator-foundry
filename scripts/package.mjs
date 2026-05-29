import archiver from "archiver";
import { createWriteStream } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";

await mkdir("release", { recursive: true });
const output = createWriteStream(path.resolve("release", "traveller-character-creator.zip"));
const archive = archiver("zip", { zlib: { level: 9 } });

archive.pipe(output);
archive.file("module.json", { name: "module.json" });
archive.directory("dist", "dist");
archive.directory("public/data", "data");
archive.file("public/SOURCE_VERSION", { name: "SOURCE_VERSION" });
archive.directory("styles", "styles");
archive.directory("templates", "templates");
await archive.finalize();

console.log("Wrote release/traveller-character-creator.zip");
