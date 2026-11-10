# Deployment checklist

Merging to `main` is the release: new sessions load the plugin at the latest commit on the default branch.

## One-time setup

- [ ] `dev` testing branch exists on `origin` (created from `main`).

## Ship to `main`

`main` is protected by the organization ruleset "Protect default branch - PR required" (PR required, squash or rebase only, linear history, no bypass). `dev` is a testing branch and is never merged into `main`.

1. Ship a single feature from its feature branch, or several from `release/<yyyy-mm-dd>` cut from `main`; compile the changelog on that branch (`changelog` skill, section 6).
2. Open the PR to `main`; the user merges it.

## After every merge to `main`

1. Sync `dev`: merge the shipped branch into `dev`, then `main` into `dev`, and push `dev` (`changelog` skill, section 6).
2. Confirm the **Validate plugin** workflow passed on `main`.
3. If `docs/diagrams/` changed, confirm the **Check diagrams** workflow passed.
4. Refresh the installed plugin: `devin plugins update morgan-wilkinson-skills`.
5. In a new session, verify:
   - `devin plugins info morgan-wilkinson-skills` lists the `adopt-standards`, `changelog`, and `ui-ux` skills, the `coding-behavior` rule, and the hooks.
   - `/hooks` shows the `UserPromptSubmit` and `PreToolUse` approval-gate hooks.
   - Asking the agent to run `git push --dry-run` without an affirmative reply in the same message is blocked by the approval gate.
