---
name: adopt-standards
description: "One-time migration of an existing repo to Morgan's standards — dev testing branch, feature PRs to main (or release branches), changelog, repo AGENTS.md alignment, workflows that push to main, and triage of in-flight and merged branches. Invoke when the user asks to adopt, migrate, or apply the plugin standards to a repo."
allowed-tools:
  - read
  - grep
  - glob
  - edit
  - write
  - exec
---

Migrates one repo to the workflow in AGENTS.md: feature branches from `main`, tested on `dev`, shipped to `main` by a PR from the feature branch (or from a `release/<yyyy-mm-dd>` branch carrying several features), with the changelog from the `changelog` skill. All edits happen locally on `feature/adopt-standards`; every push, merge into `dev`, PR action, and branch deletion waits for explicit approval.

## 1. Pre-flight and eligibility

1. Run the AGENTS.md pre-flight checks. If anything is uncommitted, untracked, unpushed, or stashed, report it in the `changelog` skill's pre-flight format and stop.
2. Read the origin URL. Skip the repo and report why when:
   - it is not owned by `Morgan-WIlkinson98` or `Morgan-Wilkinson` (third-party or upstream project — its own process applies);
   - it is not a git repo or has no `origin`.
3. If it is owned by the personal `Morgan-Wilkinson` account, continue but flag it: the repo-location rule requires a transfer to `Morgan-WIlkinson98`, which needs approval. Check `gh repo view` first — a redirect means it was already transferred and only the local remote URL needs updating.

## 2. Inventory (read-only)

Collect and show the user:

- Default branch (`git symbolic-ref --short refs/remotes/origin/HEAD`), and whether `dev` exists locally or on `origin`. If `dev` exists, how the repo's rules use it.
- Existing `CHANGELOG.md` / `HISTORY` / `NEWS` files and the deployment checklist location (usually `docs/DEPLOYMENT-CHECKLIST.md`; some repos use another folder — keep theirs).
- Repo rule files (`AGENTS.md`, `CONTRIBUTING.md`, `.devin/`, `.windsurf/rules/`) and docs that describe branching, PRs, or releases.
- Workflows that push or write: `grep -l -E 'git push|contents: *write|git-auto-commit|create-pull-request' .github/workflows/*`. Classify each: pushes to `main` (breaks under the org ruleset), opens PRs, or only publishes releases/artifacts (fine). Note what deploys from `dev`, if anything.
- Every local and remote branch except the default branch and `dev`:
  - **Merged:** a merged PR exists for the branch and the local tip equals that PR's `headRefOid` (`gh pr list --state merged --head <branch> --json headRefOid`), or the branch is an ancestor of `origin/<default>`.
  - **In flight:** commits not in any merged PR. Note any open PR and its base.

## 3. Changes on `feature/adopt-standards`

1. Branch from the default branch: `git switch -c feature/adopt-standards --no-track origin/<default>`. If `dev` does not exist, create it with `git branch --no-track dev origin/<default>` (without `--no-track`, `dev` would pull from and push to the default branch). Push new branches with `git push -u origin <branch>`.
2. Bootstrap the changelog per the `changelog` skill, section 1. If a changelog already exists in another format, keep its content verbatim under a `## Before <yyyy-mm-dd>` heading below the year sections and tell the user.
3. Add a Pending entry for the migration itself (`Type: Change`).
4. Add a **Ship to `main`** section to the deployment checklist (create `docs/DEPLOYMENT-CHECKLIST.md` if none exists): ship a single feature from its feature branch or several from `release/<yyyy-mm-dd>` cut from `main`; compile the changelog on that branch; PR to `main`; after the merge, merge the shipped branch and then `main` into `dev`. Keep repo-specific steps (version bumps, tags, deploys) and place them on the shipped branch or after the merge — never as a direct commit to `main`.
5. Update repo rule files and docs so they do not contradict the global workflow: feature branches from `main`; `dev` is a testing branch (features merged in without a PR, never merged into `main`, never reset unless the user says so); PRs to `main` come from feature or release branches and carry the full PR description; one changelog entry per change. Change only the conflicting statements and keep repo-specific rules intact. If the repo has a documentation-sync rule, satisfy it.
6. Do not change workflows in this step. Report workflows that push to `main` with a proposed fix (usually: make it a check, or move the write onto the shipped branch) and ask.
7. Commit: `chore: adopt branch workflow and changelog standard`.

## 4. Approval request

Present one list and wait for a clear affirmative reply:

- Push `dev` (if new). Merge `feature/adopt-standards` into `dev` and push `dev`, if the user wants it tested there first.
- Push `feature/adopt-standards`, compile its entry (`changelog` skill, section 6), and open its PR to `main`.
- For each in-flight branch: add a Pending entry on the branch, or leave it for the user. Existing open PRs to `main` stay open.
- Delete merged branches (local, and remote where they still exist).
- Transfer to `Morgan-WIlkinson98`, or update the local remote URL (personal-account repos only).
