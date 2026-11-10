#!/usr/bin/env node
// Blocks pushes, PR creation, and PR merges unless the user's current message
// gives a clear positive affirmation ("yes", "go ahead", "push it", "approved").
//   UserPromptSubmit: records whether the current prompt approves.
//   PreToolUse:       blocks gated actions when the current prompt did not approve.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

// Clear affirmatives answering "may I <action>?". Weak fillers ("ok", "sure")
// are included intentionally: in context of a just-asked question they are
// approval, and the blocker patterns below still catch negations/questions.
const AFFIRMATIVE =
  /\b(approv\w*|affirmative|yes|yeah|yep|yup|go ahead|go for it|proceed|do it|ship it|send it|lgtm|looks good|sounds good|good to go|works for me|make it so|ok(?:ay)?|sure|fine|absolutely|definitely|of course|certainly|please do)\b/i;
// Direct imperatives naming the action: "push it", "merge into main", "open a PR".
const IMPERATIVE =
  /\b(push|merge|open|create|ship|deploy|publish|send)\s+(it|them|this|that|these|those|the|an?|in|into|to|up|now|away|ahead|prs?|pull requests?|branches?)\b/i;
// One-word commands replying to an approval ask: "merge", "go", "proceed".
const SOLO_IMPERATIVE = /^\s*(push|merge|ship|send|deploy|publish|proceed|go)\s*[.!]?\s*$/i;
// Negations, status questions, permission-seeking, and hypotheticals void
// approval even if an affirmative appears — false negatives just re-ask.
const BLOCKER = new RegExp([
  String.raw`\b(?:don'?t|do not|didn'?t|doesn'?t|can'?t|cannot|won'?t|wouldn'?t|shouldn'?t|haven'?t|hasn'?t|hadn'?t|not yet|not now|wait|hold (?:off|on)|stop|cancel|never ?mind)\b`,
  String.raw`\b(?:did|have|has|had|is|are|was|were|does) (?:you|it|that|the|they|this)\b`,
  String.raw`\bdo (?:you|that|the|they|this)\b`,
  String.raw`\b(?:should|shall|may) (?:i|we|you)\b`,
  String.raw`\b(?:can|could) (?:i|we)\b`,
  String.raw`\b(?:when|why|how) (?:will|did|do|does|are|is|was|were|have|has|had|would|should|can|could|must)\b`,
  String.raw`\b(?:what if|if (?:i|we|you|it))\b`,
].join('|'), 'i');

const approves = (text) =>
  (AFFIRMATIVE.test(text) || IMPERATIVE.test(text) || SOLO_IMPERATIVE.test(text)) && !BLOCKER.test(text);

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
    'Stop, describe exactly what will be pushed or opened, and ask the user to confirm. ' +
    'Any clear affirmative reply ("yes", "go ahead", "push it", "approved") counts — ' +
    'but only in the same message turn as the action.';
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
      JSON.stringify({ prompt_id: payload.prompt_id ?? null, approved: approves(payload.prompt ?? '') })
    );
  }
} else if (event === 'PreToolUse') {
  const action = gatedAction(payload.tool_name, payload.tool_input);
  if (action && !approvedThisTurn(payload.session_id, payload.prompt_id)) block(action);
}
process.exit(0);
