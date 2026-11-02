#!/usr/bin/env node
// Blocks pushes, PR creation, and PR merges unless the user's current message
// contains an explicit approval phrase ("I approve" or "Approved").
//   UserPromptSubmit: records whether the current prompt approves.
//   PreToolUse:       blocks gated actions when the current prompt did not approve.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const APPROVAL = /(^|[^A-Za-z])(I approve|Approved)([^A-Za-z]|$)/;
const GATED_COMMANDS = [
  [/\bgit\s+(?:-\S+\s+(?:\S+\s+)?)*push\b/, 'git push'],
  [/\bgh\s+pr\s+create\b/, 'gh pr create'],
  [/\bgh\s+pr\s+merge\b/, 'gh pr merge'],
];
const GATED_MCP_TOOLS = /(^|_)(create_pull_request|merge_pull_request|push_files|create_or_update_file)$/;

const stateDir = join(process.env.PLUGIN_DATA || join(tmpdir(), 'morgan-wilkinson-skills'), 'approval-gate');
const statePath = (sessionId) => join(stateDir, `${String(sessionId).replace(/[^\w.-]/g, '_')}.json`);

function gatedAction(toolName = '', input = {}) {
  if (toolName === 'exec') {
    const hit = GATED_COMMANDS.find(([re]) => re.test(input.command ?? ''));
    return hit?.[1];
  }
  const mcpTool = toolName === 'mcp_call_tool' ? input.tool_name ?? '' : toolName.startsWith('mcp__') ? toolName : '';
  return GATED_MCP_TOOLS.test(mcpTool) ? `MCP ${mcpTool}` : undefined;
}

function approvedThisTurn(sessionId, promptId) {
  if (!sessionId || !promptId) return false;
  try {
    const state = JSON.parse(readFileSync(statePath(sessionId), 'utf8'));
    return state.prompt_id === promptId && state.approved === true;
  } catch {
    return false;
  }
}

function block(action) {
  const reason =
    `Blocked by morgan-wilkinson-skills approval gate: "${action}" requires explicit approval. ` +
    'Stop, summarize exactly what will be pushed or opened, and ask the user to reply "Approved" or "I approve". ' +
    'Approval only counts in the same message turn as the action.';
  process.stdout.write(JSON.stringify({ decision: 'block', reason }));
  process.stderr.write(reason);
  process.exit(2);
}

let payload;
try {
  payload = JSON.parse(readFileSync(0, 'utf8') || '{}');
} catch (e) {
  process.stderr.write(`approval-gate: could not parse hook payload (${e.message})`);
  process.exit(1);
}

const event = payload.hook_event_name;
if (event === 'UserPromptSubmit') {
  if (payload.session_id) {
    mkdirSync(stateDir, { recursive: true });
    writeFileSync(
      statePath(payload.session_id),
      JSON.stringify({ prompt_id: payload.prompt_id ?? null, approved: APPROVAL.test(payload.prompt ?? '') })
    );
  }
} else if (event === 'PreToolUse') {
  const action = gatedAction(payload.tool_name, payload.tool_input);
  if (action && !approvedThisTurn(payload.session_id, payload.prompt_id)) block(action);
}
process.exit(0);
