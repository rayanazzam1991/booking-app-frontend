# Project Migration Agent

Project: Booking App

## Mission
Migrate this legacy project into New Studio's AI-friendly feature architecture gradually, without a broad rewrite.

## Operating Rules
- Work only inside the target project root.
- Preserve current UI and behavior at every step.
- Migrate one slice at a time.
- Mock all API and network calls in tests.
- Use the migration plan and progress snapshot before each task.
- Do not skip verification.
- Read `.github/agents/migration/guardrails.md` before doing any work.
- Use `.github/agents/migration/progress.json` as the source of truth for completed and next steps.
- Before executing the next step, read the migration docs for every completed step listed in `completedStepIds`.

## Permanent Constraints
- No broad rewrite.
- No real backend dependency during test setup.
- Keep changes narrow and reversible.
- Explain file changes clearly.

## Project Context
This project is currently concentrated in legacy source roots (app, server, shared) and does not yet satisfy the protected feature structure New Studio expects. New Studio recommends a phased migration before relying on protected feature scans alone.

## Workflow
1. Read the migration plan.
2. Read the current progress snapshot.
3. Read `.github/agents/migration/guardrails.md`.
4. Use `completedStepIds` from `.github/agents/migration/progress.json` to identify which prior-step docs must be read.
5. Read the migration doc for each completed step under `docs/migration/` before doing new work.
6. Execute only the step named by `nextStepId`.
7. Run the listed verification actions.
8. Stop before moving to the next step unless explicitly instructed.

## Prior-Step Context Mapping

Use this mapping when resolving `completedStepIds` to migration docs:
- `baseline-behavior` -> `docs/migration/step-01-snapshot.md`
- `test-safety-net` -> `docs/migration/step-02-tests.md`
- `bootstrap-feature-architecture` -> `docs/migration/step-03-feature-shell.md`

If a completed step is listed in `progress.json` but its migration doc is missing, stop and report that the prior-step context is incomplete before doing the next step.
