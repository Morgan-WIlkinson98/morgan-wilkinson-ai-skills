# Changelog

Changes merged to `main`, newest first. Changes still in progress are in
[changelog/unreleased/](changelog/unreleased/) with status Pending.

**Archives:** none yet

## 2026

### 2026-11-02 — Make dev a testing branch and ship feature branches to main by PR

- **Status:** Approved
- **Type:** Change
- **Issue:** _added once the issue is created_
- **Pull request:** [#8](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/8) · [Files changed](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/8/files)

**What changed:** Feature branches start from `main`, are merged into `dev` only for testing, and ship to `main` through their own PR or through a `release/<yyyy-mm-dd>` branch cut from `main` that carries several features. `dev` is never merged into `main` and is never reset unless the user says so. The changelog is compiled on the branch being shipped, and after each merge the shipped branch and `main` are merged into `dev`. Compiled entries link the PR that carried them.

**Why:** `dev` is meant to be a testing branch, not a release line. Releasing from `dev` would ship every feature merged there for testing, including untested ones.

### 2026-11-02 — Add adopt-standards skill for migrating existing repos

- **Status:** Approved
- **Type:** Feature
- **Issue:** [#7](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/7)
- **Pull request:** [#8](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/8) · [Files changed](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/8/files)

**What changed:** A new `adopt-standards` skill migrates one existing repo to the branch workflow and changelog standard: eligibility and pre-flight checks, an inventory of rule files, workflows, and branches, local changes on `feature/adopt-standards`, and a single approval request for pushes, merges, PRs, and branch cleanup.

**Why:** The plugin's rules apply only to new work and are not retroactive. Existing repos had no `dev` branch or changelog, repo-level rule files described a different workflow, and many local branches were already merged.

### 2026-11-02 — Fix dev sync leaving shipped entries Pending on dev

- **Status:** Approved
- **Type:** Fix
- **Issue:** [#6](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/6)
- **Pull request:** [#8](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/8) · [Files changed](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/8/files)

**What changed:** After a merge to `main`, the shipped branch is merged into `dev` before `main` is, followed by checks that `CHANGELOG.md` matches `main` and that only entries for features still in testing remain in `changelog/unreleased/`.

**Why:** `main` only accepts squash or rebase merges, so merging only `main` into `dev` did not carry the compile commit's deletions to `dev`. Shipped entries stayed Pending on `dev` and would have been compiled again.

### 2026-11-02 — Add pre-flight checks, changelog standard, and approval-gated pushes

- **Status:** Approved — [release 2026-11-02](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/pull/5)
- **Type:** Feature
- **Issue:** [#3](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/3)
- **Changes:** [`6de479b`](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/commit/6de479b692c9c4005dbbf18a4ccd6d09a65d8d15) — merge of `feature/changelog-preflight-approval-gates` into `dev`

**What changed:** Agents now run a pre-flight check of branch, working tree, unpushed commits, and stashes before working, and stop to report pending work. Conversational replies no longer resume a task. Every repo uses `feature/*` → `dev` → `release/<yyyy-mm-dd>` → `main`, with features merged into `dev` without a PR and release PRs as the only PRs, and keeps a fragment-based changelog that is compiled to Approved on the release branch. Pushing and opening or merging PRs require explicit approval, backed by an approval-gate hook. The diagram workflow now checks rendered SVGs instead of pushing to `main`.

**Why:** An agent continued work and opened a PR after a purely conversational reply, and another agent started a task without noticing uncommitted changes left by a different agent. There was also no standard record of changes or of which changes were still untested on `dev`.
