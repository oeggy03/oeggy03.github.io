import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
let harnessTools;

function usage() {
  return `Usage:
  npm run setup:agents
    Read-only doctor for Node, Codex, Cursor, shared skills, and harness files.

  npm run setup:agents -- --write
    Create only missing first-party Codex and Cursor adapter files, then run the doctor.

  npm run setup:agents -- --adapter <relative.md> --agent-name <name> --docs-url <https URL>
    Preview a manual, unverified adapter for another agent. Add --write to create it only if missing.

Options:
  --help       Show this help.
  --write      Permit creation of missing files. Existing files are never overwritten.
`;
}

function parseArgs(args) {
  const options = { write: false };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === "--help" || argument === "-h") {
      options.help = true;
      continue;
    }
    if (argument === "--write") {
      options.write = true;
      continue;
    }
    if (["--adapter", "--agent-name", "--docs-url"].includes(argument)) {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) throw new Error(`${argument} requires a value`);
      const key = { "--adapter": "adapter", "--agent-name": "agentName", "--docs-url": "docsUrl" }[argument];
      if (options[key] !== undefined) throw new Error(`${argument} may only be specified once`);
      options[key] = value;
      index += 1;
      continue;
    }
    throw new Error(`unknown option: ${argument}`);
  }

  const genericFields = [options.adapter, options.agentName, options.docsUrl].filter((value) => value !== undefined).length;
  if (genericFields !== 0 && genericFields !== 3) {
    throw new Error("--adapter, --agent-name, and --docs-url must be supplied together");
  }
  if (options.adapter && !options.adapter.toLowerCase().endsWith(".md")) {
    throw new Error("--adapter must target a Markdown file with a .md extension");
  }
  if (options.agentName && (options.agentName.trim() === "" || /[\r\n\0]/.test(options.agentName))) {
    throw new Error("--agent-name must be a non-empty single-line name");
  }
  if (options.docsUrl) {
    let parsedUrl;
    try {
      parsedUrl = new URL(options.docsUrl);
    } catch {
      throw new Error("--docs-url must be an absolute HTTPS URL");
    }
    if (parsedUrl.protocol !== "https:" || parsedUrl.username || parsedUrl.password) {
      throw new Error("--docs-url must be an HTTPS URL without embedded credentials");
    }
  }
  return options;
}

async function loadManifest() {
  const resolved = await harnessTools.resolveSafeRelativePath(repositoryRoot, ".agents/harness.json");
  if (!resolved.exists) throw new Error(".agents/harness.json is missing; restore the harness manifest before setup.");
  const text = await readFile(resolved.absolutePath, "utf8");
  return harnessTools.parseJson(text, ".agents/harness.json");
}

function printDoctor(result) {
  const nodeMajor = Number(process.versions.node.split(".")[0]);
  const status = nodeMajor >= 22 ? "PASS" : "FAIL";
  console.log(`${status} Node.js ${process.versions.node} (requires >=22)`);
  for (const name of ["git", "npm"]) {
    const tool = result.environment?.[name];
    console.log(`${tool?.available ? "PASS" : "FAIL"} ${name}${tool?.version ? ` ${tool.version}` : tool?.error ? ` (${tool.error})` : " (not found on PATH)"}`);
  }
  for (const name of ["browser", "codex", "cursor"]) {
    const tool = result.environment?.[name];
    const label = name === "browser" ? "Playwright browser for UI checks" : `${name} CLI`;
    if (tool?.available) console.log(`INFO ${label} found at ${tool.executable}`);
    else if (name === "browser") console.log("INFO Bundled Playwright Chromium unavailable; install with `npx playwright install chromium` or set BROWSER_EXECUTABLE_PATH to a supported local browser.");
    else console.log(`INFO ${label} not found (optional; no login or network check was performed).`);
  }
  if (result.issues.length === 0) {
    console.log("PASS Codex and Cursor adapters, shared skills, guides, and harness configuration are valid.");
    return 0;
  }
  for (const issue of result.issues) console.error(`FAIL ${issue}`);
  console.error(`Agent harness doctor found ${result.issues.length} issue${result.issues.length === 1 ? "" : "s"}.`);
  return 1;
}

async function showGenericPreview(options) {
  const target = await harnessTools.resolveSafeRelativePath(repositoryRoot, options.adapter);
  const content = harnessTools.renderManualAdapter({
    agentName: options.agentName,
    docsUrl: options.docsUrl,
    relativePath: target.relativePath,
  });

  console.log(`Manual adapter template for ${options.agentName} (not verified).`);
  console.log(`Documentation URL supplied (not independently checked): ${options.docsUrl}`);
  console.log(`Target: ${target.relativePath}`);
  if (!options.write) {
    console.log("Preview only. Pass --write to create this file if it is missing.");
    console.log("--- preview ---");
    process.stdout.write(content);
    console.log("--- end preview ---");
    return 0;
  }

  const result = await harnessTools.createMissingAdapter(repositoryRoot, target.relativePath, content);
  if (result.created) console.log(`Created ${result.path}. Review it and complete the agent-specific setup manually.`);
  else if (result.identical) console.log(`Existing file ${result.path} already matches this template; left unchanged.`);
  else {
    console.error(`Conflict: kept existing file ${result.path} because its contents differ. It was not overwritten.`);
    return 1;
  }
  return 0;
}

async function writeMissingNativeAdapters() {
  const manifest = await loadManifest();
  const specs = harnessTools.listNativeAdapterSpecs(manifest);
  const results = [];
  for (const spec of specs) {
    const content = harnessTools.renderNativeFile(spec, manifest);
    const result = await harnessTools.createMissingAdapter(repositoryRoot, spec.path, content);
    results.push(result);
  }

  for (const result of results) {
    if (result.created) console.log(`Created ${result.path}`);
    else if (result.identical) console.log(`Kept ${result.path} (already matches; unchanged)`);
    else console.log(`Kept ${result.path} (existing contents differ; never overwritten)`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return 0;
  }

  const nodeMajor = Number(process.versions.node.split(".")[0]);
  if (nodeMajor < 22) {
    console.error(`Node.js >=22 is required; found ${process.versions.node}. Install a supported Node.js release and rerun.`);
    return 1;
  }

  try {
    harnessTools = await import("./lib/harness.mjs");
  } catch (error) {
    if (error.code === "ERR_MODULE_NOT_FOUND") {
      console.error("Harness parser dependencies are missing. From the repository root, run `npm ci` and retry.");
      return 1;
    }
    throw error;
  }

  if (options.adapter) return await showGenericPreview(options);
  if (options.write) await writeMissingNativeAdapters();
  const result = await harnessTools.checkHarness(repositoryRoot);
  return printDoctor(result);
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    console.error(`Agent setup failed: ${error.message}`);
    process.exitCode = 1;
  });
