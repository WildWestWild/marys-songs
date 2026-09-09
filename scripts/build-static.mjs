import { cp, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { prepareMedia, root } from "./prepare-media.mjs";
import { verifyStatic } from "./verify-static.mjs";

await prepareMedia();
const result = spawnSync(process.execPath, [join(root, "node_modules/next/dist/bin/next"), "build"], {
  cwd: root,
  env: { ...process.env, SITE_BASE_PATH: "" },
  stdio: "inherit",
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const output = join(root, "out");
await verifyStatic(output);
// Preserve the previous export if build or validation fails.
await rm(join(root, "static"), { recursive: true, force: true });
await cp(output, join(root, "static"), { recursive: true });
console.log("Ready: upload the contents of static/ to the web root of your hosting.");
