---
name: changelog
description: "Changelog standard for every repo — bootstrap CHANGELOG.md and changelog/unreleased/, add a Pending entry for each feature or fix, summarize pending entries during pre-flight, compile entries to Approved on the feature or release branch being shipped to main (with yearly archives), and sync the dev testing branch after a merge."
allowed-tools:
  - read
  - grep
  - glob
  - edit
  - write
  - exec
---

Every repo keeps a changelog in two parts:

| Path | Contents | Status |
|------|----------|--------|
| `changelog/unreleased/` | One file per in-flight change | Pending |
| `CHANGELOG.md` | Compiled entries merged to `main`, current year only | Approved |
| `docs/changelog/<yyyy>.md` | Compiled entries from previous years | Approved |

An entry is Pending while it lives on a feature branch or `dev` (the testing branch). It is compiled to Approved on the branch being shipped — the feature branch, or a `release/<yyyy-mm-dd>` branch carrying several features — just before that branch's PR to `main`, and reaches `main` only when the PR is merged. Never compile entries on `dev`.

## 1. Bootstrap (repo has no changelog)

Create on the current feature branch, as part of the first change that needs an entry:

- `CHANGELOG.md` from the template in section 5.
- `changelog/unreleased/.gitkeep` (empty file, keeps the folder when no entries are pending).

## 2. Add an entry (every feature, fix, or user-visible change)

1. Create exactly one file per branch: `changelog/unreleased/<yyyy-mm-dd>-<issue-number>-<short-slug>.md`. The date is the day the entry is created. Use the issue number from the GitHub issue for the work; omit the `<issue-number>-` segment only when there is no issue.
2. Fill it from the entry template in section 4. Status is always `Pending`.
3. The PR to `main` does not exist while the entry is Pending, so the entry has no PR link. The compile adds the PR and Files changed links once the PR is opened.
4. If the branch's scope changes, update the entry before merging into `dev` or opening the PR — the entry must describe what the branch actually does.
5. All links must be clickable: issue, commit, and PR links are full `https://github.com/<owner>/<repo>/...` URLs (GitHub does not autolink `#41` inside `.md` files).

`Type` is one of: `Feature`, `Fix`, `Change`, `Removal`, `Security`.

## 3. Pre-flight summary (uncommitted or pending work found)

When the pre-flight check in AGENTS.md finds uncommitted, untracked, unpushed, or stashed work:

1. List `changelog/unreleased/` (both committed files and any uncommitted ones in the working tree). Read each entry's title.
2. If the repo has no `changelog/unreleased/`, read the top of `CHANGELOG.md` for any `Pending` entries instead.
3. Report to the user and stop:

   > You have a pending changelog entry for **<title>** (`changelog/unreleased/<file>`) and **<N>** uncommitted files:
   > - `<path>` (modified / untracked / staged / deleted)
   > - ...
   >
   > How do you want to handle these before I start?

   If there is no pending entry, say "No pending changelog entry describes these changes." Never commit, stash, discard, or work around the files on your own.

## 4. Entry template — `changelog/unreleased/<yyyy-mm-dd>-<issue>-<slug>.md`

```markdown
# <Short imperative title>

- **Status:** Pending
- **Type:** Feature
- **Issue:** [#<n>](https://github.com/<owner>/<repo>/issues/<n>)
- **Branch:** `feature/<branch-name>`

## What changed
<One or two sentences describing the behavior change from the user's point of view.>

## Why
<The problem this solves or the reason for the change.>
```

## 5. `CHANGELOG.md` template

```markdown
# Changelog

Changes merged to `main`, newest first. Changes still in progress are in
[changelog/unreleased/](changelog/unreleased/) with status Pending.

**Archives:** none yet

## <yyyy>
```

A compiled entry inside the year section looks like:

```markdown
### <yyyy-mm-dd> — <Title>

- **Status:** Approved
- **Type:** <Type>
- **Issue:** [#<n>](https://github.com/<owner>/<repo>/issues/<n>)
- **Pull request:** [#<n>](https://github.com/<owner>/<repo>/pull/<n>) · [Files changed](https://github.com/<owner>/<repo>/pull/<n>/files)

**What changed:** <text from the entry>

**Why:** <text from the entry>
```

The heading date is the entry's file-name date. The PR is the one that carried the entry to `main` — the feature PR, or the release PR when several features shipped together. The `Branch` line is dropped.

## 6. Ship to `main` and sync `dev`

`dev` is a testing branch: features are merged into it to be tested, it is never merged into `main`, nothing branches from it, and it is never reset unless the user says so. Shipping happens from the feature branch itself, or from a release branch when several features go together. Run when the user asks to ship.

**Choose the branch to ship**

- **Single feature:** the feature branch. Update it with `git fetch --all --prune && git switch feature/<name> && git merge --no-ff origin/main`.
- **Several features:** `git switch -c release/<yyyy-mm-dd> --no-track origin/main`, then `git merge --no-ff feature/<name>` for each feature the user chose (list the Pending entries on `dev` to help them choose). Use `release/<yyyy-mm-dd>-2`, `-3`, … for further releases on the same day.

**Compile on the shipped branch**

1. If `changelog/unreleased/` has no entry files, tell the user there is nothing to ship and stop.
2. Archive first: if `CHANGELOG.md` contains a `## <yyyy>` section older than the current year, move that whole section into `docs/changelog/<yyyy>.md` (title `# Changelog — <yyyy>`), and update the **Archives** line with a link to it, newest year first.
3. Ensure a `## <current yyyy>` section exists directly below the header.
4. Process the entry files on this branch in ascending file-name order. Insert each one at the top of the current year section in the compiled format, so the newest entry ends up first, with `<n>` as the placeholder PR number.
5. Delete each compiled entry file; keep `changelog/unreleased/.gitkeep`.
6. Commit: `docs(changelog): compile <feature-name | release yyyy-mm-dd>`.
7. Show the user the compiled diff (and, for a release, the list of features it carries), then ask for explicit approval before pushing and opening the PR to `main`. The description follows the PR rules in AGENTS.md; a release PR lists every entry with its issue.
8. After the PR is opened, replace the placeholder PR number in the compiled links in a follow-up commit on the same branch.
9. The user merges the PR (or explicitly tells you to). If another PR to `main` merged first, `CHANGELOG.md` will conflict: merge `origin/main` into the branch, keep both entries with the newest first, and push after approval.

**After the PR is merged — sync `dev`**

1. Merge the shipped branch into `dev`, then merge `main` into `dev`, then push `dev` after approval:
   ```
   git fetch --all --prune && git switch dev && git pull --ff-only
   git merge --no-ff <feature/name | release/yyyy-mm-dd> -m "Merge <branch> into dev"
   git merge --no-ff origin/main -m "Merge main into dev"
   ```
   Use the local shipped branch: repos that delete head branches on merge remove the remote copy. If the local branch is missing, recreate it from the PR's head commit (`gh pr view <n> --json headRefOid`) before merging.
   Both merges are required. `main` only accepts squash or rebase merges, so the squash commit on `main` does not carry the compile commit's deletions to `dev`: merging only `main` leaves the shipped entry files on `dev` as Pending. Merging the shipped branch first applies the deletions and the compiled `CHANGELOG.md`; merging `main` afterwards keeps `dev` in step with `main`. If either merge conflicts, stop and show the user the conflict.
2. Verify before pushing:
   - `git diff origin/main dev -- CHANGELOG.md` is empty.
   - The only files left in `dev`'s `changelog/unreleased/` belong to features still being tested.
3. Ask before deleting the shipped branch.

Never push to `main` directly, merge `dev` into `main`, or bypass branch protection.
