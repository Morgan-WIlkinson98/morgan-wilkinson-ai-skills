#!/usr/bin/env node
// Validates the Devin plugin structure. Exits non-zero on any failed check.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
let failures = 0;

function check(cond, msg) {
  if (cond) {
    console.log(`  ok: ${msg}`);
  } else {
    console.error(`FAIL: ${msg}`);
    failures++;
  }
}

function frontmatter(path) {
  const src = readFileSync(path, 'utf8');
  if (!src.startsWith('---')) return null;
  const end = src.indexOf('\n---', 3);
  if (end === -1) return null;
  return src.slice(3, end);
}

// --- Manifest ---
const manifestPath = join(root, '.devin-plugin', 'plugin.json');
check(existsSync(manifestPath), '.devin-plugin/plugin.json exists');

if (existsSync(manifestPath)) {
  let manifest;
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    check(true, 'plugin.json parses as JSON');
  } catch (e) {
    check(false, `plugin.json parses as JSON (${e.message})`);
    manifest = {};
  }
  check(
    typeof manifest.name === 'string' && /^[a-z0-9]+([-.][a-z0-9]+)*$/.test(manifest.name),
    `manifest name "${manifest.name}" is a valid plugin namespace`
  );
}

// --- Always-on rules ---
check(existsSync(join(root, 'AGENTS.md')), 'AGENTS.md exists (always-on rules)');

// --- Hooks ---
const hooksPath = join(root, 'hooks.json');
if (existsSync(hooksPath)) {
  try {
    const hooks = JSON.parse(readFileSync(hooksPath, 'utf8'));
    check(true, 'hooks.json parses as JSON');
    for (const [event, groups] of Object.entries(hooks)) {
      check(Array.isArray(groups), `hooks.json ${event} is an array of matcher groups`);
      for (const h of (Array.isArray(groups) ? groups : []).flatMap((g) => g.hooks ?? [])) {
        const script = h.command?.match(/\/(hooks\/[\w.-]+)/)?.[1];
        if (script) check(existsSync(join(root, script)), `hooks.json ${event} script ${script} exists`);
      }
    }
  } catch (e) {
    check(false, `hooks.json parses as JSON (${e.message})`);
  }
}

// --- Skills ---
const skillsDir = join(root, 'skills');
if (existsSync(skillsDir)) {
  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const skillPath = join(skillsDir, entry.name, 'SKILL.md');
    check(existsSync(skillPath), `skills/${entry.name}/SKILL.md exists`);
    if (existsSync(skillPath)) {
      const fm = frontmatter(skillPath);
      check(
        fm !== null && /^name:/m.test(fm) && /^description:/m.test(fm),
        `skills/${entry.name}/SKILL.md has name + description frontmatter`
      );
    }
  }
}

// --- Triggered rules ---
const rulesDir = join(root, 'rules');
if (existsSync(rulesDir)) {
  for (const f of readdirSync(rulesDir)) {
    if (!f.endsWith('.md')) continue;
    const fm = frontmatter(join(rulesDir, f));
    check(
      fm !== null && /^trigger:/m.test(fm) && /^description:/m.test(fm),
      `rules/${f} has trigger + description frontmatter`
    );
  }
}

if (failures > 0) {
  console.error(`\n${failures} check(s) failed`);
  process.exit(1);
}
console.log('\nAll checks passed');
