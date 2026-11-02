# Morgan's Global Rules

These rules apply to every repo and every session. Where they conflict with
project-level rules or other imported conventions, these rules take
precedence — except that a repo's own security, compliance, or licensing
policies always win.

## Pre-flight — before starting any work in a repo

Run these checks before making any change, and again before resuming work
after the user has been away or another agent may have run:

1. `git fetch --all --prune`
2. Current branch: `git branch --show-current`
3. Working tree: `git status --porcelain=v1 --untracked-files=all`
   (staged, unstaged, and untracked files)
4. Unpushed commits: `git log --oneline @{upstream}..HEAD` (note when the
   branch has no upstream)
5. Stashes: `git stash list`

If any check finds uncommitted, untracked, unpushed, or stashed work, **stop
before doing anything else**. Read the pending changelog entries
(`changelog/unreleased/`, or `CHANGELOG.md` if that folder doesn't exist) and
report: "You have a pending changelog entry for <title> and <N> uncommitted
files" with the file list, then ask the user what to do with them. Never
commit, stash, discard, or work around those files on your own — they may
belong to another agent or be waiting for the user's review. The `changelog`
skill has the exact report format.

## Conversation is not a work order

- When the user's message is feedback, a complaint, a question, or
  discussion, answer it and stop. Do not resume, continue, or extend the
  task, and do not take follow-up actions (commits, pushes, PRs, issues) on
  the strength of that message.
- Resume work only when the user explicitly tells you to continue or gives a
  new instruction.
- If it is unclear whether the user wants you to proceed, ask.

## Sensitive data — sanitize and ask

- Always sanitize personal or sensitive information before it is committed.
- Committing anything containing personal data requires explicit approval
  (see "Explicit approval"). Never rely on your own assumption that it's fine.

## GitHub — repo location

All new GitHub repos must be created in the **Morgan-WIlkinson98**
organization (capital W-I), never the personal `Morgan-Wilkinson` account.

- Always pass the owner explicitly: `gh repo create Morgan-WIlkinson98/<name> ...`
- Never rely on the `gh` default — it silently creates repos on the personal account.
- After creating, verify: `gh repo view Morgan-WIlkinson98/<name> --json nameWithOwner`
  must return `Morgan-WIlkinson98/<name>`.
- If it landed on the personal account, transfer it immediately:
  `gh api repos/Morgan-Wilkinson/<name>/transfer -f new_owner=Morgan-WIlkinson98`
  and update the git remote.

## Branching & issues

Every repo uses `feature/*` → `dev` → `main`.

- Start every piece of work with the pre-flight checks above.
- If the repo has no `dev` branch, create it from the latest `main`
  (pushing it requires approval).
- Create a GitHub issue for the work, then a feature branch from the latest
  `dev`: `feature/<short-description-or-issue>`.
- Feature PRs target `dev`. `dev` is promoted to `main` with a PR from `dev`
  to `main`.
- Never commit directly to `dev` or `main`. The only exceptions are the
  post-merge changelog compile on `main` and the merge of `main` back into
  `dev` (see "Merging — post-merge checklist"), both after approval.

## Pull requests

Pushing a branch and opening a PR both require explicit approval (see
"Explicit approval"). Finish and test the work locally, summarize what will be
pushed and what the PR will contain, then ask.

Test thoroughly before opening a PR. Every feature branch gets a PR whose
description is genuinely useful to a reviewer — full enough that they don't
have to reconstruct context from the diff:

- **Summary** — 1–3 bullets describing behavior, not filenames.
- **Why** — what it addresses/fixes and why; the most important part. Link the
  issue it closes when one exists.
- **Approach** — key implementation decisions and alternatives rejected (when
  non-obvious).
- **How to test** — exact steps or commands, expected result, and links or
  test data so the user can verify easily.
- **Review focus** — point reviewers at risky, subtle, or uncertain parts when
  relevant.
- **Screenshots/output** — before/after for UI changes.
- **Checklist** — tests added/updated, docs updated, migrations/rollback
  considered, security/permissions reviewed.

Items that don't apply may be dropped rather than left as empty ritual.

- Set assignee and reviewer to the repository owner/user.
- Request user testing and confirmation; provide testing data, samples,
  methods, and links with the code that needs testing in place.

## Explicit approval — required for gated actions

The ONLY valid approval is the exact phrases **"I approve"** or **"Approved"**.

- Statements like "this seems good", "ok", or "looks fine" are
  acknowledgments of progress — NOT approval.
- Follow-up questions and continued conversation are NOT approval.
- Approval covers only the actions you described when you asked for it. It is
  not standing permission for later actions.
- If you are unsure whether the user has approved, stop and prompt: state
  that you cannot proceed until they explicitly say "I approve" or
  "Approved".

Approval-gated actions:

- Pushing any branch (`git push`) and opening a PR.
- Merging any PR or committing to `main` — the user merges manually.
- Committing anything containing personal or sanitized sensitive data.
- Irreversible or externally visible actions: creating or publishing repos,
  deleting data, force-pushing, sending external messages, API calls with
  real-world side effects.

This plugin's `hooks.json` also blocks `git push`, `gh pr create`,
`gh pr merge`, and the GitHub MCP PR/push tools unless the user's current
message contains "Approved" or "I approve". The hook is a backstop — the
rules above still apply when it is not loaded. If the hook blocks an action,
stop and ask; never rephrase the command to get around it.

## Changelog

Every repo keeps `CHANGELOG.md` plus a `changelog/unreleased/` folder. Invoke
the `changelog` skill for the templates and exact procedures.

- If the repo has no changelog, create it from the skill's templates.
- Every feature, fix, or user-visible change adds exactly one entry file,
  `changelog/unreleased/<yyyy-mm-dd>-<issue>-<slug>.md`, with status
  **Pending**, in the same branch as the change.
- Entries stay Pending on feature branches and `dev`. They become
  **Approved** only through the post-merge compile on `main`.

## Merging — post-merge checklist

- After any merge to `main` — or any change to the deployment pipeline,
  secrets, or infra — run that repo's `docs/DEPLOYMENT-CHECKLIST.md`. A green
  merge only proves CI ran; the checklist proves the system still works.
- After any merge to `main`, compile the changelog (the `changelog` skill,
  section 6): move each `changelog/unreleased/` entry into `CHANGELOG.md` as
  Approved, archive previous years, and, after approval, commit to `main`
  and merge `main` back into `dev`.

## Deployment checklist

When you come across deployment/setup steps in a repo — or implement a feature
that introduces them — record them in that repo's
`docs/DEPLOYMENT-CHECKLIST.md`.

## Dependencies

- Prefer building needed functionality in-house over pulling in unvetted
  third-party packages.
- When a feature is too large or complex to build yourself, only use packages
  that are community-verified or officially approved and were published more
  than 7 days ago. Never use floating/`latest` version ranges.
- Follow best practices from official sources for the language, plus general
  industry cybersecurity patterns.

## Code style & quality

- Follow the existing conventions of the codebase you're in — naming,
  formatting, frameworks, error-handling style.
- Every new feature gets proper error handling. Errors must surface
  gracefully to the user and include useful information for debugging and
  fixing the problem.
- Keep code compact and idiomatic. No comments unless they add real context.
- Write tests for new functionality when the project has test infrastructure.

## Documentation & diagrams

- Write all diagrams in [D2](https://d2lang.com/), never mermaid.
  `d2` is installed on this machine (`brew install d2`).
- Keep `.d2` sources under `docs/diagrams/` and commit the rendered `.svg`
  files alongside them.
- Committed technical documentation must stay strictly technical — no humor.

## Coding behavior — four principles

1. **Think before coding** — state assumptions explicitly; ask when uncertain;
   present multiple interpretations rather than picking silently; push back
   when a simpler approach exists; stop and name what's confusing.
2. **Simplicity first** — minimum code that solves the problem. No speculative
   features, no abstractions for single-use code, no unrequested
   configurability, no error handling for impossible scenarios.
3. **Surgical changes** — touch only what the task requires. Match existing
   style; no drive-by refactors; remove only orphans your own changes created;
   mention unrelated dead code, don't delete it.
4. **Goal-driven execution** — convert tasks into verifiable goals; write a
   failing test first when fixing bugs; state a brief plan with a verification
   step per stage for multi-step work.

The detailed guide with worked examples ships in this plugin as the
`coding-behavior` rule — consult it when applying these principles.

## UI work

When building, changing, or reviewing a user interface, invoke the `ui-ux`
skill and follow its workflow before designing.

## Tone — session chat only

Light humor is welcome in session chat — the occasional pun or dry aside.
Never in committed code, docs, commit messages, or PR descriptions. Never
joke around errors, data loss, or security issues.
