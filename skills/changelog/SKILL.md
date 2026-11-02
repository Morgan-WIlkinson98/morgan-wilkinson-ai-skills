---
name: changelog
description: "Changelog standard for every repo — bootstrap CHANGELOG.md and changelog/unreleased/, add a Pending entry for each feature or fix, summarize pending entries during pre-flight, and compile entries to Approved after a merge to main (with yearly archives)."
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

An entry is Pending while it lives on a feature branch or `dev`. It becomes Approved only when the post-merge compile runs on `main`. Never mark an entry Approved anywhere else.

## 1. Bootstrap (repo has no changelog)

Create on the current feature branch, as part of the first change that needs an entry:

- `CHANGELOG.md` from the template in section 5.
- `changelog/unreleased/.gitkeep` (empty file, keeps the folder when no entries are pending).

## 2. Add an entry (every feature, fix, or user-visible change)

1. Create exactly one file per branch: `changelog/unreleased/<yyyy-mm-dd>-<issue-number>-<short-slug>.md`. The date is the day the entry is created. Use the issue number from the GitHub issue for the work; omit the `<issue-number>-` segment only when there is no issue.
2. Fill it from the entry template in section 4. Status is always `Pending`.
3. The PR does not exist when the entry is first written. After the PR is opened, add the PR and Files changed links in a follow-up commit on the same branch.
4. If the branch's scope changes, update the entry before asking for review — the entry must describe what the PR actually does.
5. All links must be clickable: issue and PR links are full `https://github.com/<owner>/<repo>/...` URLs (GitHub does not autolink `#41` inside `.md` files).

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
- **Pull request:** [#<n>](https://github.com/<owner>/<repo>/pull/<n>) · [Files changed](https://github.com/<owner>/<repo>/pull/<n>/files)
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

- **Status:** Approved — merged to `main` <yyyy-mm-dd>
- **Type:** <Type>
- **Issue:** [#<n>](https://github.com/<owner>/<repo>/issues/<n>)
- **Pull request:** [#<n>](https://github.com/<owner>/<repo>/pull/<n>) · [Files changed](https://github.com/<owner>/<repo>/pull/<n>/files)

**What changed:** <text from the entry>

**Why:** <text from the entry>
```

The heading date is the entry's file-name date; the merge date is the date of the merge to `main`. The `Branch` line is dropped when compiling.

## 6. Compile (post-merge checklist, after a merge to `main`)

Run on an up-to-date local `main` (`git fetch --all --prune && git switch main && git pull --ff-only`):

1. If `changelog/unreleased/` has no entry files, there is nothing to compile — stop.
2. Archive first: if `CHANGELOG.md` contains a `## <yyyy>` section older than the current year, move that whole section into `docs/changelog/<yyyy>.md` (title `# Changelog — <yyyy>`), and update the **Archives** line with a link to it, newest year first.
3. Ensure a `## <current yyyy>` section exists directly below the header.
4. Process entry files in ascending file-name order. Insert each one at the top of the current year section in the compiled format, so the newest entry ends up first. Fill in any PR links still missing, using the merged PR.
5. Delete each compiled entry file; keep `changelog/unreleased/.gitkeep`.
6. Show the user the diff, then ask for explicit approval ("Approved" / "I approve") before committing to `main` and pushing. Commit message: `docs(changelog): compile entries merged to main`.
7. After the push, merge `main` back into `dev` (`git switch dev && git pull --ff-only && git merge --no-ff main`) and push `dev` under the same approval, so `dev` no longer shows the compiled entries as Pending.

If branch protection rejects the direct push to `main`, do not bypass it. Put the compile commit on `chore/changelog-compile-<yyyy-mm-dd>` and ask the user to merge it to `main`.
