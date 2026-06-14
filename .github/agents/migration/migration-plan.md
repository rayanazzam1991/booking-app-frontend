# Legacy architecture detected

This project is currently concentrated in legacy source roots (app, server, shared) and does not yet satisfy the protected feature structure New Studio expects. New Studio recommends a phased migration before relying on protected feature scans alone.

Agent file: `.github/agents/migration/project-migration.agent.md`

Progress file: `.github/agents/migration/progress.json`

On every run, the migration agent must:
1. read the progress file first
2. load the docs for all completed steps listed in `completedStepIds`
3. execute only the step named by `nextStepId`

## Recommended Skills
- nuxt
- vitest-nuxt
- vitest-vue3

## Steps
### 1. Freeze current behavior
Objective: Capture the current UI flow and identify the minimum slice to migrate first.
Skills:
- nuxt
Completion checks:
- The current booking or primary flow is documented.
- A single first migration slice is chosen.
- No broad structural rewrite was performed.
Scanner actions:
- Refresh architecture summary.
- Confirm the project is still in guided migration mode.
Manual verification:
- Open the current UI and confirm behavior is unchanged.

### 2. Add mocked behavior tests
Objective: Protect the existing behavior before refactoring anything.
Skills:
- nuxt
- vitest-nuxt
- vitest-vue3
Completion checks:
- Tests cover the main current flow.
- All API calls are mocked or faked.
- Tests pass without hitting a real backend.
Scanner actions:
- Run project tests.
- Record any files that still need migration.
Manual verification:
- Compare the visible UI before and after test setup.

### 3. Create feature architecture shell
Objective: Introduce the protected structure New Studio expects without migrating all business logic yet.
Skills:
- nuxt
Completion checks:
- Feature root exists.
- Registry exists.
- At least one protected feature has manifest and public entry points.
Scanner actions:
- Refresh architecture summary.
- Run rule scanner after the new feature shell is created.
Manual verification:
- Confirm the app still renders and routes as before.

### 4. Migrate one vertical slice
Objective: Move one feature seam into the protected structure while preserving behavior.
Skills:
- nuxt
- vitest-nuxt
Completion checks:
- One slice now lives behind the protected feature boundary.
- Legacy callers still work through adapters or public exports.
- Tests still pass.
Scanner actions:
- Run rule scanner.
- Run change scan to confirm no new protected-path drift.
Manual verification:
- Compare the migrated flow in the browser with the previous version.

### 5. Verify and repeat incrementally
Objective: Close the loop with scanners and manual checks before migrating the next slice.
Skills:
- nuxt
Completion checks:
- Rule scanner runs cleanly for the migrated slice.
- The app behavior remains unchanged.
- Next migration slice is identified clearly.
Scanner actions:
- Run rule scanner.
- Refresh architecture summary.
- Re-run tests.
Manual verification:
- Perform a final UI and behavior comparison for the completed slice.

