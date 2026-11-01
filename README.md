# morgan-wilkinson-ai-skills

A [Devin](https://devin.ai) plugin that ships personal rules and skills to every Devin session — CLI, Devin Desktop, and cloud sessions.

![Plugin structure](docs/diagrams/plugin-structure.svg)

## What it contains

| Path | Type | When it applies |
|------|------|-----------------|
| `.devin-plugin/plugin.json` | Manifest | Plugin metadata; `name` is the `/<plugin>:` namespace |
| `AGENTS.md` | Always-on rule | Injected into the context of every session |
| `rules/coding-behavior.md` | Triggered rule (`model_decision`) | Loaded when the agent decides it is relevant |
| `skills/ui-ux/` | Skill | Available as `/morgan-wilkinson-skills:ui-ux`; invoked for UI work |
| `docs/diagrams/` | Documentation | `.d2` sources plus rendered `.svg` output |
| `scripts/validate.mjs` | Tooling | Structural validation, also run in CI |

## Install

```bash
devin plugins install Morgan-WIlkinson98/morgan-wilkinson-ai-skills
```

Installation is recorded in the personal plugin manifest in Devin Cloud, so the plugin loads on every signed-in machine and in cloud sessions.

For local development:

```bash
devin plugins install --local .
```

Local installs are linked to the source folder; edits apply on the next session without `devin plugins update`.

## Repository layout

```
.
├── .devin-plugin/
│   └── plugin.json           # plugin manifest
├── .github/workflows/        # CI: validate + render diagrams
├── docs/diagrams/            # D2 sources + rendered .svg
├── rules/                    # triggered rules (frontmatter: description + trigger)
├── skills/                   # skills/<name>/SKILL.md + optional resources
└── AGENTS.md                 # always-on rules
```

## CI

- **Validate plugin** (`.github/workflows/validate.yml`) — on pushes to `main` and every pull request: verifies `plugin.json` parses and has a valid `name`, `AGENTS.md` exists, every `skills/*/SKILL.md` has `name` + `description` frontmatter, and every `rules/*.md` has `trigger` + `description` frontmatter.
- **Render diagrams** (`.github/workflows/diagrams.yml`) — when `docs/diagrams/*.d2` change on `main`: installs `d2`, re-renders every `.d2` to `.svg`, and commits the results.

## Development

All changes follow the workflow defined in `AGENTS.md`: GitHub issue → `feature/<description>` branch from latest `main` → pull request → explicit human merge approval. Merging to `main` is the release — new sessions pick up the plugin at the latest commit on the default branch.

Diagrams are authored in [D2](https://d2lang.com/) under `docs/diagrams/`; the rendered `.svg` is committed alongside the `.d2` source (CI also re-renders on merge). Do not use mermaid.

## License

MIT
