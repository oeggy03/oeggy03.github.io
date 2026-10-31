import { spawnSync } from "node:child_process";
import { existsSync, statSync } from "node:fs";
import { lstat, mkdir, readFile, realpath, writeFile } from "node:fs/promises";
import path from "node:path";
import { parse as parseToml } from "smol-toml";
import { parse as parseYaml } from "yaml";

const requiredRoleNames = ["coordinator", "developer", "reviewer", "verifier"];

const escapeTomlString = (value) => JSON.stringify(value);

const roleGuidance = (role) => {
  const readonly = role.readonly ? " This role is read-only and must not edit files." : "";
  return `Read AGENTS.md and docs/agent-workflow.md. Follow the ${role.name} role contract there, including its scope and delivery limits.${readonly} Confirm the configured model and reasoning variant in the client before writing.`;
};

const within = (root, candidate) => {
  const relative = path.relative(root, candidate);
  return (
    relative === "" ||
    (relative !== ".." && !relative.startsWith(`..${path.sep}`) && !path.isAbsolute(relative))
  );
};

export function findExecutableOnPath(command, {
  pathValue = process.env.PATH ?? "",
  pathExt = process.env.PATHEXT ?? ".COM;.EXE;.BAT;.CMD",
  platform = process.platform,
} = {}) {
  const extensions = platform === "win32" ? pathExt.split(";").filter(Boolean) : [""];
  const hasExtension = path.extname(command) !== "";
  const commandNames = hasExtension ? [command] : extensions.map((extension) => `${command}${extension}`);
  for (const directoryValue of pathValue.split(path.delimiter)) {
    const directory = directoryValue.trim().replace(/^"|"$/g, "");
    if (!directory) continue;
    for (const name of commandNames) {
      const candidate = path.resolve(directory, name);
      try {
        if (statSync(candidate).isFile()) return candidate;
      } catch {
        // Keep searching the remaining PATH entries.
      }
    }
  }
  return undefined;
}

function inspectVersionCommand(command) {
  const executable = findExecutableOnPath(command);
  if (!executable) return { available: false, executable: undefined, version: undefined };
  const isWindowsScript = process.platform === "win32" && /\.(?:cmd|bat)$/i.test(executable);
  const result = isWindowsScript
    ? spawnSync(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", `""${executable}" --version"`], {
        encoding: "utf8",
        timeout: 5000,
        windowsVerbatimArguments: true,
        windowsHide: true,
      })
    : spawnSync(executable, ["--version"], {
        encoding: "utf8",
        timeout: 5000,
        windowsHide: true,
      });
  const version = result.status === 0 ? result.stdout.trim().split(/\r?\n/, 1)[0] : undefined;
  return {
    available: result.status === 0,
    executable,
    version,
    error:
      result.error?.message ??
      (result.status === 0 ? undefined : result.stderr.trim() || `process exited with code ${result.status ?? "unknown"}`),
  };
}

export async function detectEnvironment() {
  const git = inspectVersionCommand("git");
  const npm = inspectVersionCommand("npm");
  const codex = findExecutableOnPath("codex");
  const cursor = findExecutableOnPath("cursor");

  let browserPath = process.env.BROWSER_EXECUTABLE_PATH;
  if (!browserPath) {
    try {
      const { chromium } = await import("@playwright/test");
      browserPath = chromium.executablePath();
    } catch {
      // Browser support is optional for the read-only harness doctor.
    }
  }
  let browserAvailable = false;
  if (browserPath && existsSync(path.resolve(browserPath))) {
    try {
      browserAvailable = statSync(path.resolve(browserPath)).isFile();
    } catch {
      browserAvailable = false;
    }
  }

  return {
    git,
    npm,
    codex: { available: Boolean(codex), executable: codex },
    cursor: { available: Boolean(cursor), executable: cursor },
    browser: { available: browserAvailable, executable: browserAvailable ? path.resolve(browserPath) : browserPath },
  };
}

export function parseJson(text, label = "JSON") {
  try {
    const value = JSON.parse(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("expected a JSON object");
    }
    return value;
  } catch (error) {
    throw new Error(`${label}: ${error.message}`, { cause: error });
  }
}

export function parseTomlDocument(text, label = "TOML") {
  try {
    const value = parseToml(text);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("expected a TOML table");
    }
    return value;
  } catch (error) {
    throw new Error(`${label}: ${error.message}`, { cause: error });
  }
}

export function parseYamlDocument(text, label = "YAML") {
  try {
    const value = parseYaml(text, { uniqueKeys: true });
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("expected a YAML mapping");
    }
    return value;
  } catch (error) {
    throw new Error(`${label}: ${error.message}`, { cause: error });
  }
}

export function parseFrontmatter(text, label = "Markdown") {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!match) {
    throw new Error(`${label}: expected YAML frontmatter delimited by ---`);
  }
  return {
    data: parseYamlDocument(match[1], `${label} frontmatter`),
    body: text.slice(match[0].length),
  };
}

export async function resolveSafeRelativePath(root, relativePath) {
  if (typeof relativePath !== "string" || relativePath.trim() === "") {
    throw new Error("adapter path must be a non-empty relative path");
  }
  if (relativePath.includes("\0")) throw new Error("adapter path contains a null byte");

  const portable = relativePath.replaceAll("\\", "/");
  if (
    portable.startsWith("/") ||
    portable.startsWith("//") ||
    /^[a-zA-Z]:/.test(portable)
  ) {
    throw new Error("adapter path must be relative to the repository root");
  }

  const segments = portable.split("/");
  if (
    segments.some(
      (segment) =>
        segment === "" ||
        segment === "." ||
        segment === ".." ||
        segment.includes(":") ||
        segment.endsWith(".") ||
        segment.endsWith(" "),
    )
  ) {
    throw new Error("adapter path contains an unsafe or non-portable path segment");
  }

  const rootPath = path.resolve(root);
  const rootRealPath = await realpath(rootPath);
  const absolutePath = path.resolve(rootPath, ...segments);
  if (!within(rootPath, absolutePath)) throw new Error("adapter path escapes the repository root");

  let currentPath = rootPath;
  for (const segment of segments) {
    currentPath = path.join(currentPath, segment);
    try {
      await lstat(currentPath);
    } catch (error) {
      if (error.code === "ENOENT") continue;
      throw error;
    }

    let resolvedPath;
    try {
      resolvedPath = await realpath(currentPath);
    } catch (error) {
      throw new Error(`adapter path contains an unresolved link: ${currentPath}`, { cause: error });
    }
    if (!within(rootRealPath, resolvedPath)) {
      throw new Error(`adapter path resolves outside the repository root: ${currentPath}`);
    }
  }

  let exists = false;
  try {
    await lstat(absolutePath);
    exists = true;
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }

  return { absolutePath, exists, relativePath: segments.join("/") };
}

export function renderManualAdapter({ agentName, docsUrl, relativePath }) {
  const safeName = agentName.trim().replace(/\s+/g, " ");
  const escapedName = safeName
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replace(/[\\`*_{}[\]()#+.!|]/g, "\\$&");
  const adapterDirectory = path.posix.dirname(relativePath);
  const guidancePath = path.posix.relative(adapterDirectory, "AGENTS.md") || "AGENTS.md";
  const workflowPath = path.posix.relative(adapterDirectory, "docs/agent-workflow.md");
  const skillsPath = path.posix.relative(adapterDirectory, ".agents/skills/");
  return `<!-- Generated adapter template. Manual setup required; not verified with this agent. -->
# ${escapedName} repository adapter

This is a manual, unverified adapter template for **${escapedName}**. Confirm its location and behavior against the [supplied agent documentation](<${docsUrl}>) before relying on it.

Read [AGENTS.md](${guidancePath}) and [docs/agent-workflow.md](${workflowPath}) for the canonical repository guidance. Discover reusable workflows in [.agents/skills/](${skillsPath}). Follow the selected agent's documented project-level instruction discovery convention to load this file.

This template does not select a model, invoke an agent, change global settings, or access the network. Adapt it manually if the target agent documents different metadata or discovery rules.
`;
}

export function renderNativeFile(spec, manifest) {
  if (spec.template === "codex-config") {
    const coordinator = manifest.roles.find((role) => role.name === "coordinator");
    const developer = manifest.roles.find((role) => role.name === "developer");
    return `model = ${escapeTomlString(coordinator.model)}\nmodel_reasoning_effort = ${escapeTomlString(coordinator.reasoning)}\n\n[agents]\nenabled = true\nmax_concurrent_threads_per_session = 3\ndefault_subagent_model = ${escapeTomlString(developer.model)}\ndefault_subagent_reasoning_effort = ${escapeTomlString(developer.reasoning)}\n`;
  }

  if (spec.template === "cursor-rule") {
    return `---\ndescription: Repository guidance adapter; follow the canonical project policy and shared skills.\nalwaysApply: true\n---\n\nRead the repository's [AGENTS.md](../../AGENTS.md) and [docs/agent-workflow.md](../../docs/agent-workflow.md). Use the shared workflows in .agents/skills/ when applicable. These files are canonical; do not duplicate or override their product, role, branch, verification, or delivery rules. Native client model and reasoning availability must be checked in the client.\n`;
  }

  const role = spec.role;
  if (!role || !requiredRoleNames.includes(role.name)) throw new Error(`Unknown adapter template: ${spec.template}`);
  const instructions = roleGuidance(role);

  if (spec.template === "codex-role") {
    return [
      `name = ${escapeTomlString(role.name)}`,
      `description = ${escapeTomlString(role.description)}`,
      `model = ${escapeTomlString(role.model)}`,
      `model_reasoning_effort = ${escapeTomlString(role.reasoning)}`,
      `developer_instructions = ${escapeTomlString(instructions)}`,
      "",
    ].join("\n");
  }

  if (spec.template === "cursor-role") {
    const readonly = role.readonly ? "readonly: true\n" : "";
    return `---\nname: ${role.name}\ndescription: ${role.description}\nmodel: ${role.model}\n${readonly}---\n\n${instructions}\n`;
  }

  throw new Error(`Unknown adapter template: ${spec.template}`);
}

export function listNativeAdapterSpecs(manifest) {
  const specs = [...manifest.nativeFiles];
  for (const role of manifest.roles) {
    specs.push({ path: role.codexPath, format: "toml", template: "codex-role", role });
    specs.push({ path: role.cursorPath, format: "yaml-frontmatter", template: "cursor-role", role });
  }
  return specs;
}

export async function createMissingAdapter(root, relativePath, content) {
  const resolved = await resolveSafeRelativePath(root, relativePath);
  if (resolved.exists) {
    const existing = await readFile(resolved.absolutePath);
    const identical = existing.equals(Buffer.from(content, "utf8"));
    return {
      created: false,
      identical,
      reason: identical ? "identical" : "conflict",
      path: resolved.relativePath,
    };
  }

  await mkdir(path.dirname(resolved.absolutePath), { recursive: true });
  const checkedAgain = await resolveSafeRelativePath(root, relativePath);
  if (checkedAgain.exists) {
    const existing = await readFile(checkedAgain.absolutePath);
    const identical = existing.equals(Buffer.from(content, "utf8"));
    return {
      created: false,
      identical,
      reason: identical ? "identical" : "conflict",
      path: checkedAgain.relativePath,
    };
  }

  try {
    await writeFile(checkedAgain.absolutePath, content, { encoding: "utf8", flag: "wx" });
    return { created: true, path: checkedAgain.relativePath };
  } catch (error) {
    if (error.code === "EEXIST") {
      const existing = await readFile(checkedAgain.absolutePath);
      const identical = existing.equals(Buffer.from(content, "utf8"));
      return {
        created: false,
        identical,
        reason: identical ? "identical" : "conflict",
        path: checkedAgain.relativePath,
      };
    }
    throw error;
  }
}

async function readRequired(root, relativePath, issues) {
  try {
    const resolved = await resolveSafeRelativePath(root, relativePath);
    if (!resolved.exists) {
      issues.push(`${resolved.relativePath}: missing`);
      return undefined;
    }
    return await readFile(resolved.absolutePath, "utf8");
  } catch (error) {
    issues.push(`${relativePath}: ${error.code === "ENOENT" ? "missing" : error.message}`);
    return undefined;
  }
}

function requireValue(issues, actual, expected, label) {
  if (actual !== expected) issues.push(`${label}: expected ${JSON.stringify(expected)}, found ${JSON.stringify(actual)}`);
}

export async function checkHarness(root) {
  const issues = [];
  const environment = await detectEnvironment();
  if (!environment.git.available) {
    issues.push(`Git is required. Install Git and add it to PATH. ${environment.git.error ?? "Git was not found on PATH."}`);
  }
  if (!environment.npm.available) {
    issues.push(`npm is required. Install Node.js 22 or newer with npm and add npm to PATH. ${environment.npm.error ?? "npm was not found on PATH."}`);
  }
  const manifestText = await readRequired(root, ".agents/harness.json", issues);
  if (manifestText === undefined) return { issues, manifest: undefined, environment };

  let manifest;
  try {
    manifest = parseJson(manifestText, ".agents/harness.json");
  } catch (error) {
    return { issues: [error.message], manifest: undefined, environment };
  }

  requireValue(issues, manifest.schemaVersion, 1, "harness schemaVersion");
  const isString = (value) => typeof value === "string" && value.trim() !== "";
  const isStringArray = (value) => Array.isArray(value) && value.every(isString);
  const rolesValid =
    Array.isArray(manifest.roles) &&
    manifest.roles.every(
      (role) =>
        role &&
        typeof role === "object" &&
        isString(role.name) &&
        isString(role.description) &&
        isString(role.model) &&
        isString(role.reasoning) &&
        isString(role.codexPath) &&
        isString(role.cursorPath) &&
        (role.readonly === undefined || typeof role.readonly === "boolean"),
    );
  const nativeFilesValid =
    Array.isArray(manifest.nativeFiles) &&
    manifest.nativeFiles.every(
      (spec) =>
        spec &&
        typeof spec === "object" &&
        isString(spec.path) &&
        isString(spec.format) &&
        isString(spec.template),
    );
  if (!isStringArray(manifest.canonicalGuidance)) issues.push("harness canonicalGuidance must be an array of paths");
  if (!isStringArray(manifest.requiredGuides)) issues.push("harness requiredGuides must be an array of paths");
  if (!rolesValid) issues.push("harness roles must be objects with complete model, path, and description fields");
  if (!isStringArray(manifest.skills)) issues.push("harness skills must be an array of skill names");
  if (!nativeFilesValid) issues.push("harness nativeFiles must define a path, format, and template for each file");
  if (!isString(manifest.sharedSkillsRoot)) issues.push("harness sharedSkillsRoot must be a relative path");
  if (!isString(manifest.runtime?.node)) issues.push("harness runtime.node must declare the required Node version");
  if (
    !isStringArray(manifest.canonicalGuidance) ||
    !isStringArray(manifest.requiredGuides) ||
    !rolesValid ||
    !isStringArray(manifest.skills) ||
    !nativeFilesValid ||
    !isString(manifest.sharedSkillsRoot)
  ) {
    return { issues, manifest, environment };
  }

  const nodeMajor = Number(process.versions.node.split(".")[0]);
  if (nodeMajor < 22) issues.push(`Node.js >=22 is required; found ${process.versions.node}`);
  requireValue(issues, manifest.runtime?.node, ">=22", "harness Node requirement");
  const nvmrc = (await readRequired(root, manifest.runtime?.versionFile ?? ".nvmrc", issues))?.trim();
  if (nvmrc !== undefined && (!nvmrc || !/^\d+(?:\.\d+)*$/.test(nvmrc) || Number(nvmrc.split(".")[0]) < 22)) {
    issues.push(`.nvmrc must select Node.js 22 or newer; found ${nvmrc}`);
  }

  for (const relativePath of [...(manifest.canonicalGuidance ?? []), ...(manifest.requiredGuides ?? [])]) {
    await readRequired(root, relativePath, issues);
  }

  const projectPackageText = await readRequired(root, "package.json", issues);
  let projectPackage;
  if (projectPackageText) {
    try {
      projectPackage = parseJson(projectPackageText, "package.json");
    } catch (error) {
      issues.push(error.message);
    }
  }
  requireValue(issues, projectPackage?.engines?.node, ">=22", "package.json engines.node");
  requireValue(issues, projectPackage?.scripts?.["setup:agents"], "node scripts/setup-agents.mjs", "package script setup:agents");
  requireValue(issues, projectPackage?.scripts?.["check:harness"], "node scripts/check-harness.mjs", "package script check:harness");
  requireValue(issues, projectPackage?.scripts?.["test:harness"], "node --test scripts/lib/harness.test.mjs", "package script test:harness");

  const workflow = await readRequired(root, ".github/workflows/deploy-pages.yml", issues);
  if (workflow) {
    try {
      const workflowData = parseYamlDocument(workflow, ".github/workflows/deploy-pages.yml");
      const steps = workflowData.jobs?.verify?.steps;
      const commands = Array.isArray(steps) ? steps.map((step) => step?.run).filter((run) => typeof run === "string") : [];
      if (!commands.some((run) => run.includes("npm run check:harness")) || !commands.some((run) => run.includes("npm run test:harness"))) {
        issues.push(".github/workflows/deploy-pages.yml must run both harness checks in the verify job");
      }
    } catch (error) {
      issues.push(error.message);
    }
  }

  const roleNames = manifest.roles.map((role) => role.name);
  for (const name of requiredRoleNames) {
    if (!roleNames.includes(name)) issues.push(`harness roles must include ${name}`);
  }
  for (const role of manifest.roles) {
    const codexText = await readRequired(root, role.codexPath, issues);
    if (codexText !== undefined) {
      try {
        const codex = parseTomlDocument(codexText, role.codexPath);
        requireValue(issues, codex.name, role.name, `${role.codexPath} name`);
        requireValue(issues, codex.model, role.model, `${role.codexPath} model`);
        requireValue(issues, codex.model_reasoning_effort, role.reasoning, `${role.codexPath} reasoning`);
        if (role.readonly && !/read-only|do not edit/i.test(codex.developer_instructions ?? "")) {
          issues.push(`${role.codexPath}: reviewer instructions must preserve read-only behavior`);
        }
      } catch (error) {
        issues.push(error.message);
      }
    }

    const cursorText = await readRequired(root, role.cursorPath, issues);
    if (cursorText !== undefined) {
      try {
        const cursor = parseFrontmatter(cursorText, role.cursorPath).data;
        requireValue(issues, cursor.name, role.name, `${role.cursorPath} name`);
        requireValue(issues, cursor.model, role.model, `${role.cursorPath} model`);
        if (role.readonly) requireValue(issues, cursor.readonly, true, `${role.cursorPath} readonly`);
      } catch (error) {
        issues.push(error.message);
      }
    }
  }

  const codexConfigSpec = manifest.nativeFiles.find((spec) => spec.template === "codex-config");
  if (codexConfigSpec) {
    const configText = await readRequired(root, codexConfigSpec.path, issues);
    if (configText !== undefined) {
      try {
        const config = parseTomlDocument(configText, codexConfigSpec.path);
        const coordinator = manifest.roles.find((role) => role.name === "coordinator");
        const developer = manifest.roles.find((role) => role.name === "developer");
        requireValue(issues, config.model, coordinator?.model, `${codexConfigSpec.path} model`);
        requireValue(issues, config.model_reasoning_effort, coordinator?.reasoning, `${codexConfigSpec.path} reasoning`);
        requireValue(issues, config.agents?.enabled, true, `${codexConfigSpec.path} agents.enabled`);
        requireValue(issues, config.agents?.default_subagent_model, developer?.model, `${codexConfigSpec.path} default subagent model`);
        requireValue(issues, config.agents?.default_subagent_reasoning_effort, developer?.reasoning, `${codexConfigSpec.path} default subagent reasoning`);
      } catch (error) {
        issues.push(error.message);
      }
    }
  }

  for (const spec of manifest.nativeFiles) {
    const text = await readRequired(root, spec.path, issues);
    if (text === undefined) continue;
    try {
      if (spec.format === "toml") parseTomlDocument(text, spec.path);
      else if (spec.format === "yaml-frontmatter") {
        const parsed = parseFrontmatter(text, spec.path);
        if (spec.template === "cursor-rule") {
          requireValue(issues, parsed.data.alwaysApply, true, `${spec.path} alwaysApply`);
          for (const requiredText of ["AGENTS.md", "docs/agent-workflow.md", ".agents/skills"]) {
            if (!parsed.body.includes(requiredText)) issues.push(`${spec.path}: body must reference ${requiredText}`);
          }
        }
      }
      else issues.push(`${spec.path}: unsupported native adapter format ${spec.format}`);
    } catch (error) {
      issues.push(error.message);
    }
  }

  for (const skill of manifest.skills) {
    const skillPath = path.join(manifest.sharedSkillsRoot, skill, "SKILL.md");
    const skillText = await readRequired(root, skillPath, issues);
    if (skillText === undefined) continue;
    try {
      const metadata = parseFrontmatter(skillText, skillPath).data;
      requireValue(issues, metadata.name, skill, `${skillPath} name`);
      if (typeof metadata.description !== "string" || metadata.description.trim() === "") {
        issues.push(`${skillPath}: description must be a non-empty string`);
      }
    } catch (error) {
      issues.push(error.message);
    }
  }

  return { issues, manifest, environment };
}
