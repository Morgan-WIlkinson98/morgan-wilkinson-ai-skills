#!/usr/bin/env python3
# Blocks pushes, PR creation, and PR merges unless the user's current message
# gives a clear positive affirmation ("yes", "go ahead", "push it", "approved").
#   UserPromptSubmit: records whether the current prompt approves.
#   PreToolUse:       blocks gated actions when the current prompt did not approve.
import json
import os
import re
import sys
import tempfile
from pathlib import Path

# Clear affirmatives answering "may I <action>?". Weak fillers ("ok", "sure")
# are included intentionally: in context of a just-asked question they are
# approval, and the blocker patterns below still catch negations/questions.
AFFIRMATIVE = re.compile(
    r"\b(approv\w*|affirmative|yes|yeah|yep|yup|go ahead|go for it|proceed|do it|ship it|send it|lgtm|looks good|sounds good|good to go|works for me|make it so|ok(?:ay)?|sure|fine|absolutely|definitely|of course|certainly|please do)\b",
    re.IGNORECASE | re.ASCII,
)
# Direct imperatives naming the action: "push it", "merge into main", "open a PR".
IMPERATIVE = re.compile(
    r"\b(push|merge|open|create|ship|deploy|publish|send)\s+(it|them|this|that|these|those|the|an?|in|into|to|up|now|away|ahead|prs?|pull requests?|branches?)\b",
    re.IGNORECASE | re.ASCII,
)
# One-word commands replying to an approval ask: "merge", "go", "proceed".
SOLO_IMPERATIVE = re.compile(
    r"^\s*(push|merge|ship|send|deploy|publish|proceed|go)\s*[.!]?\s*$",
    re.IGNORECASE | re.ASCII,
)
# Negations, status questions, permission-seeking, and hypotheticals void
# approval even if an affirmative appears — false negatives just re-ask.
BLOCKER = re.compile(
    "|".join(
        [
            r"\b(?:don'?t|do not|didn'?t|doesn'?t|can'?t|cannot|won'?t|wouldn'?t|shouldn'?t|haven'?t|hasn'?t|hadn'?t|not yet|not now|wait|hold (?:off|on)|stop|cancel|never ?mind)\b",
            r"\b(?:did|have|has|had|is|are|was|were|does) (?:you|it|that|the|they|this)\b",
            r"\bdo (?:you|they)\b",
            r"\b(?:should|shall|may) (?:i|we|you)\b",
            r"\b(?:can|could) (?:i|we)\b",
            r"\b(?:when|why|how) (?:will|did|do|does|are|is|was|were|have|has|had|would|should|can|could|must)\b",
            r"\b(?:what if|if (?:i|we|you|it))\b",
        ]
    ),
    re.IGNORECASE | re.ASCII,
)

GATED_COMMANDS = [
    (re.compile(r"\bgit\s+(?:-\S+\s+(?:\S+\s+)?)*push\b", re.ASCII), "git push"),
    (re.compile(r"\bgh\s+pr\s+create\b", re.ASCII), "gh pr create"),
    (re.compile(r"\bgh\s+pr\s+merge\b", re.ASCII), "gh pr merge"),
]
GATED_MCP_TOOLS = re.compile(r"(^|_)(create_pull_request|merge_pull_request|push_files|create_or_update_file)$", re.ASCII)

STATE_DIR = Path(os.environ.get("PLUGIN_DATA") or Path(tempfile.gettempdir()) / "morgan-wilkinson-skills") / "approval-gate"


def approves(text):
    return bool(
        (AFFIRMATIVE.search(text) or IMPERATIVE.search(text) or SOLO_IMPERATIVE.search(text))
        and not BLOCKER.search(text)
    )


def state_path(session_id):
    safe_session_id = re.sub(r"[^\w.-]", "_", str(session_id), flags=re.ASCII)
    return STATE_DIR / f"{safe_session_id}.json"


def gated_action(tool_name="", tool_input=None):
    tool_input = tool_input or {}
    if tool_name == "exec":
        command = tool_input.get("command") or ""
        for pattern, label in GATED_COMMANDS:
            if pattern.search(command):
                return label
        return None

    if tool_name == "mcp_call_tool":
        mcp_tool = tool_input.get("tool_name") or ""
    elif tool_name.startswith("mcp__"):
        mcp_tool = tool_name
    else:
        mcp_tool = ""
    return f"MCP {mcp_tool}" if GATED_MCP_TOOLS.search(mcp_tool) else None


def approved_this_turn(session_id, prompt_id):
    if not session_id or not prompt_id:
        return False
    try:
        state = json.loads(state_path(session_id).read_text(encoding="utf-8"))
        return state.get("prompt_id") == prompt_id and state.get("approved") is True
    except Exception:
        return False


def block(action):
    reason = (
        f'Blocked by morgan-wilkinson-skills approval gate: "{action}" requires explicit approval. '
        "Stop, describe exactly what will be pushed or opened, and ask the user to confirm. "
        'Any clear affirmative reply ("yes", "go ahead", "push it", "approved") counts — '
        "but only in the same message turn as the action."
    )
    sys.stdout.write(json.dumps({"decision": "block", "reason": reason}, separators=(",", ":")))
    sys.stderr.write(reason)
    sys.exit(2)


try:
    payload = json.loads(sys.stdin.read() or "{}")
except json.JSONDecodeError as e:
    sys.stderr.write(f"approval-gate: could not parse hook payload ({e})")
    sys.exit(1)

event = payload.get("hook_event_name")
if event == "UserPromptSubmit":
    if payload.get("session_id"):
        STATE_DIR.mkdir(parents=True, exist_ok=True)
        state_path(payload["session_id"]).write_text(
            json.dumps(
                {
                    "prompt_id": payload.get("prompt_id"),
                    "approved": approves(payload.get("prompt") or ""),
                },
                separators=(",", ":"),
            ),
            encoding="utf-8",
        )
elif event == "PreToolUse":
    action = gated_action(payload.get("tool_name", ""), payload.get("tool_input"))
    if action and not approved_this_turn(payload.get("session_id"), payload.get("prompt_id")):
        block(action)

sys.exit(0)
