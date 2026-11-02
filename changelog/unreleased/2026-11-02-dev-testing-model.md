# Make dev a testing branch and ship feature branches to main by PR

- **Status:** Pending
- **Type:** Change
- **Issue:** _added once the issue is created_
- **Branch:** `feature/dev-testing-model`

## What changed
Feature branches start from `main`, are merged into `dev` only for testing, and ship to `main` through their own PR or through a `release/<yyyy-mm-dd>` branch cut from `main` that carries several features. `dev` is never merged into `main` and is never reset unless the user says so. The changelog is compiled on the branch being shipped, and after each merge the shipped branch and `main` are merged into `dev`. Compiled entries link the PR that carried them.

## Why
`dev` is meant to be a testing branch, not a release line. Releasing from `dev` would ship every feature merged there for testing, including untested ones.
