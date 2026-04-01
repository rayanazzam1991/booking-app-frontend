---
name: vitest-nuxt
description: Set up, extend, and debug Vitest in Nuxt applications using `@nuxt/test-utils`, including project-based separation for `node`, `nuxt`, and end-to-end suites, runtime helpers such as `mountSuspended` and `renderSuspended`, DOM mock options, and Playwright-backed browser flows. Use when Codex needs to add or fix `vitest` config, Nuxt runtime tests, `@nuxt/test-utils` setup, or test organization in a Nuxt codebase.
---

# Vitest Nuxt

## Overview

Use this skill for Nuxt apps where plain Vue Vitest guidance is not enough. Prefer it whenever tests rely on Nuxt runtime context, auto-imports, plugins, route-aware mounting, or Nuxt's end-to-end helpers.

Read [references/nuxt-vitest-reference.md](./references/nuxt-vitest-reference.md) when you need config templates, helper selection, or environment rules.

## Workflow

### 1. Classify the test before editing config

Nuxt projects usually need more than one testing mode. Decide which one applies:

- `node` unit tests for pure functions and utilities
- `nuxt` runtime tests for components or composables that need Nuxt app context
- `e2e` tests for page navigation, SSR output, or browser automation

Do not collapse these into one environment unless the repo is intentionally simple and the tradeoff is acceptable.

### 2. Prefer project-based Vitest setup

Nuxt's docs recommend separating environments with Vitest projects. That usually means:

- one fast `unit` project in `node`
- one `nuxt` project powered by `@nuxt/test-utils`
- separate files for `e2e` flows

This keeps runtime-heavy tests from slowing every unit test and avoids confusing hybrid behavior.

### 3. Use the Nuxt runtime only where needed

For tests that need plugins, auto-imports, `nuxtApp`, or route-aware component mounting, use Nuxt helpers instead of hand-rolled shims:

- `mountSuspended` for Vue Test Utils style mounting in Nuxt context
- `renderSuspended` when the repo prefers Testing Library patterns
- `mockNuxtImport` for Nuxt import boundaries

If a component is truly plain Vue and does not touch Nuxt context, a simpler Vue-style test may be enough.

### 4. Keep runtime tests and e2e tests separate

Do not mix `@nuxt/test-utils/runtime` and `@nuxt/test-utils/e2e` in the same file. Split files by environment and use the repo's naming pattern, or adopt a clear split such as:

- `test/unit/*.spec.ts`
- `test/nuxt/*.spec.ts`
- `test/e2e/*.spec.ts`

### 5. Avoid the hybrid trap

Nuxt documents a simpler single-environment setup, but also warns that opting out per file can create a confusing hybrid where Nuxt Vite plugins run while `nuxtApp` is not initialized. Prefer the project-based setup unless the repo is intentionally tiny and the limitation is acceptable.

### 6. Configure DOM mocks and environment options intentionally

When runtime tests need browser-like APIs:

- keep the default DOM environment unless a dependency requires change
- enable Nuxt-specific mocks like `intersectionObserver` or `indexedDb` only when tests need them
- avoid global mock toggles that hide real regressions

### 7. Use e2e helpers for integration flows

For SSR, routing, and browser automation:

- `setup` to prepare the Nuxt app or attach to an existing host
- `$fetch` for server-rendered HTML checks
- `createPage` for Playwright-backed browser interaction

Keep e2e suites focused on user flows and cross-boundary integration, not small component details.

## Implementation Rules

- Reuse existing `vitest.config.*` and test directories before inventing new ones
- Keep `@nuxt/test-utils` wiring explicit rather than hidden in broad repo rewrites
- Prefer project-based config over ad hoc per-file environment comments
- Reset shared state in Nuxt runtime tests when the code mutates globals, stores, or singleton composables
- When adding new scripts, mirror the repo's package manager and script naming

## Quick Patterns

### Add a Nuxt runtime component test

1. Place the file in the repo's Nuxt runtime test area
2. Import `mountSuspended` from `@nuxt/test-utils/runtime`
3. Mount the component with route or props context if needed
4. Assert rendered behavior, not Nuxt internals

### Add a plain utility test

Keep it in the `node` project. Do not pull it into the Nuxt runtime unless the code genuinely depends on Nuxt context.

### Add an e2e page test

1. Put it in the e2e test area
2. Use `setup` from `@nuxt/test-utils/e2e`
3. Use `$fetch` for SSR assertions or `createPage` for browser assertions
4. Keep runtime helper imports out of the file

## References

- [references/nuxt-vitest-reference.md](./references/nuxt-vitest-reference.md): installation, project-based config, runtime helpers, mocks, and e2e patterns
