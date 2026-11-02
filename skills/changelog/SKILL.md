---
name: changelog
description: "Changelog standard for every repo — bootstrap CHANGELOG.md and changelog/unreleased/, add a Pending entry for each feature or fix, summarize pending entries during pre-flight, and compile entries to Approved on a release branch cut from dev and merged to main (with yearly archives)."
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

An entry is Pending while it lives on a feature branch or `dev`. It is compiled to Approved only on a `release/<yyyy-mm-dd>` branch, and reaches `main` only when the user merges the release PR. Never mark an entry Approved anywhere else.

## 1. Bootstrap (repo has no changelog)

Create on the current feature branch, as part of the first change that needs an entry:

- `CHANGELOG.md` from the template in section 5.
- `changelog/unreleased/.gitkeep` (empty file, keeps the folder when no entries are pending).

## 2. Add an entry (every feature, fix, or user-visible change)

1. Create exactly one file per branch: `changelog/unreleased/<yyyy-mm-dd>-<issue-number>-<short-slug>.md`. The date is the day the entry is created. Use the issue number from the GitHub issue for the work; omit the `<issue-number>-` segment only when there is no issue.
2. Fill it from the entry template in section 4. Status is always `Pending`.
3. Feature branches merge into `dev` without a PR, so entries have no PR link. The release compile adds a link to the branch's merge commit on `dev`, which shows every file the change touched.
4. If the branch's scope changes, update the entry before merging into `dev` — the entry must describe what the branch actually does.
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

- **Status:** Approved — [release <yyyy-mm-dd>](https://github.com/<owner>/<repo>/pull/<release-pr>)
- **Type:** <Type>
- **Issue:** [#<n>](https://github.com/<owner>/<repo>/issues/<n>)
- **Changes:** [`<short-sha>`](https://github.com/<owner>/<repo>/commit/<sha>) — merge of `feature/<branch-name>` into `dev`

**What changed:** <text from the entry>

**Why:** <text from the entry>
```

The heading date is the entry's file-name date. The status links to the release PR that carried the entry to `main`. The `Branch` line is replaced by the `Changes` link to the branch's merge commit on `dev`.

## 6. Release — compile on a release branch, merge to `main`

`dev` is promoted to `main` only through a release branch. Run when the user asks for a release:

1. Pre-flight, then cut the branch from an up-to-date `dev`:
   `git fetch --all --prune && git switch dev && git pull --ff-only && git switch -c release/<yyyy-mm-dd>`
2. If `changelog/unreleased/` has no entry files, tell the user there is nothing to release and stop.
3. Archive first: if `CHANGELOG.md` contains a `## <yyyy>` section older than the current year, move that whole section into `docs/changelog/<yyyy>.md` (title `# Changelog — <yyyy>`), and update the **Archives** line with a link to it, newest year first.
4. Ensure a `## <current yyyy>` section exists directly below the header.
5. Process entry files in ascending file-name order. Insert each one at the top of the current year section in the compiled format, so the newest entry ends up first. Find each entry's merge commit with `git log --merges --first-parent dev --format='%H %s' | grep "feature/<branch-name>"` and use it for the `Changes` link.
6. Delete each compiled entry file; keep `changelog/unreleased/.gitkeep`.
7. Commit on the release branch: `docs(changelog): compile release <yyyy-mm-dd>`.
8. Show the user the compiled diff and the list of entries in the release, then ask for explicit approval before pushing the branch and opening the PR from `release/<yyyy-mm-dd>` to `main`. This is the only PR in the workflow; its description follows the PR rules in AGENTS.md and lists every entry with its issue and `Changes` link.
9. After the PR is opened, replace `<release-pr>` in the compiled status links with the release PR number in a follow-up commit on the release branch.
10. The user merges the release PR. Only fixes for problems found while testing the release go onto the release branch, each with its own entry compiled the same way.

After the user merges the release PR (post-merge checklist):

1. Merge the release branch into `dev`, then merge `main` into `dev`, then push `dev` after approval:
   ```
   git fetch --all --prune && git switch dev && git pull --ff-only
   git merge --no-ff origin/release/<yyyy-mm-dd> -m "Merge release/<yyyy-mm-dd> into dev"
   git merge --no-ff origin/main -m "Merge main into dev"
   ```
   Both merges are required. `main` only accepts squash or rebase merges, so the squash commit on `main` does not carry the compile commit's deletions back to `dev`: merging only `main` leaves the released entry files on `dev` as Pending, and they would be compiled again in the next release. Merging the release branch first applies the deletions and the compiled `CHANGELOG.md`; merging `main` afterwards records `main` as an ancestor of `dev`, so the next release PR's diff is limited to new work. The second merge applies identical changes and should not conflict; if it does, stop and show the user the conflict.
2. Verify before pushing:
   - `git diff origin/main dev -- CHANGELOG.md` is empty.
   - `git diff --name-status origin/release/<yyyy-mm-dd> dev -- changelog/unreleased` lists only `A` (added) lines — entries merged into `dev` after the release branch was cut. They stay Pending for the next release.
3. Ask before deleting the merged release branch.

Never push to `main` directly or bypass branch protection; every change reaches `main` through a release PR the user merges.
