# Migration Step 3 — Feature Architecture Shell

**Status:** Step 3 of 5 — Complete. No legacy source files were changed.
**Date completed:** 2026-04-02

---

## 1. Objective

Create the protected feature root that New Studio's AI-friendly architecture
expects, without moving any business logic.  The shell is deliberately thin:
it establishes the module boundaries and public-API contract so that
future steps can migrate logic one file at a time into a well-defined home.

---

## 2. Files Created

| Action  | Path                                                        | Purpose |
|---------|-------------------------------------------------------------|---------|
| Created | `app/features/booking/manifest.ts`                          | Static metadata for the booking feature (id, name, version, status, legacyRoots) |
| Created | `app/features/booking/index.ts`                             | Public API entry point — currently re-exports the manifest only |
| Created | `app/features/registry.ts`                                  | Scanner-readable feature registry in JSON-shaped export format |
| Created | `app/features/index.ts`                                     | Runtime feature helpers and public re-exports for app code |
| Created | `test/nuxt/features/booking.manifest.spec.ts`               | 13 structural verification tests (no network calls, no mocked fetch) |
| Created | `docs/migration/step-03-feature-shell.md`                   | This file |

**No legacy source files were modified.**

Files explicitly left untouched (guardrail compliance):

| Path | Reason |
|------|--------|
| `app/components/ApointmentForm.vue` | Legacy root — Step 3 guardrail |
| `app/composables/useAppointmentForm.ts` | Legacy root — Step 3 guardrail |
| `app/stores/appointmentStore.ts` | Legacy root — Step 3 guardrail |
| `app/stores/serviceStore.ts` | Legacy root — Step 3 guardrail |
| `app/composables/useApi.ts` | Shared infrastructure |
| `app/composables/useToast.ts` | Shared infrastructure |
| `app/services/http.ts` | Shared infrastructure |
| `app/pages/index.vue` | Page shell — not owned by feature |
| `server/api/**` | Nuxt server convention — stays in place |
| `shared/types/**` | Cross-slice domain types |

---

## 3. Feature Shell Structure

```
app/features/
├── registry.ts                       ← scanner-readable feature registry
├── index.ts                          ← runtime helpers + re-exports all public APIs
└── booking/
    ├── manifest.ts                   ← feature metadata (static, side-effect-free)
    └── index.ts                      ← public API entry point (thin during shell phase)
```

Placeholder directories (components, composables, stores) are **not** created
yet — they will be added by the step that actually migrates the first file into
them, keeping the repository tidy.

---

## 4. Design Decisions

### Why `manifest.ts` is side-effect-free
New Studio's scanner performs static analysis on the manifest.  Any runtime
import (Pinia, Vue, `useFetch`, etc.) would break the scan.  The manifest
file is therefore a plain TypeScript `const` with no imports.

### Why `registry.ts` exists separately from `index.ts`
New Studio reads `app/features/registry.ts` directly using a strict parser.
That file must stay JSON-shaped and import-free.  Runtime helpers and
re-exports therefore live in `app/features/index.ts` instead.

### Why `legacyRoots` is declared on the manifest
It makes the migration contract explicit and machine-readable.  Tooling (and
reviewers) can see exactly which legacy files belong to the `booking` slice
and track when each has been absorbed.

### Why `getFeatureManifest` lives in the registry, not the manifest
The manifest must stay side-effect-free.  A helper that performs a lookup
belongs at the registry layer, not inside the feature itself.

### Why `status: 'shell'`
The lifecycle field (`shell` → `migrating` → `complete`) lets the scanner
report migration progress without requiring a separate tracker file.

---

## 5. Test Strategy

The 13 new tests in `test/nuxt/features/booking.manifest.spec.ts` are
**purely structural** — they import TypeScript modules and assert on their
shape.  No components are mounted, no stores are accessed, and no HTTP calls
are made.  Accordingly, no `fetch` mock is required.

The two "legacy source roots" tests use dynamic `import()` to verify that
the legacy files still resolve, proving that nothing was accidentally moved
or deleted during this step.

---

## 6. Test Results

```
Test Files  3 passed (3)
     Tests  26 passed (26)
```

| Suite                                    | Tests | Coverage area                                   |
|------------------------------------------|-------|-------------------------------------------------|
| `useAppointmentForm.spec.ts`             | 7     | mount, service select, success, failure (step 2) |
| `AppointmentForm.spec.ts`                | 6     | heading, labels, items, loading, reveal (step 2) |
| `features/booking.manifest.spec.ts`      | 13    | registry shape, manifest shape, legacy roots intact |

---

## 7. Verification Checklist

- [x] `app/features/booking/manifest.ts` created and exports `bookingFeatureManifest`
- [x] `app/features/booking/index.ts` created and re-exports from the manifest
- [x] `app/features/registry.ts` created in scanner-readable format
- [x] `app/features/index.ts` created with runtime helpers and re-exports
- [x] 13 new structural tests pass
- [x] All 26 tests pass (`pnpm test`)
- [x] No legacy source files modified
- [x] No business logic moved
- [x] `progress.json` updated (step 3 marked complete, next = `migrate-booking-logic`)
- [ ] **Manual:** Open `http://localhost:3000` and confirm the booking form still renders and services load (unchanged)

---

## 8. Next Step

**Step 4 — Migrate Booking Logic**

Begin moving the booking-feature business logic (composables, stores,
component) from the legacy source roots into `app/features/booking/`,
one file at a time.  Add re-export shims in the original locations so that
nothing that imports from the legacy paths breaks.
