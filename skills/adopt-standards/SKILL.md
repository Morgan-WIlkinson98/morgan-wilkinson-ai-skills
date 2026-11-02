---
name: adopt-standards
description: "One-time migration of an existing repo to Morgan's standards — dev branch, changelog, release-branch workflow, repo AGENTS.md alignment, workflows that push to main, and triage of in-flight and merged branches. Invoke when the user asks to adopt, migrate, or apply the plugin standards to a repo."
allowed-tools:
  - read
  - grep
  - glob
  - edit
  - write
  - exec
---

Migrates one repo to the workflow in AGENTS.md: `feature/*` → `dev` (direct merge) → `release/<yyyy-mm-dd>` → `main`, with the changelog from the `changelog` skill. All edits happen locally on `feature/adopt-standards`; every push, merge into `dev`, PR action, and branch deletion waits for explicit approval.

## 1. Pre-flight and eligibility

1. Run the AGENTS.md pre-flight checks. If anything is uncommitted, untracked, unpushed, or stashed, report it in the `changelog` skill's pre-flight format and stop.
2. Read the origin URL. Skip the repo and report why when:
   - it is not owned by `Morgan-WIlkinson98` or `Morgan-Wilkinson` (third-party or upstream project — its own process applies);
   - it is not a git repo or has no `origin`.
3. If it is owned by the personal `Morgan-Wilkinson` account, continue but flag it: the repo-location rule requires a transfer to `Morgan-WIlkinson98`, which needs approval.

## 2. Inventory (read-only)

Collect and show the user:

- Default branch (`git symbolic-ref --short refs/remotes/origin/HEAD`), and whether `dev` exists locally or on `origin`.
- Existing `CHANGELOG.md` / `HISTORY` / `NEWS` files and the deployment checklist location (usually `docs/DEPLOYMENT-CHECKLIST.md`; some repos use another folder — keep theirs).
- Repo rule files (`AGENTS.md`, `CONTRIBUTING.md`, `.devin/`, `.windsurf/rules/`) that describe branching, PRs, or releases.
- Workflows that push or write: `grep -l -E 'git push|contents: *write|git-auto-commit|create-pull-request' .github/workflows/*`. Classify each: pushes to `main` (breaks under the org ruleset), opens PRs, or only publishes releases/artifacts (fine).
- Every local and remote branch except the default branch and `dev`:
  - **Merged:** a merged PR exists for the branch and the local tip equals that PR's `headRefOid` (`gh pr list --state merged --head <branch> --json headRefOid`), or the branch is an ancestor of `origin/<default>`.
  - **In flight:** commits not in any merged PR. Note any open PR and its base.

## 3. Changes on `feature/adopt-standards`

1. If `dev` does not exist, create it locally with `git branch --no-track dev origin/<default>`. Without `--no-track`, `dev` tracks `origin/<default>` and a later `git pull` or `git push` on `dev` targets the default branch. If `dev` already exists, use `git switch -c feature/adopt-standards --no-track origin/dev`; otherwise branch `feature/adopt-standards` from the new local `dev`. Push new branches with `git push -u origin <branch>`.
   - If `origin/dev` and `origin/<default>` already diverge in content (not just history), report the differing files before continuing — the first release will carry `dev`'s versions to `main`.
   - If the repo's rules describe `dev` as a disposable staging branch (reset or never promoted), call that out: under this workflow everything merged into `dev` ships with the next release.
2. Bootstrap the changelog per the `changelog` skill, section 1. If a changelog already exists in another format, keep its content verbatim under a `## Before <yyyy-mm-dd>` heading below the year sections and tell the user.
3. Add a Pending entry for the migration itself (`Type: Change`).
4. Add a **Release** section to the deployment checklist (create `docs/DEPLOYMENT-CHECKLIST.md` if none exists): cut `release/<yyyy-mm-dd>` from `dev`, compile the changelog, PR to `main`, then merge the release branch and `main` into `dev`. Keep repo-specific steps (version bumps, tags, deploys) and place them on the release branch or after the release merge, whichever the repo needs — never as a direct commit to `main`.
5. Update repo rule files so they do not contradict the global workflow: branch from `dev` instead of `main`; feature branches merge into `dev` without a PR; release PRs are the only PRs; changelog entry per change. Change only the conflicting statements and keep repo-specific rules intact. If the repo has a documentation-sync rule, satisfy it.
6. Do not change workflows in this step. Report workflows that push to `main` with a proposed fix (usually: make it a check, or move the write onto the release branch) and ask. Also report workflows that only act on feature PRs (preview comments, per-PR checks), since feature branches no longer have PRs.
7. Commit: `chore: adopt dev/release workflow and changelog standard`.

## 4. Approval request

Present one list and wait for "Approved" / "I approve":

- Push `dev` (if new) and merge `feature/adopt-standards` into `dev`, then push `dev`.
- For each in-flight branch: add a Pending entry on the branch and merge it into `dev` — or leave it for the user. Close any open feature PRs to `main` with a comment that the branch was merged into `dev` instead.
- Delete merged branches (local, and remote where they still exist).
- Transfer to `Morgan-WIlkinson98` (personal-account repos only).

The migration reaches `main` with the repo's next release (`changelog` skill, section 6).
