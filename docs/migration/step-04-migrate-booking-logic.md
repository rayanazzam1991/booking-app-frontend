````markdown
# Migration Step 4 — Migrate Booking Logic

**Status:** Step 4 of 5 — Complete. Business logic moved; legacy paths remain as adapters.
**Date completed:** 2026-04-02

---

## 1. Objective

Move the booking-feature's business logic (stores, composable, component) from
the legacy source roots into `app/features/booking/`, one file at a time.
Place re-export shims at every legacy location so that nothing that already
imports from those paths is broken.

---

## 2. Files Created

| Action  | Path                                                              | Purpose |
|---------|-------------------------------------------------------------------|---------|
| Created | `app/features/booking/stores/serviceStore.ts`                     | Canonical service store (moved from `app/stores/serviceStore.ts`) |
| Created | `app/features/booking/stores/appointmentStore.ts`                 | Canonical appointment store (moved from `app/stores/appointmentStore.ts`) |
| Created | `app/features/booking/composables/useAppointmentForm.ts`          | Canonical form composable (moved from `app/composables/useAppointmentForm.ts`) |
| Created | `app/features/booking/components/AppointmentForm.vue`             | Canonical form component (moved from `app/components/ApointmentForm.vue`) |
| Created | `test/nuxt/features/booking.logic.spec.ts`                        | 13 new tests importing directly from the feature paths |
| Created | `docs/migration/step-04-migrate-booking-logic.md`                 | This file |

---

## 3. Files Updated

| Action   | Path                                                        | Change |
|----------|-------------------------------------------------------------|--------|
| Modified | `app/stores/serviceStore.ts`                                | Re-export shim → `app/features/booking/stores/serviceStore.ts` |
| Modified | `app/stores/appointmentStore.ts`                            | Re-export shim → `app/features/booking/stores/appointmentStore.ts` |
| Modified | `app/composables/useAppointmentForm.ts`                     | Re-export shim → `app/features/booking/composables/useAppointmentForm.ts` |
| Modified | `app/components/ApointmentForm.vue`                         | Vue SFC shim — `export { default }` re-exports the feature component |
| Modified | `app/features/booking/index.ts`                             | Added exports: `useServiceStore`, `useAppointmentStore`, `useAppointmentForm`, `AppointmentForm` |
| Modified | `app/features/booking/manifest.ts`                          | `status` advanced from `'shell'` → `'migrating'` |
| Modified | `test/nuxt/features/booking.manifest.spec.ts`               | Status assertion updated to `'migrating'` |

**No other source files were modified.**

---

## 4. Migration Order and Rationale

Files were migrated bottom-up so each new feature file had stable dependencies before being imported:

```
1. stores/serviceStore.ts      — leaf node; no intra-feature deps
2. stores/appointmentStore.ts  — leaf node; no intra-feature deps
3. composables/useAppointmentForm.ts — depends on both stores (via auto-import)
4. components/AppointmentForm.vue    — depends on the composable (via auto-import)
```

---

## 5. Adapter / Shim Strategy

### TypeScript shims (`app/stores/`, `app/composables/`)

Plain re-export:

```ts
// app/stores/serviceStore.ts (shim)
export { useServiceStore } from '../features/booking/stores/serviceStore'
```

`@pinia/nuxt` scans `app/stores/` and discovers `useServiceStore` via the
re-export.  Auto-imports are unchanged — no store consumer needed updating.
The same pattern is used for `useAppointmentStore` and `useAppointmentForm`.

### Vue SFC shim (`app/components/ApointmentForm.vue`)

```vue
<!-- app/components/ApointmentForm.vue -->
<script lang="ts">
export { default } from '../features/booking/components/AppointmentForm.vue'
</script>
```

`export { default }` in a plain `<script>` block re-exports the feature
component object.  Nuxt's auto-import of `<ApointmentForm/>` resolves to the
shim, which in turn resolves to the same class as the feature component.  No
wrapper layer is added, so:

- `wrapper.vm` IS the feature component instance in tests
- vee-validate `provides` are present at the root level
- All existing `AppointmentForm.spec.ts` tests pass without modification

---

## 6. Import-Path Changes Inside Feature Files

All feature files use explicit relative imports for anything outside the
`app/` directory:

```
From: app/features/booking/stores/
  ../../../../shared/types/…   → shared/types/…  (project root)
  ../../../composables/useApi  → app/composables/useApi

From: app/features/booking/composables/
  ../../../composables/useToast → app/composables/useToast

From: app/features/booking/components/
  ../../../../shared/types/…   → shared/types/…  (project root)
  @/components/ui/…            → app/components/ui/… (via ~ alias)
```

Everything inside `app/` that is registered as a Nuxt auto-import
(`defineStore`, `ref`, `computed`, `useRuntimeConfig`, `useForm`,
`storeToRefs`, `useServiceStore`, `useAppointmentStore`) is left as an
auto-import call — identical to the legacy files.

---

## 7. What Stayed Unchanged

| Path | Reason |
|------|--------|
| `app/pages/index.vue` | Page shell — no change; `<ApointmentForm/>` auto-import still resolves |
| `app/composables/useApi.ts` | Shared infrastructure — not part of booking slice |
| `app/composables/useToast.ts` | Shared infrastructure |
| `app/services/http.ts` | Shared infrastructure |
| `app/stores/heathProfessionalStore.ts` | Unused by current UI — not in booking slice |
| `server/api/**` | Nuxt server convention — stays in place |
| `shared/types/**` | Cross-slice domain types |

---

## 8. Network Boundary Strategy (tests)

All new tests in `booking.logic.spec.ts` use `vi.stubGlobal('fetch', vi.fn())`
to intercept every HTTP call at the `fetch` global.  No real backend is
contacted.  The mocking strategy is identical to step 2.

---

## 9. Test Results

```
Test Files  4 passed (4)
     Tests  39 passed (39)
```

| Suite                                    | Tests | Coverage area                                        |
|------------------------------------------|-------|------------------------------------------------------|
| `useAppointmentForm.spec.ts`             | 7     | Composable via auto-import chain (step 2 safety net) |
| `AppointmentForm.spec.ts`                | 6     | Component via legacy shim (step 2 safety net)        |
| `features/booking.manifest.spec.ts`      | 13    | Registry shape, manifest shape, shim resolution      |
| `features/booking.logic.spec.ts`         | 13    | Feature-path imports: API shape, composable, component, shims |

---

## 10. Verification Checklist

- [x] `app/features/booking/stores/serviceStore.ts` created with full implementation
- [x] `app/features/booking/stores/appointmentStore.ts` created with full implementation
- [x] `app/features/booking/composables/useAppointmentForm.ts` created with full implementation
- [x] `app/features/booking/components/AppointmentForm.vue` created with full implementation
- [x] All legacy files replaced with re-export shims (no behavior change)
- [x] `app/features/booking/index.ts` exports all four new modules
- [x] `manifest.ts` `status` advanced to `'migrating'`
- [x] All 26 prior tests still pass
- [x] 13 new tests added targeting feature paths directly (39 total pass)
- [x] No real backend called in any test
- [x] `progress.json` updated (step 4 marked complete, next = `cleanup-legacy-shims`)
- [ ] **Manual:** Open `http://localhost:3000` and confirm the booking form renders,
      services load, and a booking can be submitted (behavior unchanged)

---

## 11. Next Step

**Step 5 — Cleanup Legacy Shims**

Remove the re-export shim files once the page (`index.vue`) and any remaining
callers are updated to import directly from `app/features/booking/`.  The
`manifest.ts` status will advance from `'migrating'` to `'complete'`.
````
