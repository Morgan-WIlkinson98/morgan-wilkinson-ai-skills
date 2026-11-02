# Add adopt-standards skill for migrating existing repos

- **Status:** Pending
- **Type:** Feature
- **Issue:** [#7](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/7)
- **Branch:** `feature/adopt-standards-skill`

## What changed
A new `adopt-standards` skill migrates one repo to the dev/release workflow and changelog standard: eligibility and pre-flight checks, an inventory of rule files, workflows, and branches, local changes on `feature/adopt-standards`, and a single approval request for pushes, merges, and branch cleanup.

## Why
The plugin's rules apply only to new work and are not retroactive. Existing repos had no `dev` branch or changelog, repo-level AGENTS.md files still described feature PRs to `main`, and many local branches were already merged.
