# Fix release back-merge leaving released entries Pending on dev

- **Status:** Pending
- **Type:** Fix
- **Issue:** [#6](https://github.com/Morgan-WIlkinson98/morgan-wilkinson-ai-skills/issues/6)
- **Branch:** `feature/fix-release-back-merge`

## What changed
After a release, the release branch is merged into `dev` before `main` is, followed by checks that `CHANGELOG.md` matches `main` and that only post-cut entries remain in `changelog/unreleased/`.

## Why
`main` only accepts squash or rebase merges, so merging only `main` into `dev` did not carry the compile commit's deletions back to `dev`. Released entries stayed Pending on `dev` and would have been compiled again in the next release.
