# Port approval gate to Python

- **Status:** Pending
- **Type:** Fix
- **Issue:** [#16](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/16)
- **Branch:** `feature/approval-gate-python`

## What changed
The approval-gate hook and its tests now run with `python3` instead of `node`. Hook behavior is unchanged: pushes, PR creation, and PR merges still require clear same-turn approval.

## Why
Devin session VMs do not guarantee a Node.js runtime, so the hook exited with code 127 and failed open instead of enforcing the approval gate. Python is already available on those VMs.
