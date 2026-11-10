# Relax approval gate to accept any clear affirmative

- **Status:** Pending
- **Type:** Change
- **Issue:** [#10](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/10)
- **Branch:** `feature/relaxed-approval-gate`

## What changed

The approval gate no longer requires the literal phrases "I approve" or
"Approved". Any clear positive affirmation in the same turn — "yes",
"go ahead", "do it", "push it", "approved", and similar — unlocks the
gated action. Negations and status questions still do not count.

## Why

The exact-phrase requirement was too strict: natural approvals like "yes,
push it" were blocked, forcing stilted replies. The gate still requires the
agent to describe the specific action and ask first, and approval remains
scoped to the same turn — it is just phrased like a human now.
