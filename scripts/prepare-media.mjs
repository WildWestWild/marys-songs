import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("../", import.meta.url));

// Read the actual media references so new tracks are included automatically.
export async function mediaPaths() {
  const source = await readFile(join(root, "app/page.tsx"), "utf8");
  return [...new Set([...source.matchAll(/asset\("([^"]+)"\)/g)].map((match) => match[1]))];
}

async function nonempty(path) {
  return (await stat(path).catch(() => null))?.size > 0;
}

export async function prepareMedia() {
  for (const path of await mediaPaths()) {
    const target = join(root, "public", path);
    if (await nonempty(target)) continue;
    await mkdir(dirname(target), { recursive: true });
    // Once exported, subsequent builds no longer depend on the original Site.
    const saved = join(root, "static", path);
    if (await nonempty(saved)) {
      await copyFile(saved, target);
      continue;
    }
    const url = new URL(path, "https://marys-songs.mainmaxxx.chatgpt.site");
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(url, { signal: AbortSignal.timeout(60000) });
        if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
        if (response.headers.get("content-type")?.includes("text/html")) {
          throw new Error(`Expected media, received HTML: ${url}`);
        }
        const data = Buffer.from(await response.arrayBuffer());
        if (!data.length) throw new Error(`Empty media: ${url}`);
        await writeFile(target, data);
        lastError = undefined;
        break;
      } catch (error) {
        lastError = error;
      }
    }
    if (lastError) throw lastError;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await prepareMedia();
