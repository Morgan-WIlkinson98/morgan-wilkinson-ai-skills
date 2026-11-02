# Changelog

Changes merged to `main`, newest first. Changes still in progress are in
[changelog/unreleased/](changelog/unreleased/) with status Pending.

**Archives:** none yet

## 2026

### 2026-11-02 — Add adopt-standards skill for migrating existing repos

- **Status:** Approved — [release 2026-11-02-2](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/<release-pr>)
- **Type:** Feature
- **Issue:** [#7](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/7)
- **Changes:** [`b032776`](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/commit/b03277660b10272d4513f8c2629e76acfc492156) — merge of `feature/adopt-standards-skill` into `dev`

**What changed:** A new `adopt-standards` skill migrates one repo to the dev/release workflow and changelog standard: eligibility and pre-flight checks, an inventory of rule files, workflows, and branches, local changes on `feature/adopt-standards`, and a single approval request for pushes, merges, and branch cleanup.

**Why:** The plugin's rules apply only to new work and are not retroactive. Existing repos had no `dev` branch or changelog, repo-level AGENTS.md files still described feature PRs to `main`, and many local branches were already merged.

### 2026-11-02 — Fix release back-merge leaving released entries Pending on dev

- **Status:** Approved — [release 2026-11-02-2](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/<release-pr>)
- **Type:** Fix
- **Issue:** [#6](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/6)
- **Changes:** [`506b88e`](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/commit/506b88ee378906137bafbd87ceb8b75dbae99dc5) — merge of `feature/fix-release-back-merge` into `dev`

**What changed:** After a release, the release branch is merged into `dev` before `main` is, followed by checks that `CHANGELOG.md` matches `main` and that only post-cut entries remain in `changelog/unreleased/`.

**Why:** `main` only accepts squash or rebase merges, so merging only `main` into `dev` did not carry the compile commit's deletions back to `dev`. Released entries stayed Pending on `dev` and would have been compiled again in the next release.

### 2026-11-02 — Add pre-flight checks, changelog standard, and approval-gated pushes

- **Status:** Approved — [release 2026-11-02](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/5)
- **Type:** Feature
- **Issue:** [#3](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/3)
- **Changes:** [`6de479b`](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/commit/6de479b692c9c4005dbbf18a4ccd6d09a65d8d15) — merge of `feature/changelog-preflight-approval-gates` into `dev`

**What changed:** Agents now run a pre-flight check of branch, working tree, unpushed commits, and stashes before working, and stop to report pending work. Conversational replies no longer resume a task. Every repo uses `feature/*` → `dev` → `release/<yyyy-mm-dd>` → `main`, with features merged into `dev` without a PR and release PRs as the only PRs, and keeps a fragment-based changelog that is compiled to Approved on the release branch. Pushing and opening or merging PRs require explicit approval, backed by an approval-gate hook. The diagram workflow now checks rendered SVGs instead of pushing to `main`.

**Why:** An agent continued work and opened a PR after a purely conversational reply, and another agent started a task without noticing uncommitted changes left by a different agent. There was also no standard record of changes or of which changes were still untested on `dev`.
