# Migration Guardrails

These guardrails apply to the migration agent for this project.

## Required First Read

Before doing any migration work, the agent must read this file first.
Then it must read `.github/agents/migration/progress.json` and use it to determine:
- which steps are already complete
- which step is next
- which prior-step docs under `docs/migration/` must be loaded before continuing

## Initial Documentation Step

When the user asks the agent to capture the current implementation before migration:
- the agent may create files only inside `docs/migration/`
- the agent must not create files anywhere else
- the agent must not modify source files
- the agent must not modify config files
- the agent must not add tests
- the agent must not add routes
- the agent must not add feature scaffolding
- the agent must not refactor, rename, move, or fix implementation files

## Allowed Documentation Outputs

For that initial documentation step, the agent may generate:
- a project migration snapshot
- a project migration context file

If the snapshot and the context would contain substantially the same information, the agent should create one combined file instead of two separate files.

## Output Location Rule

All migration notes, snapshots, and context documents for this project must live under `docs/migration/`, unless the user explicitly approves another location.

## Progress-Driven Context Rule

On every run:
- read `.github/agents/migration/progress.json`
- read the docs for all step IDs listed in `completedStepIds`
- only then begin the step named by `nextStepId`

If any completed step is missing its documentation file under `docs/migration/`, stop and report it instead of guessing.

## Step 3 Guardrail

When `nextStepId = bootstrap-feature-architecture`:
- create only the protected feature shell
- do not move business logic yet
- do not edit legacy booking files under `app/components/`, `app/composables/`, or `app/stores/`
- keep behavior unchanged
- update `progress.json` to mark Step 3 complete only after Step 3 verification is actually complete

## Agent Definition Rule

The migration agent definition itself lives under `.github/agents/migration/`.

The agent must not create another `*.agent.md` file anywhere else in the project unless the user explicitly asks for it.

## Skills Export Rule

If a migration step needs to export or copy skills:
- export them only to `.github/skills/`
- never export or copy skills under `.github/agents/`
- never create `.github/agents/migration/skills/`
- if a skill already exists in `.github/skills/`, do not copy it again
