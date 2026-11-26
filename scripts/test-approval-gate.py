#!/usr/bin/env python3
# Tests hooks/approval-gate.py by feeding it hook payloads. Exits non-zero on any failure.
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

GATE = Path(__file__).resolve().parent.parent / "hooks" / "approval-gate.py"
DATA_DIR = Path(tempfile.mkdtemp(prefix="approval-gate-test-"))
failures = 0


def run(payload):
    env = dict(os.environ)
    env["PLUGIN_DATA"] = str(DATA_DIR)
    return subprocess.run(
        ["python3", str(GATE)],
        input=json.dumps(payload),
        env=env,
        text=True,
        capture_output=True,
        check=False,
    ).returncode


def prompt(prompt_id, text):
    return run({"hook_event_name": "UserPromptSubmit", "session_id": "s1", "prompt_id": prompt_id, "prompt": text})


def exec_hook(prompt_id, command):
    return run(
        {
            "hook_event_name": "PreToolUse",
            "session_id": "s1",
            "prompt_id": prompt_id,
            "tool_name": "exec",
            "tool_input": {"command": command},
        }
    )


def expect(name, actual, expected):
    global failures
    if actual == expected:
        print(f"  ok: {name}")
    else:
        print(f"FAIL: {name} (exit {actual}, expected {expected})", file=sys.stderr)
        failures += 1


try:
    expect("prompt without approval is recorded", prompt("p1", "interesting, tell me more"), 0)
    expect("git push blocked without approval", exec_hook("p1", "git push -u origin feature/x"), 2)
    expect("git push with nonbreaking space blocked", exec_hook("p1", "git\u00a0push"), 2)
    expect("git -C <dir> push blocked", exec_hook("p1", "git -C /repo push"), 2)
    expect("chained git push blocked", exec_hook("p1", "git add . && git commit -m x && git push"), 2)
    expect("gh pr create blocked", exec_hook("p1", "gh pr create --title t --body b"), 2)
    expect("gh pr merge blocked", exec_hook("p1", "gh pr merge 3 --squash"), 2)
    expect("ungated commands allowed", exec_hook("p1", 'git status && git commit -m "push docs"'), 0)
    expect("gh pr view allowed", exec_hook("p1", "gh pr view 3"), 0)
    expect(
        "MCP create_pull_request blocked",
        run(
            {
                "hook_event_name": "PreToolUse",
                "session_id": "s1",
                "prompt_id": "p1",
                "tool_name": "mcp_call_tool",
                "tool_input": {"server_name": "github-mcp-server", "tool_name": "create_pull_request"},
            }
        ),
        2,
    )
    expect(
        "MCP read tools allowed",
        run(
            {
                "hook_event_name": "PreToolUse",
                "session_id": "s1",
                "prompt_id": "p1",
                "tool_name": "mcp_call_tool",
                "tool_input": {"server_name": "github-mcp-server", "tool_name": "get_pull_request"},
            }
        ),
        0,
    )

    # Affirmatives that count as approval in the same turn.
    for prompt_id, text in [
        ("a1", "yes"),
        ("a2", "go ahead"),
        ("a3", "do it"),
        ("a4", "push it"),
        ("a5", "sounds good"),
        ("a6", "ok"),
        ("a7", "yes, merge the branch"),
        ("a8", "can you open a pr"),
        ("a9", "approve"),
        ("a10", "Approved"),
        ("a11", "I approve"),
        ("a12", "merge into main"),
        ("a13", "push to origin"),
        ("a14", "merge pr 145"),
        ("a15", "merge it into main"),
        ("a16", "merge"),
        ("a17", "go"),
        ("a18", "push it up"),
        ("a19", "can you merge into main"),
        ("a20", "will you merge it"),
        ("a21", "merge\u00a0into\u00a0main"),
    ]:
        prompt(prompt_id, text)
        expect(f'"{text}" allows push', exec_hook(prompt_id, "git push"), 0)

    # Replies that still do not count.
    for prompt_id, text in [
        ("n1", "don't push"),
        ("n2", "not yet"),
        ("n3", "did you push?"),
        ("n4", "why did you do that?"),
        ("n5", "yes but don't merge yet"),
        ("n6", "hold off on that"),
        ("n7", "interesting"),
        ("n8", "no"),
        ("n9", "should I merge into main?"),
        ("n10", "when will you merge into main?"),
        ("n11", "what if we merge into main?"),
        ("n12", "why did you merge it?"),
        ("n13", "can we merge it?"),
        ("n14", "the push failed, do not retry"),
    ]:
        prompt(prompt_id, text)
        expect(f'"{text}" does not allow push', exec_hook(prompt_id, "git push"), 2)

    prompt("x1", "yes")
    expect("approval does not carry to the next turn", exec_hook("x2", "git push"), 2)
    prompt("x3", "yes")
    expect(
        "approval in another session does not count",
        run(
            {
                "hook_event_name": "PreToolUse",
                "session_id": "s2",
                "prompt_id": "x3",
                "tool_name": "exec",
                "tool_input": {"command": "git push"},
            }
        ),
        2,
    )
    expect(
        "missing prompt_id fails closed",
        run(
            {
                "hook_event_name": "PreToolUse",
                "session_id": "s1",
                "tool_name": "exec",
                "tool_input": {"command": "git push"},
            }
        ),
        2,
    )
    expect(
        "malformed payload errors without blocking",
        subprocess.run(["python3", str(GATE)], input="{", text=True, capture_output=True, check=False).returncode,
        1,
    )
finally:
    shutil.rmtree(DATA_DIR, ignore_errors=True)

if failures > 0:
    print(f"\n{failures} test(s) failed", file=sys.stderr)
    sys.exit(1)
print("\nAll approval-gate tests passed")
