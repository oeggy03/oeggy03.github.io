import path from "node:path";
import { fileURLToPath } from "node:url";
import { checkHarness } from "./lib/harness.mjs";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const result = await checkHarness(repositoryRoot);
const nodeMajor = Number(process.versions.node.split(".")[0]);

console.log(`Node.js ${process.versions.node}${nodeMajor >= 22 ? "" : " (unsupported: requires >=22)"}`);
for (const name of ["git", "npm"]) {
  const tool = result.environment?.[name];
  console.log(`${tool?.available ? "Required tool" : "Missing required tool"}: ${name}${tool?.version ? ` ${tool.version}` : tool?.error ? ` (${tool.error})` : " (not found on PATH)"}`);
}
for (const name of ["browser", "codex", "cursor"]) {
  const tool = result.environment?.[name];
  const label = name === "browser" ? "Playwright browser" : `${name} CLI`;
  if (tool?.available) console.log(`Optional available: ${label} at ${tool.executable}`);
  else if (name === "browser") console.log("Optional unavailable: bundled Playwright Chromium (install with `npx playwright install chromium` or set BROWSER_EXECUTABLE_PATH to a supported local browser)");
  else console.log(`Optional unavailable: ${label}`);
}
if (result.issues.length === 0) {
  console.log("Agent harness configuration, native adapters, shared skills, and required guides are valid.");
} else {
  for (const issue of result.issues) console.error(`FAIL ${issue}`);
  console.error(`Found ${result.issues.length} harness issue${result.issues.length === 1 ? "" : "s"}.`);
  process.exitCode = 1;
}
