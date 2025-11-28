# Booking App Frontend (Nuxt 4)

Single-page booking experience built with Nuxt 4, Vue 3, Pinia, and Vee-Validate. The UI fetches services and health professionals from a backend API, lets users pick a slot, and posts the booking request.

## Prerequisites
- Node.js 18+
- pnpm 9+ (recommended) or npm/yarn/bun

## Project structure
- `app/pages/index.vue` – renders the booking form shell.
- `app/components/ApointmentForm.vue` – main UI for selecting service, professional, date, and email, plus success state animations.
- `app/composables/` – shared logic:
  - `useAppointmentForm.ts` – wiring between the UI, validation (Zod + Vee-Validate), and Pinia stores.
  - `useApi.ts` – lightweight HTTP client factory that reads the API base URL from runtime config.
  - `useToast.ts` – toast helpers built on `vue-sonner`.
- `app/stores/` – Pinia stores that talk to the API:
  - `serviceStore.ts` – fetches services and professionals for a selected service.
  - `appointmentStore.ts` – submits an appointment.
  - `heathProfessionalStore.ts` – standalone list of professionals (not used by the main form but available).
- `app/services/http.ts` – minimal fetch-based HTTP client with optional Bearer token support.
- `server/api/` – Nuxt server routes that proxy to your backend using runtime config (helpful for local dev and avoiding CORS):
  - `services/index.get.ts`
  - `health_professionals.get.ts`
- `shared/types/` – TypeScript interfaces for API payloads.

## Environment configuration
Create a `.env` (or `.env.local`) in the project root before running the app:

```bash
VITE_API_BASE_URL=https://your-backend.example.com/api   # used directly by the client (HttpClient)
VITE_BASE_URL=https://your-backend.example.com           # used by Nuxt server routes ($fetch base)
```

- `VITE_API_BASE_URL` is injected into `runtimeConfig.public.BASE_API_URL` and used by `useApi().directApi` for direct calls from the browser (e.g., posting `/appointment`).
- `VITE_BASE_URL` is injected into `runtimeConfig.public.BASE_URL` and used by the server routes under `server/api/*` when they proxy to your backend (e.g., `/api/services`).
- Both values should point to the same backend host in most setups; keep the `/api` suffix only on the client-facing base URL if your backend groups endpoints under `/api`.

## Installing dependencies
```bash
pnpm install
# or npm install / yarn install / bun install
```

## Running the app
```bash
pnpm dev
# Runs Nuxt at http://localhost:3000
```

## Building & previewing production
```bash
pnpm build   # Generate the production bundle
pnpm preview # Serve the built app locally
```

## Data flow overview
1. **Services list** – On mount, `useAppointmentForm` calls `serviceStore.fetchServices()`, which hits the server route `/api/services` → proxy to `${VITE_BASE_URL}/api/services`.
2. **Professionals per service** – When a service is selected, `useAppointmentForm` calls `serviceStore.fetchServiceProfessionals(serviceId)` to hit `/api/services/:id/health_professionals` via the same proxy.
3. **Form validation** – Zod schema in `useAppointmentForm` enforces required selections, valid datetime, and email format. Vee-Validate handles UI binding and error messages.
4. **Booking submission** – `useAppointmentForm` calls `appointmentStore.bookAppointment`, which posts to `/appointment` using `directApi` (base URL `VITE_API_BASE_URL`). On success, toasts + animated success state appear; errors show a toast and inline message.

## Extending the API usage
- To add a new backend call, create a method in a Pinia store that uses `useApi()`.
- Prefer routing through `server/api/*` when you want SSR-friendly calls or need to avoid CORS; use `directApi` for purely client-side calls that require immediate browser access.
- `HttpClient` supports `get`, `post`, `put`, and `delete`, automatically attaching a Bearer token when `getTokenFromStorage` is provided.

## Composable & store references
- **Form logic:** `app/composables/useAppointmentForm.ts`
- **Services store:** `app/stores/serviceStore.ts`
- **Appointment store:** `app/stores/appointmentStore.ts`
- **HTTP client:** `app/services/http.ts`

## Running against a different backend
- Update `.env` with your target host.
- Restart the dev server after env changes.
- If your backend endpoints differ (e.g., `/api/v1/services`), adjust the paths inside the Pinia stores or add new Nuxt server routes under `server/api/` to match.

## Minimal usage steps
1. Set up `.env` with `VITE_API_BASE_URL` and `VITE_BASE_URL`.
2. `pnpm install`
3. `pnpm dev`
4. Open `http://localhost:3000` and complete the booking form. A success toast and overlay confirm the booking; validation errors appear inline and via toasts.

## Troubleshooting
- **Empty dropdowns:** Confirm the services endpoint responds at `${VITE_BASE_URL}/api/services`.
- **CORS issues:** Use the built-in server proxies under `server/api/*` instead of direct browser calls, or enable CORS on your backend.
- **Env not applied:** Ensure you restart `pnpm dev` after editing `.env`.
