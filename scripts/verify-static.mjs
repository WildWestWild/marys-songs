import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { mediaPaths, root } from "./prepare-media.mjs";

export async function verifyStatic(directory = join(root, "static")) {
  const html = await readFile(join(directory, "index.html"), "utf8");
  assert(html.includes("Mary"), "Missing site content");
  for (const path of ["/favicon.svg", ...await mediaPaths()]) {
    assert((await stat(join(directory, path))).size > 0, `Missing asset: ${path}`);
  }
  const references = [...html.matchAll(/(?:src|href)="(\/[^"]+)"/g)];
  for (const [, reference] of references) {
    const path = reference.split(/[?#]/)[0];
    if (path === "/" || path.startsWith("//")) continue;
    assert((await stat(join(directory, decodeURIComponent(path)))).isFile(), `Broken HTML asset: ${path}`);
  }
  // Inspect executable chunks too: music and background paths are client-side.
  async function checkPaths(path) {
    for (const entry of await readdir(path, { withFileTypes: true })) {
      const child = join(path, entry.name);
      if (entry.isDirectory()) await checkPaths(child);
      else if (/\.(html|js|css|txt)$/.test(entry.name)) {
        const text = await readFile(child, "utf8");
        assert(!text.includes("/marys-songs/"), `GitHub Pages path in ${child}`);
        assert(!text.includes("marys-songs.mainmaxxx.chatgpt.site"), `Original Site dependency in ${child}`);
      }
    }
  }
  await checkPaths(directory);
  console.log("Portable export verified: HTML, bundles, favicon and all media.");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await verifyStatic();
