# Add pre-flight checks, changelog standard, and approval-gated pushes

- **Status:** Pending
- **Type:** Feature
- **Issue:** _added once the issue is created_
- **Pull request:** _added once the PR is opened_
- **Branch:** `feature/changelog-preflight-approval-gates`

## What changed
Agents now run a pre-flight check of branch, working tree, unpushed commits, and stashes before working, and stop to report pending work. Conversational replies no longer resume a task. Every repo uses `feature/*` → `dev` → `main` and keeps a fragment-based changelog compiled to Approved after merges to `main`. Pushing and opening or merging PRs require explicit approval, backed by an approval-gate hook.

## Why
An agent continued work and opened a PR after a purely conversational reply, and another agent started a task without noticing uncommitted changes left by a different agent. There was also no standard record of changes or of which changes were still untested on `dev`.
