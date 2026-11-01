# Morgan's Global Rules

These rules apply to every repo and every session. Where they conflict with
project-level rules or other imported conventions, these rules take
precedence — except that a repo's own security, compliance, or licensing
policies always win.

## Sensitive data — sanitize and ask

- Always sanitize personal or sensitive information before it is committed.
- Always ask the user whether sanitized content should be committed at all.
  Committing anything containing personal data is a human-approval task —
  never rely on your own assumption that it's fine.

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

- Start every piece of work with `git fetch --all --prune`.
- Create a GitHub issue for the work, then a feature branch from the latest
  `main`: `feature/<short-description-or-issue>`.
- Never commit directly to `main`.

## Pull requests

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

## Merging — human approval only

- The user merges to `main` manually. Never merge without explicit user
  confirmation — follow-up questions or continued conversation are NOT
  approval.
- A merge is only authorized by explicit keywords such as "approved",
  "merge pr <number>", "I give my approval", or a close variation.
- After any merge to `main` — or any change to the deployment pipeline,
  secrets, or infra — run that repo's `docs/DEPLOYMENT-CHECKLIST.md`. A green
  merge only proves CI ran; the checklist proves the system still works.

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
