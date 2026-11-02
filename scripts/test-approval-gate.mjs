#!/usr/bin/env node
// Tests hooks/approval-gate.mjs by feeding it hook payloads. Exits non-zero on any failure.
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

const gate = join(dirname(fileURLToPath(import.meta.url)), '..', 'hooks', 'approval-gate.mjs');
const dataDir = mkdtempSync(join(tmpdir(), 'approval-gate-test-'));
let failures = 0;

function run(payload) {
  return spawnSync(process.execPath, [gate], {
    input: JSON.stringify(payload),
    env: { ...process.env, PLUGIN_DATA: dataDir },
    encoding: 'utf8',
  }).status;
}

const prompt = (id, text) => run({ hook_event_name: 'UserPromptSubmit', session_id: 's1', prompt_id: id, prompt: text });
const exec = (id, command) => run({ hook_event_name: 'PreToolUse', session_id: 's1', prompt_id: id, tool_name: 'exec', tool_input: { command } });

function expect(name, actual, expected) {
  if (actual === expected) {
    console.log(`  ok: ${name}`);
  } else {
    console.error(`FAIL: ${name} (exit ${actual}, expected ${expected})`);
    failures++;
  }
}

try {
  expect('prompt without approval is recorded', prompt('p1', 'this looks good, ok'), 0);
  expect('git push blocked without approval', exec('p1', 'git push -u origin feature/x'), 2);
  expect('git -C <dir> push blocked', exec('p1', 'git -C /repo push'), 2);
  expect('chained git push blocked', exec('p1', 'git add . && git commit -m x && git push'), 2);
  expect('gh pr create blocked', exec('p1', 'gh pr create --title t --body b'), 2);
  expect('gh pr merge blocked', exec('p1', 'gh pr merge 3 --squash'), 2);
  expect('ungated commands allowed', exec('p1', 'git status && git commit -m "push docs"'), 0);
  expect('gh pr view allowed', exec('p1', 'gh pr view 3'), 0);
  expect(
    'MCP create_pull_request blocked',
    run({ hook_event_name: 'PreToolUse', session_id: 's1', prompt_id: 'p1', tool_name: 'mcp_call_tool', tool_input: { server_name: 'github-mcp-server', tool_name: 'create_pull_request' } }),
    2
  );
  expect(
    'MCP read tools allowed',
    run({ hook_event_name: 'PreToolUse', session_id: 's1', prompt_id: 'p1', tool_name: 'mcp_call_tool', tool_input: { server_name: 'github-mcp-server', tool_name: 'get_pull_request' } }),
    0
  );
  expect('lowercase "approve" is not approval', (prompt('p2', 'approve'), exec('p2', 'git push')), 2);
  expect('"Approved" allows push in same turn', (prompt('p3', 'Approved'), exec('p3', 'git push')), 0);
  expect('"I approve" allows PR in same turn', (prompt('p4', 'I approve, open it'), exec('p4', 'gh pr create')), 0);
  expect('approval does not carry to the next turn', (prompt('p5', 'why did you do that?'), exec('p5', 'git push')), 2);
  expect('missing prompt_id fails closed', run({ hook_event_name: 'PreToolUse', session_id: 's1', tool_name: 'exec', tool_input: { command: 'git push' } }), 2);
  expect('malformed payload errors without blocking', spawnSync(process.execPath, [gate], { input: '{', encoding: 'utf8' }).status, 1);
} finally {
  rmSync(dataDir, { recursive: true, force: true });
}

if (failures > 0) {
  console.error(`\n${failures} test(s) failed`);
  process.exit(1);
}
console.log('\nAll approval-gate tests passed');
