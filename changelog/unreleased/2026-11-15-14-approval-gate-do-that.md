# approval-gate: stop voiding "do that / do the X" approvals

- **Status:** Pending
- **Type:** Fix
- **Issue:** [#14](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/14)
- **Branch:** `feature/approval-gate-do-that`

## What changed
The gate's BLOCKER regex no longer treats `do that`, `do this`, or
`do the <thing>` as status questions. Only the real question forms
(`do you`, `do they`) still void approval. A reply like "yes thats
good go ahead and do that" now counts as approval instead of being
rejected.

## Why
The `do (you|that|the|they|this)` clause was meant to catch status
questions, but `do that`/`do this`/`do the X` are imperative approvals
in reply context — after a describe-and-ask they are exactly what
approval sounds like. Verified against approval/question/negation
cases: imperative approvals pass, questions and negations still block.
