# Migration Step 2 — Mocked Behavior Tests

**Status:** Step 2 of 5 — Complete. No source files were changed.
**Date captured:** 2026-03-31

---

## 1. Objective

Add a test safety-net that freezes the current behavior before any code is
moved.  Every test must pass without a real backend.

---

## 2. Files Added / Changed

| Action   | Path                                        | Purpose |
|----------|---------------------------------------------|---------|
| Added    | `vitest.config.ts`                          | Vitest config wired to the `nuxt` environment via `@nuxt/test-utils/config` |
| Added    | `test/setup.ts`                             | Global setup — suppresses app-level `console.log` noise |
| Added    | `test/nuxt/fixtures.ts`                     | Shared domain fixtures and `Response` builders |
| Added    | `test/nuxt/useAppointmentForm.spec.ts`      | 7 tests for the composable (tests 1–4 from snapshot §5) |
| Added    | `test/nuxt/AppointmentForm.spec.ts`         | 6 tests for the component (test 5 from snapshot §5) |
| Modified | `package.json`                              | Added `test` and `test:watch` scripts |
| Modified | `.github/agents/migration/progress.json`    | Marked step 2 complete, next = `feature-shell` |
| Added    | `docs/migration/step-02-tests.md`           | This file |

**No source files were modified.**

---

## 3. Installed Dev Dependencies

```
@nuxt/test-utils  ^4.0.0   – Nuxt 4 runtime environment for Vitest
vitest            ^4.1.2   – Test runner
@vue/test-utils   ^2.4.6   – Component mounting helpers
happy-dom         ^20.8.9  – DOM environment (lighter than jsdom)
```

---

## 4. Network Boundary Strategy

All network calls are mocked at the `fetch` global level using
`vi.stubGlobal('fetch', vi.fn())`.  This intercepts every HTTP request
that `HttpClient` makes, regardless of which store or composable initiates
it.  No real backend is contacted.

Mock responses are constructed with `new Response(JSON.stringify(…), {…})`
so they exactly match what `HttpClient.request()` parses.

```
Test                         Mocked fetch calls
─────────────────────────────────────────────────────────────────────────
service load on mount        GET /api/services
professional load on select  GET /api/services/1/health_professionals
successful booking           GET /api/services, GET .../health_professionals, POST /appointment
failed booking               GET /api/services, GET .../health_professionals, POST /appointment (422)
component render             GET /api/services
component loading state      GET /api/services + hang (never resolves)
component field reveal       GET /api/services, GET .../health_professionals
```

---

## 5. Form Value Mutation Technique

vee-validate v4 wraps `values` in `readonly()`.  Vue Test Utils adds a
second readonly proxy on `wrapper.vm`.  Direct assignment
(`wrapper.vm.values.x = '…'`) therefore fails silently with a Vue warn.

The fix: retrieve the vee-validate form context from the component's
`provides` object (where `useForm()` stores it via Vue's `provide()`) and
call `ctx.setFieldValue(field, value)` — the official mutation path.

```ts
// In test helpers (test/nuxt/*.spec.ts):
function setField(wrapper: any, field: string, value: string) {
  const provides: Record<symbol, unknown> = (wrapper.vm as any).$.provides ?? {}
  for (const key of Object.getOwnPropertySymbols(provides)) {
    const v = provides[key] as any
    if (v && typeof v === 'object' && typeof v.setFieldValue === 'function') {
      v.setFieldValue(field, value)
      return
    }
  }
}
```

---

## 6. Known Pre-existing Warnings

The composable (`useAppointmentForm.ts`) resets dependent fields by direct
mutation:

```ts
values.health_professional_id = ''
values.date = ''
values.customer_email = ''
```

Because `values` is `readonly()`, Vue emits:

```
[Vue warn] Set operation on key "health_professional_id" failed: target is readonly.
```

These warnings were present before this step and are not caused by the
tests.  They surface in the test output but do not affect test results.
They should be fixed in a future step by replacing direct mutation with
`setFieldValue` calls (but that is a source-code change outside this
step's scope).

---

## 7. Test Results

```
Test Files  2 passed (2)
     Tests  13 passed (13)
```

| Suite                         | Tests | Coverage area                              |
|-------------------------------|-------|--------------------------------------------|
| `useAppointmentForm.spec.ts`  | 7     | mount, service select, success, failure    |
| `AppointmentForm.spec.ts`     | 6     | heading, labels, items, loading, reveal    |

---

## 8. Preconditions for Step 3 (Feature Shell)

- [x] Tests cover the main booking flow (snapshot §5 checks 1–5)
- [x] All API calls are mocked — no real backend needed
- [x] 13/13 tests pass (`pnpm test`)
- [x] UI and behavior are unchanged (documentation/test step only)
- [ ] **Manual:** Open `http://localhost:3000` and confirm the booking form
      still renders and services load (unchanged from step 1)

---

## 9. Next Step

**Step 3 — Feature Architecture Shell**

Create the protected feature structure (`app/features/booking/`) that New
Studio expects, without moving any business logic yet.

