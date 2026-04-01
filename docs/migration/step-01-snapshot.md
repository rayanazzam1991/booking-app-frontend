# Migration Step 1 — Freeze Current Behavior

**Status:** Step 1 of 5 — Documentation only. No source files were changed.
**Date captured:** 2026-03-31

---

## 1. Current User-Facing Flow

The application exposes a single page: a healthcare appointment booking form.

### Step-by-step flow

```
Browser → GET /
         └─ pages/index.vue
              └─ <ApointmentForm/>                    (components/ApointmentForm.vue)
                   └─ useAppointmentForm()            (composables/useAppointmentForm.ts)
```

#### 1.1 Page load
1. `pages/index.vue` renders `<ApointmentForm/>`.
2. `ApointmentForm` calls `useAppointmentForm()`.
3. `useAppointmentForm` runs `onMounted → serviceStore.fetchServices()`.
4. `serviceStore.fetchServices()` calls `api.get('api/services')`.
   - The Nuxt BFF route `server/api/services/index.get.ts` handles this request.
   - It proxies to the backend: `GET {BASE_URL}/api/services`.
   - Returns `ApiResponse<Service[]>`.
5. The **Service** select is populated.

#### 1.2 Service selection
1. User picks a service from the dropdown.
2. `watch(() => values.service_id)` fires inside `useAppointmentForm`.
3. Dependent fields reset (`health_professional_id`, `date`, `customer_email`).
4. `serviceStore.fetchServiceProfessionals(serviceId)` is called.
   - Hits `server/api/services/[id]/health_professionals.get.ts`.
   - Proxies to backend: `GET {BASE_URL}/api/services/:id/health_professionals`.
   - Returns `ApiResponse<HealthProfessional[]>`.
5. While the list is empty a spinner is shown; once populated, three additional
   fields animate in: **Health Professional**, **Preferred Date & Time**, **Email**.

#### 1.3 Form submission
1. User fills in professional, date/time, and email then clicks **Book Appointment Now**.
2. vee-validate runs the Zod schema (`appointmentSchema`).
3. On valid: `appointmentStore.bookAppointment(formData)` is called.
   - Uses `directApi` (raw `HttpClient` pointed at `VITE_API_BASE_URL`).
   - Makes `POST {BASE_API_URL}/appointment` with the form payload.
4. **On success:** success toast fires, green overlay animates on the card for 2 s,
   form resets.
5. **On failure:** error toast with the API error message; form stays filled.

---

## 2. Main Files Involved

### Pages
| File | Role |
|------|------|
| `app/pages/index.vue` | Single entry page — only renders `<ApointmentForm/>` |

### Components
| File | Role |
|------|------|
| `app/components/ApointmentForm.vue` | Full booking form UI — layout, animation, success overlay |

### Composables
| File | Role |
|------|------|
| `app/composables/useAppointmentForm.ts` | Form state, Zod validation, service/professional watchers, submit handler |
| `app/composables/useApi.ts` | Creates `HttpClient` instances (`api` for BFF, `directApi` for raw backend) |
| `app/composables/useToast.ts` | Thin wrapper around `vue-sonner` for success/error toasts |

### Stores (Pinia)
| File | Role |
|------|------|
| `app/stores/serviceStore.ts` | Holds `services[]` and `serviceProfessionals[]`; exposes fetch + reset actions |
| `app/stores/appointmentStore.ts` | Single action: `bookAppointment` — direct POST to backend |
| `app/stores/heathProfessionalStore.ts` | Fetches all professionals; **not wired into the current form flow** |

### Services
| File | Role |
|------|------|
| `app/services/http.ts` | Generic `HttpClient` built on `fetch`; handles base URL, auth header, JSON |

### Nuxt Server Routes (BFF/proxy layer)
| File | HTTP endpoint | Backend target |
|------|--------------|----------------|
| `server/api/services/index.get.ts` | `GET /api/services` | `{BASE_URL}/api/services` |
| `server/api/services/[id]/health_professionals.get.ts` | `GET /api/services/:id/health_professionals` | `{BASE_URL}/api/services/:id/health_professionals` |
| `server/api/health_professionals.get.ts` | `GET /api/health_professionals` | `{BASE_URL}/api/health_professionals` — **unused by current UI** |

### Shared Types
| File | Exported types |
|------|---------------|
| `shared/types/api.ts` | `ApiResponse<T>`, `PaginationResponse` |
| `shared/types/service.ts` | `Service` |
| `shared/types/healthProfessional.ts` | `HealthProfessional`, `PivotData` |

---

## 3. Network Boundary Map

```
Browser (client)
│
├── Pinia serviceStore.fetchServices()
│     └─► [Nuxt BFF] GET /api/services
│                └─► [Real Backend] GET {BASE_URL}/api/services
│
├── Pinia serviceStore.fetchServiceProfessionals(id)
│     └─► [Nuxt BFF] GET /api/services/:id/health_professionals
│                └─► [Real Backend] GET {BASE_URL}/api/services/:id/health_professionals
│
└── Pinia appointmentStore.bookAppointment(payload)
      └─► [Real Backend — direct] POST {BASE_API_URL}/appointment
                                  (no Nuxt BFF route exists for this yet)
```

**Note:** The appointment POST bypasses the Nuxt BFF and hits the backend directly via
`directApi` (using `VITE_API_BASE_URL`). A server route for this endpoint does not yet
exist under `server/api/appointments/`.

---

## 4. Validation Schema (current contract)

```ts
// app/composables/useAppointmentForm.ts
z.object({
  service_id:              z.string().min(1),
  health_professional_id:  z.string().min(1),
  date:                    z.string().min(1).refine(isValidDate),
  customer_email:          z.string().min(1).email(),
})
```

Submitted as:
```ts
{
  service_id:             Number(formData.service_id),
  health_professional_id: Number(formData.health_professional_id),
  date:                   string (ISO datetime-local),
  customer_email:         string,
}
```

---

## 5. First Migration Slice — Booking Feature

### Why this slice first
The booking flow is the **only user-facing surface** in the app. Every file in the repo
either directly implements it or supports it. Migrating it as a single vertical slice
moves the most value with no risk of breaking an unrelated feature.

### Slice boundary
The **`booking`** slice owns:

| Layer | Current file | Future feature path |
|-------|-------------|---------------------|
| Page entry | `app/pages/index.vue` | stays (thin shell) |
| Form component | `app/components/ApointmentForm.vue` | `app/features/booking/components/AppointmentForm.vue` |
| Form composable | `app/composables/useAppointmentForm.ts` | `app/features/booking/composables/useAppointmentForm.ts` |
| Appointment store | `app/stores/appointmentStore.ts` | `app/features/booking/stores/appointmentStore.ts` |
| Service store | `app/stores/serviceStore.ts` | `app/features/booking/stores/serviceStore.ts` |
| BFF route (services) | `server/api/services/index.get.ts` | stays (Nuxt server convention) |
| BFF route (professionals per service) | `server/api/services/[id]/health_professionals.get.ts` | stays |

> **Not in this slice:** `heathProfessionalStore.ts` and `server/api/health_professionals.get.ts`
> are currently unused by the UI. They will be documented separately before migration.

### What stays outside the slice (shared)
- `app/composables/useApi.ts` — generic HTTP factory; shared infrastructure
- `app/composables/useToast.ts` — generic notification helper; shared infrastructure
- `app/services/http.ts` — generic HTTP client; shared infrastructure
- `shared/types/*` — domain types; shared across slices

### Migration preconditions for Step 2
Before moving any code, tests must cover:
1. `useAppointmentForm` — service load on mount (mock `GET /api/services`)
2. `useAppointmentForm` — professional load on service select (mock `GET /api/services/:id/health_professionals`)
3. `useAppointmentForm` — successful booking (mock `POST /appointment`)
4. `useAppointmentForm` — failed booking shows error toast (mock failing `POST /appointment`)
5. `ApointmentForm` component — renders service dropdown, progressive field reveal, submit button

All mocks must target the **network boundary** (Nuxt BFF routes or `directApi` `fetch`)
and must never call the real backend.

---

## 6. Files Changed by This Step

**No source files were changed.**

| Action | Path |
|--------|------|
| Created | `docs/migration/step-01-snapshot.md` (this file) |
| Created | `docs/migration/` directory |

---

## 7. Verification Checklist

- [x] Current booking flow is documented (sections 1–4)
- [x] First migration slice is identified without reorganizing the repo (section 5)
- [x] No broad structural rewrite was performed
- [x] No source files were modified
- [x] UI and behavior are unchanged (documentation step only)
- [ ] **Manual:** Open `http://localhost:3000` and confirm the booking form renders and services load

