import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, readFile, rm, symlink, unlink, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  checkHarness,
  createMissingAdapter,
  findExecutableOnPath,
  listNativeAdapterSpecs,
  parseFrontmatter,
  parseJson,
  parseTomlDocument,
  parseYamlDocument,
  renderManualAdapter,
  renderNativeFile,
  resolveSafeRelativePath,
} from "./harness.mjs";

const fixtureRoot = fileURLToPath(new URL("../tests/fixtures/", import.meta.url));
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const fixture = (name) => readFile(path.join(fixtureRoot, name), "utf8");

test("current repository harness has parseable native adapters and skills", async () => {
  const result = await checkHarness(projectRoot);
  assert.deepEqual(result.issues, []);
});

test("JSON fixture is parsed into a structured object", async () => {
  const value = parseJson(await fixture("valid.json"), "valid JSON fixture");
  assert.equal(value.settings.readOnlyByDefault, true);
  assert.deepEqual(value.agents, ["codex", "cursor"]);
});

test("TOML fixture preserves nested tables, arrays, and typed values", async () => {
  const value = parseTomlDocument(await fixture("valid.toml"), "valid TOML fixture");
  assert.equal(value.model, "gpt-6.1-sol");
  assert.equal(value.agents.enabled, true);
  assert.equal(value.agents.max_concurrent_threads_per_session, 3);
  assert.deepEqual(value.agents.roles, ["coordinator", "reviewer"]);
});

test("Cursor YAML frontmatter and skill YAML frontmatter are structurally parsed", async () => {
  const cursor = parseFrontmatter(await fixture("valid.mdc"), "Cursor fixture");
  assert.equal(cursor.data.alwaysApply, true);
  assert.deepEqual(cursor.data.metadata.skills, ["portfolio-feature", "portfolio-verify"]);
  assert.match(cursor.body, /Read AGENTS\.md/);

  const skill = parseFrontmatter(await fixture("valid-skill.md"), "skill fixture");
  assert.equal(skill.data.name, "fixture-skill");
  assert.deepEqual(skill.data.metadata.triggers, ["implementation", "verification"]);
});

test("structured parsers reject malformed and duplicate-key documents", async () => {
  await assert.rejects(fixture("invalid.json").then((text) => parseJson(text, "bad JSON")), /bad JSON/);
  await assert.rejects(fixture("invalid.toml").then((text) => parseTomlDocument(text, "bad TOML")), /bad TOML/);
  await assert.rejects(fixture("invalid.mdc").then((text) => parseFrontmatter(text, "bad frontmatter")), /duplicate|Unique|already exists/i);
  assert.throws(() => parseYamlDocument("- item\n", "array YAML"), /expected a YAML mapping/);
});

test("safe adapter paths reject traversal and absolute paths", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-harness-path-"));
  try {
    await assert.rejects(resolveSafeRelativePath(root, "../outside.md"), /unsafe|relative|escapes/i);
    await assert.rejects(resolveSafeRelativePath(root, "C:\\outside.md"), /relative/i);
    await assert.rejects(resolveSafeRelativePath(root, "/outside.md"), /relative/i);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("safe adapter paths reject symlink escapes", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-harness-symlink-"));
  const outside = await mkdtemp(path.join(os.tmpdir(), "portfolio-harness-outside-"));
  try {
    try {
      await symlink(outside, path.join(root, "escape"), process.platform === "win32" ? "junction" : "dir");
    } catch (error) {
      if (["EPERM", "EACCES", "ENOSYS"].includes(error.code)) {
        t.skip(`symlinks unavailable in this environment (${error.code})`);
        return;
      }
      throw error;
    }
    await assert.rejects(resolveSafeRelativePath(root, "escape/adapter.md"), /outside the repository root/);
  } finally {
    await rm(root, { recursive: true, force: true });
    await rm(outside, { recursive: true, force: true });
  }
});

test("PATH discovery supports Windows executable suffixes", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-harness-path-search-"));
  try {
    const fakeNpm = path.join(root, "npm.CMD");
    await writeFile(fakeNpm, "@echo off\r\necho 99.0.0\r\n");
    assert.equal(
      findExecutableOnPath("npm", { pathValue: root, pathExt: ".EXE;.CMD", platform: "win32" }),
      fakeNpm,
    );
    assert.equal(findExecutableOnPath("missing", { pathValue: root, platform: "win32" }), undefined);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("creation is opt-in at the caller and never overwrites an existing adapter", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "portfolio-harness-write-"));
  try {
    const first = await createMissingAdapter(root, ".agent/config.md", "first version\n");
    assert.deepEqual(first, { created: true, path: ".agent/config.md" });

    const second = await createMissingAdapter(root, ".agent/config.md", "replacement\n");
    assert.deepEqual(second, { created: false, identical: false, reason: "conflict", path: ".agent/config.md" });
    assert.equal(await readFile(path.join(root, ".agent/config.md"), "utf8"), "first version\n");

    const same = await createMissingAdapter(root, ".agent/config.md", "first version\n");
    assert.deepEqual(same, { created: false, identical: true, reason: "identical", path: ".agent/config.md" });
    assert.equal(await readFile(path.join(root, ".agent/config.md"), "utf8"), "first version\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test("setup CLI reports missing Git and npm with an isolated PATH", async () => {
  const emptyPath = await mkdtemp(path.join(os.tmpdir(), "portfolio-harness-empty-path-"));
  try {
    const scriptPath = fileURLToPath(new URL("../setup-agents.mjs", import.meta.url));
    const result = spawnSync(process.execPath, [scriptPath], {
      encoding: "utf8",
      env: { ...process.env, PATH: emptyPath },
      timeout: 10000,
      windowsHide: true,
    });
    assert.equal(result.status, 1, result.stderr);
    assert.match(`${result.stdout}\n${result.stderr}`, /git.*not found on PATH/i);
    assert.match(`${result.stdout}\n${result.stderr}`, /npm.*not found on PATH/i);
  } finally {
    await rm(emptyPath, { recursive: true, force: true });
  }
});

test("generic adapter CLI previews by default and protects divergent targets", async () => {
  const token = `${process.pid}-${Date.now()}`;
  const relativePath = `.cursor/agents/harness-cli-${token}.md`;
  const targetPath = path.join(projectRoot, relativePath);
  const scriptPath = fileURLToPath(new URL("../setup-agents.mjs", import.meta.url));
  const baseArgs = [
    scriptPath,
    "--adapter",
    relativePath,
    "--agent-name",
    "Fixture Agent",
    "--docs-url",
    "https://example.org/agent-docs",
  ];
  const run = (args) =>
    spawnSync(process.execPath, args, {
      encoding: "utf8",
      timeout: 10000,
      windowsHide: true,
    });

  try {
    const preview = run(baseArgs);
    assert.equal(preview.status, 0, preview.stderr);
    assert.match(preview.stdout, /Preview only/);
    await assert.rejects(readFile(targetPath), { code: "ENOENT" });

    const created = run([...baseArgs, "--write"]);
    assert.equal(created.status, 0, created.stderr);
    assert.match(created.stdout, /Created/);
    const originalBytes = await readFile(targetPath);

    const identical = run([...baseArgs, "--write"]);
    assert.equal(identical.status, 0, identical.stderr);
    assert.match(identical.stdout, /already matches/);

    const conflict = run([
      ...baseArgs.slice(0, 4),
      "Different Agent",
      ...baseArgs.slice(5),
      "--write",
    ]);
    assert.equal(conflict.status, 1);
    assert.match(conflict.stderr, /Conflict: kept existing file/);
    assert.deepEqual(await readFile(targetPath), originalBytes);
  } finally {
    await unlink(targetPath).catch((error) => {
      if (error.code !== "ENOENT") throw error;
    });
  }
});

test("manual adapter preview identifies its unverified status and keeps links relative", async () => {
  const preview = renderManualAdapter({
    agentName: "Example Agent",
    docsUrl: "https://example.com/docs/project-rules",
    relativePath: ".example/rules/portfolio.md",
  });
  assert.match(preview, /manual, unverified adapter template/i);
  assert.match(preview, /https:\/\/example\.com\/docs\/project-rules/);
  assert.match(preview, /\.\.\/\.\.\/AGENTS\.md/);
  assert.match(preview, /\.\.\/\.\.\/docs\/agent-workflow\.md/);
  assert.match(preview, /does not select a model, invoke an agent, change global settings, or access the network/);
});

test("missing reviewer adapters preserve their read-only contract", async () => {
  const manifest = parseJson(await readFile(path.join(projectRoot, ".agents/harness.json"), "utf8"));
  const reviewer = manifest.roles.find((role) => role.name === "reviewer");
  const generatedCursor = renderNativeFile({ template: "cursor-role", role: reviewer }, manifest);
  assert.equal(parseFrontmatter(generatedCursor, "generated reviewer adapter").data.readonly, true);
  const generatedCodex = parseTomlDocument(
    renderNativeFile({ template: "codex-role", role: reviewer }, manifest),
    "generated Codex reviewer adapter",
  );
  assert.match(generatedCodex.developer_instructions, /read-only and must not edit files/i);
});

test("all missing native adapter templates render as parseable TOML or YAML", async () => {
  const manifest = parseJson(await readFile(path.join(projectRoot, ".agents/harness.json"), "utf8"));
  for (const spec of listNativeAdapterSpecs(manifest)) {
    const rendered = renderNativeFile(spec, manifest);
    if (spec.format === "toml") parseTomlDocument(rendered, `generated ${spec.path}`);
    else assert.doesNotThrow(() => parseFrontmatter(rendered, `generated ${spec.path}`));
  }
});
