# Accept imperative instructions as approval in the gate

- **Status:** Pending
- **Type:** Fix
- **Issue:** [#12](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/12)
- **Branch:** `feature/approval-gate-imperatives`

## What changed

Direct instructions to perform a gated action now count as approval:
"merge into main", "push to origin", "merge pr 145", and one-word
commands like "merge" or "go". Permission questions and hypotheticals
("can we merge it", "should I merge", "what if we merge", "when will you
merge") are explicitly not approval.

## Why

A user replied "merge into main" to an approval ask and the gate blocked
the merge — the imperative pattern only accepted a verb plus a small
object list, so common instruction phrasings were missed. Approval should
mean "the user told me to do it", and a direct instruction is exactly that.
