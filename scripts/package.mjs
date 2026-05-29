import archiver from "archiver";
import { createWriteStream } from "node:fs";
import { copyFile } from "node:fs/promises";
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

await new Promise((resolve, reject) => {
  output.on("close", resolve);
  output.on("error", reject);
});
await copyFile(path.resolve("release", "traveller-character-creator.zip"), path.resolve("traveller-character-creator.zip"));

console.log("Wrote release/traveller-character-creator.zip and traveller-character-creator.zip");
