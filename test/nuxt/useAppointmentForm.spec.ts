/**
 * Tests for useAppointmentForm composable — step-02 safety net.
 *
 * Coverage (from docs/migration/step-01-snapshot.md §5):
 *   1. Service load on mount   → GET /api/services
 *   2. Professional load on service select → GET /api/services/:id/health_professionals
 *   3. Successful booking      → POST /appointment
 *   4. Failed booking          → error state, no success overlay
 *
 * Network boundary: every test stubs the global `fetch` so no real
 * backend is ever contacted.  All other Nuxt/Pinia/vee-validate
 * context is provided by the `nuxt` Vitest environment.
 *
 * Why $.setupState?
 * vee-validate marks the `values` ref as readonly() and Vue Test Utils
 * adds a second readonly proxy around wrapper.vm.  Direct assignment via
 * wrapper.vm.values.x = '…' therefore fails with a Vue warn.
 * Accessing the component's raw setup state via wrapper.vm.$.setupState
 * returns the unwrapped vee-validate Proxy, whose set trap internally
 * calls setFieldValue — so the watch fires correctly.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { SERVICES, PROFESSIONALS, okResponse, errorResponse } from './fixtures'

// ---------------------------------------------------------------------------
// Minimal wrapper component
// Exposes the full useAppointmentForm return value on wrapper.vm so tests
// can read reactive state and call the submit handler directly.
// ---------------------------------------------------------------------------
const FormWrapper = defineComponent({
  setup() {
    // useAppointmentForm is auto-imported by Nuxt's import system
    return useAppointmentForm()
  },
  template: '<div />',
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Retrieve the vee-validate form context from the mounted component.
 *
 * useForm() calls Vue's provide(FormContextKey, ctx) inside the component's
 * setup function.  The key is a private Symbol, so we duck-type over the
 * component's own provides to find an object that exposes setFieldValue.
 *
 * This bypasses the readonly() proxy that vee-validate and Vue Test Utils
 * layer on top of `values`, and lets us call the official mutation path.
 */
function getFormCtx(wrapper: any): any {
  const provides: Record<symbol, unknown> = (wrapper.vm as any).$.provides ?? {}
  for (const key of Object.getOwnPropertySymbols(provides)) {
    const v = provides[key] as any
    if (v && typeof v === 'object' && typeof v.setFieldValue === 'function') {
      return v
    }
  }
  return null
}

/** Set a form field value through vee-validate's own setFieldValue. */
function setField(wrapper: any, field: string, value: string) {
  const ctx = getFormCtx(wrapper)
  if (!ctx) throw new Error(`[test] Could not find vee-validate form context on wrapper`)
  ctx.setFieldValue(field, value)
}

/** Fully populate the form and wait for side-effects to settle. */
async function fillForm(wrapper: any) {
  setField(wrapper, 'service_id', '1')
  await flushPromises()
  setField(wrapper, 'health_professional_id', '10')
  setField(wrapper, 'date', '2026-05-01T10:00')
  setField(wrapper, 'customer_email', 'patient@example.com')
  await flushPromises()
}

// ---------------------------------------------------------------------------
// Suite
// ---------------------------------------------------------------------------

describe('useAppointmentForm', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  // -------------------------------------------------------------------------
  // 1. Service load on mount
  // -------------------------------------------------------------------------
  describe('service load on mount', () => {
    it('calls GET /api/services on mount and populates the services list', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(SERVICES))

      const wrapper = await mountSuspended(FormWrapper)
      await flushPromises()

      // Confirm the correct URL was requested
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('api/services'),
        expect.objectContaining({ method: 'GET' }),
      )

      // Services are exposed on the composable return value
      expect(wrapper.vm.services).toHaveLength(2)
      expect(wrapper.vm.services?.[0].name).toBe('General Consultation')
      expect(wrapper.vm.services?.[1].name).toBe('Dental Checkup')
    })
  })

  // -------------------------------------------------------------------------
  // 2. Professional load on service select
  // -------------------------------------------------------------------------
  describe('professional load on service select', () => {
    it('calls GET /api/services/:id/health_professionals when a service is selected', async () => {
      // mount → services
      mockFetch.mockResolvedValueOnce(okResponse(SERVICES))
      // service selection → professionals
      mockFetch.mockResolvedValueOnce(okResponse(PROFESSIONALS))

      const wrapper = await mountSuspended(FormWrapper)
      await flushPromises()

      // Trigger service selection via the raw vee-validate proxy
      setField(wrapper, 'service_id', '1')
      await flushPromises()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('api/services/1/health_professionals'),
        expect.objectContaining({ method: 'GET' }),
      )

      expect(wrapper.vm.professionals).toHaveLength(1)
      expect(wrapper.vm.professionals?.[0].name).toBe('Dr. Jane Smith')
    })

    it('resets professionals when the service selection changes', async () => {
      mockFetch
        .mockResolvedValueOnce(okResponse(SERVICES))      // mount
        .mockResolvedValueOnce(okResponse(PROFESSIONALS)) // service 1
        .mockResolvedValueOnce(okResponse([]))             // service 2

      const wrapper = await mountSuspended(FormWrapper)
      await flushPromises()

      setField(wrapper, 'service_id', '1')
      await flushPromises()
      expect(wrapper.vm.professionals).toHaveLength(1)

      setField(wrapper, 'service_id', '2')
      await flushPromises()
      // After selecting a different service the list is reset then re-fetched
      expect(wrapper.vm.professionals).toHaveLength(0)
    })
  })

  // -------------------------------------------------------------------------
  // 3. Successful booking
  // -------------------------------------------------------------------------
  describe('form submission — success', () => {
    it('posts to /appointment with the form payload and activates the success overlay', async () => {
      mockFetch
        .mockResolvedValueOnce(okResponse(SERVICES))      // mount
        .mockResolvedValueOnce(okResponse(PROFESSIONALS)) // service select
        .mockResolvedValueOnce(okResponse({ id: 99 }))   // POST /appointment

      const wrapper = await mountSuspended(FormWrapper)
      await flushPromises()

      await fillForm(wrapper)

      // Trigger vee-validate submit → validates then calls appointmentStore.bookAppointment
      await wrapper.vm.handleSubmit()
      await flushPromises()

      // Correct HTTP method and endpoint used for booking
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('appointment'),
        expect.objectContaining({ method: 'POST' }),
      )

      // Success overlay is shown after a successful booking
      expect(wrapper.vm.showSuccessState).toBe(true)
      expect(wrapper.vm.generalError).toBe('')
    })

    it('sends numeric service_id and health_professional_id in the POST body', async () => {
      mockFetch
        .mockResolvedValueOnce(okResponse(SERVICES))
        .mockResolvedValueOnce(okResponse(PROFESSIONALS))
        .mockResolvedValueOnce(okResponse({ id: 100 }))

      const wrapper = await mountSuspended(FormWrapper)
      await flushPromises()
      await fillForm(wrapper)
      await wrapper.vm.handleSubmit()
      await flushPromises()

      // Find the POST call and inspect its body
      const postCall = mockFetch.mock.calls.find(([, options]) => options?.method === 'POST')
      expect(postCall).toBeTruthy()
      const body = JSON.parse(postCall![1].body)
      expect(body.service_id).toBe(1)               // cast to Number in composable
      expect(body.health_professional_id).toBe(10)  // cast to Number in composable
      expect(body.customer_email).toBe('patient@example.com')
    })
  })

  // -------------------------------------------------------------------------
  // 4. Failed booking
  // -------------------------------------------------------------------------
  describe('form submission — failure', () => {
    it('sets generalError to the API message and does not show the success overlay', async () => {
      mockFetch
        .mockResolvedValueOnce(okResponse(SERVICES))
        .mockResolvedValueOnce(okResponse(PROFESSIONALS))
        .mockResolvedValueOnce(errorResponse('Slot no longer available', 422))

      const wrapper = await mountSuspended(FormWrapper)
      await flushPromises()
      await fillForm(wrapper)
      await wrapper.vm.handleSubmit()
      await flushPromises()

      expect(wrapper.vm.showSuccessState).toBe(false)
      expect(wrapper.vm.generalError).toBe('Slot no longer available')
    })

    it('falls back to a generic error message when the API response has no message field', async () => {
      mockFetch
        .mockResolvedValueOnce(okResponse(SERVICES))
        .mockResolvedValueOnce(okResponse(PROFESSIONALS))
        // Server returns an error body without a `message` field
        .mockResolvedValueOnce(
          new Response('{}', {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }),
        )

      const wrapper = await mountSuspended(FormWrapper)
      await flushPromises()
      await fillForm(wrapper)
      await wrapper.vm.handleSubmit()
      await flushPromises()

      expect(wrapper.vm.showSuccessState).toBe(false)
      expect(wrapper.vm.generalError).toBe('Failed to book appointment. Please try again.')
    })
  })
})




