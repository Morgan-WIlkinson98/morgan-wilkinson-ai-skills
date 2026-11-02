# Deployment checklist

Merging to `main` is the release: new sessions load the plugin at the latest commit on the default branch.

## One-time setup

- [ ] `dev` branch exists on `origin` (created from `main`).
- [ ] Optional: set the repository default branch for PRs so feature PRs target `dev`.

## After every merge to `main`

1. Compile the changelog (`changelog` skill, section 6): move `changelog/unreleased/` entries into `CHANGELOG.md` as Approved, commit to `main` after approval, then merge `main` back into `dev`.
2. Confirm the **Validate plugin** workflow passed on `main`.
3. If `docs/diagrams/*.d2` changed, confirm the **Render diagrams** workflow committed updated `.svg` files.
4. Refresh the installed plugin: `devin plugins update morgan-wilkinson-skills`.
5. In a new session, verify:
   - `devin plugins info morgan-wilkinson-skills` lists the `changelog` and `ui-ux` skills, the `coding-behavior` rule, and the hooks.
   - `/hooks` shows the `UserPromptSubmit` and `PreToolUse` approval-gate hooks.
   - Asking the agent to run `git push --dry-run` without "Approved" in the same message is blocked by the approval gate.
