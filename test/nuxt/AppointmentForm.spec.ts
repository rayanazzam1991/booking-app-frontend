/**
 * Tests for the AppointmentForm component — step-02 safety net.
 *
 * Coverage (from docs/migration/step-01-snapshot.md §5):
 *   5. ApointmentForm component:
 *      a. Renders the service dropdown on initial load.
 *      b. Shows a loading spinner while professionals are being fetched.
 *      c. Reveals the professional, date, email fields and the submit button
 *         once professionals have loaded (progressive field reveal).
 *
 * Network boundary: fetch is stubbed globally per test.
 * No real backend is contacted.
 *
 * Why $.setupState?
 * Same readonly-proxy issue as in the composable tests.  The component's
 * internal vee-validate `values` Proxy is reached via
 * wrapper.vm.$.setupState.values to bypass Vue Test Utils' readonly layer.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import AppointmentForm from '~/components/ApointmentForm.vue'
import { SERVICES, PROFESSIONALS, okResponse } from './fixtures'

/** Set a field through vee-validate's own setFieldValue found in the component's provides. */
function setField(wrapper: any, field: string, value: string) {
  const provides: Record<symbol, unknown> = (wrapper.vm as any).$.provides ?? {}
  for (const key of Object.getOwnPropertySymbols(provides)) {
    const v = provides[key] as any
    if (v && typeof v === 'object' && typeof v.setFieldValue === 'function') {
      v.setFieldValue(field, value)
      return
    }
  }
  throw new Error(`[test] Could not find vee-validate form context on wrapper`)
}

describe('AppointmentForm component', () => {
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
  // 5a. Initial render — heading and service dropdown are always visible
  // -------------------------------------------------------------------------
  describe('initial render', () => {
    it('renders the page heading', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(SERVICES))

      const wrapper = await mountSuspended(AppointmentForm)
      await flushPromises()

      expect(wrapper.text()).toContain('Book Your Appointment')
    })

    it('renders the "Service Type" form label', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(SERVICES))

      const wrapper = await mountSuspended(AppointmentForm)
      await flushPromises()

      expect(wrapper.text()).toContain('Service Type')
    })

    it('renders service names inside the dropdown after loading', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(SERVICES))

      const wrapper = await mountSuspended(AppointmentForm)
      await flushPromises()

      expect(wrapper.text()).toContain('General Consultation')
      expect(wrapper.text()).toContain('Dental Checkup')
    })
  })

  // -------------------------------------------------------------------------
  // 5b. Loading state — spinner while professionals are being fetched
  // -------------------------------------------------------------------------
  describe('loading state', () => {
    it('shows the loading spinner after a service is selected but before professionals arrive', async () => {
      mockFetch
        .mockResolvedValueOnce(okResponse(SERVICES))
        // Professionals never resolve — simulates in-flight request
        .mockImplementationOnce(() => new Promise(() => {}))

      const wrapper = await mountSuspended(AppointmentForm)
      await flushPromises()

      // Select service via the raw vee-validate proxy
      setField(wrapper, 'service_id', '1')
      await flushPromises()

      expect(wrapper.text()).toContain('Loading available professionals')
    })
  })

  // -------------------------------------------------------------------------
  // 5c. Progressive field reveal
  // -------------------------------------------------------------------------
  describe('progressive field reveal', () => {
    it('shows the Health Professional, Date, Email fields and submit button after professionals load', async () => {
      mockFetch
        .mockResolvedValueOnce(okResponse(SERVICES))
        .mockResolvedValueOnce(okResponse(PROFESSIONALS))

      const wrapper = await mountSuspended(AppointmentForm)
      await flushPromises()

      setField(wrapper, 'service_id', '1')
      await flushPromises()

      expect(wrapper.text()).toContain('Health Professional')
      expect(wrapper.text()).toContain('Preferred Date & Time')
      expect(wrapper.text()).toContain('Email Address')
      expect(wrapper.text()).toContain('Book Appointment Now')
    })

    it('does NOT render the progressive fields before a service is selected', async () => {
      mockFetch.mockResolvedValueOnce(okResponse(SERVICES))

      const wrapper = await mountSuspended(AppointmentForm)
      await flushPromises()

      // No service selected — conditional fields must be absent
      expect(wrapper.text()).not.toContain('Health Professional')
      expect(wrapper.text()).not.toContain('Book Appointment Now')
    })
  })
})



