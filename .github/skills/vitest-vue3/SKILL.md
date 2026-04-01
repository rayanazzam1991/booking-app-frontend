---
name: vitest-vue3
description: Set up, extend, and debug Vitest in Vue 3 projects, including Vite-based config, component tests with Vue Test Utils, DOM environment selection, mocking, snapshots, coverage, and optional Browser Mode. Use when Codex needs to add or fix `vitest` config, write or repair `*.test.*` and `*.spec.*` files, create test setup files, or improve Vue 3 testing workflows in a non-Nuxt app.
---

# Vitest Vue 3

## Overview

Use this skill when working on Vue 3 applications that use Vitest directly instead of Nuxt's test runtime. Prefer it for Vite + Vue repos, component tests with `@vue/test-utils`, composable tests, and targeted improvements to config, scripts, mocks, coverage, or watch-mode workflows.

Read [references/vue3-vitest-reference.md](./references/vue3-vitest-reference.md) when you need install choices, config patterns, or Browser Mode guidance.

## Workflow

### 1. Confirm the testing shape

Inspect the repo before changing anything:

- Detect whether the project already uses `vite.config.*` or a dedicated `vitest.config.*`
- Check whether `@vitejs/plugin-vue`, `@vue/test-utils`, `happy-dom`, or `jsdom` are already installed
- Look for existing `test`, `test:unit`, `coverage`, or `watch` scripts
- Check whether tests already rely on globals like `describe` and `it`, or import them explicitly

Keep the repo's current style unless there is a clear problem.

### 2. Pick the right execution environment

Choose the lightest environment that still matches the code under test:

- Use `node` for pure utilities and most non-DOM composables
- Use `happy-dom` for most Vue component tests
- Use `jsdom` only when a dependency or browser API needs behavior closer to a real browser
- Use Browser Mode when the task depends on native browser behavior, richer interaction testing, or framework-supported browser rendering

Do not default every test to a DOM environment if only a subset needs it.

### 3. Wire Vitest into Vue correctly

If the project has no solid setup yet, prefer a minimal config that keeps Vue transforms active:

```ts
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./test/setup.ts'],
  },
})
```

If the repo already keeps test config inside `vite.config.*`, extend that instead of introducing a second config file without a reason.

### 4. Write Vue tests around behavior

Prefer tests that validate rendered output, props, emitted events, and visible state changes:

- Use `mount` when child behavior, plugins, or slots matter
- Use `shallowMount` only when the repo already prefers it or the subtree would make tests noisy
- Favor user-visible assertions over implementation details
- Keep fixtures local to the test unless the repo already centralizes them

For composables:

- Test them in `node` when possible
- Mount a small Vue wrapper only when lifecycle, injections, or reactivity timing matters

### 5. Mock deliberately

Use Vitest's mocking APIs sparingly:

- `vi.fn()` for isolated callbacks
- `vi.spyOn()` when preserving most module behavior helps clarity
- `vi.mock()` for module boundaries, network clients, or expensive integrations

Reset or restore mocks consistently if the file mutates shared state. Prefer the repo's existing cleanup style in `afterEach` or setup files.

### 6. Add snapshots and coverage only where they help

Use snapshots for stable markup or serialized structures, not as a substitute for meaningful assertions.

When adding coverage:

- Reuse the existing provider if one is already configured
- Add coverage only when the task asks for it or the repo already tracks it
- Avoid making coverage gating stricter unless the user asked for policy changes

### 7. Reach for Browser Mode only when justified

Browser Mode is useful for interaction-heavy UI and native browser execution, but it adds setup overhead. Prefer it when:

- component behavior depends on real browser APIs
- the task explicitly asks for browser-based component tests
- DOM emulation has already proven unreliable

If Browser Mode is not clearly needed, keep the suite in standard Vitest environments.

## Implementation Rules

- Reuse existing scripts and naming conventions before adding new ones
- Keep config minimal; avoid enabling `globals`, aliases, reporters, or coverage settings unless the repo already uses them or the task requires them
- Match the project's file naming for tests and setup files
- Avoid mixing large config rewrites with test behavior changes in the same edit unless necessary
- Prefer small representative tests over broad snapshot dumps

## Quick Patterns

### Add a simple component test

1. Confirm a DOM environment exists
2. Import the component into a colocated `*.spec.ts` or the repo's test folder
3. Mount the component with the smallest realistic set of props
4. Assert text, attributes, emits, or interactive changes

### Fix failing CSS or asset imports under DOM tests

If a dependency chain breaks only in `jsdom` or `happy-dom`, inspect whether Vite dependency inlining is needed before changing app code. See the environment notes in [references/vue3-vitest-reference.md](./references/vue3-vitest-reference.md).

### Add Browser Mode for Vue rendering

Only after confirming the repo wants it:

1. Add the required browser provider dependency
2. Add a dedicated browser test config or project instead of repurposing every existing test
3. Keep browser tests focused on flows that benefit from native execution

## References

- [references/vue3-vitest-reference.md](./references/vue3-vitest-reference.md): install choices, config patterns, mocking, snapshots, coverage, Browser Mode, and common pitfalls
