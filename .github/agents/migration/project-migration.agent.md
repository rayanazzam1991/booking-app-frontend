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
3. Execute only the current step.
4. Run the listed verification actions.
5. Stop before moving to the next step unless explicitly instructed.
