/**
 * Step 4 verification — Booking logic migrated to feature module.
 *
 * These tests import the composable and component **directly from the feature
 * path** (`app/features/booking/…`) to prove that the canonical implementations
 * are in place and fully functional.
 *
 * The existing tests in `useAppointmentForm.spec.ts` and
 * `AppointmentForm.spec.ts` continue to cover the same behavior via the legacy
 * shim paths, providing a double-verification that the shims are transparent.
 *
 * Network boundary: every test stubs the global `fetch`. No real backend.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { defineComponent } from 'vue'
import {
  useAppointmentForm,
  useServiceStore,
  useAppointmentStore,
  AppointmentForm,
} from '../../../app/features/booking'
import { SERVICES, PROFESSIONALS, okResponse, errorResponse } from '../fixtures'

// ---------------------------------------------------------------------------
// Public-API shape
// ---------------------------------------------------------------------------

describe('booking feature public API', () => {
  it('exports useServiceStore as a function', () => {
    expect(typeof useServiceStore).toBe('function')
  })

  it('exports useAppointmentStore as a function', () => {
    expect(typeof useAppointmentStore).toBe('function')
  })

  it('exports useAppointmentForm as a function', () => {
    expect(typeof useAppointmentForm).toBe('function')
  })

  it('exports AppointmentForm as a component object', () => {
    expect(AppointmentForm).toBeDefined()
    // Vue 3 compiled components expose a __name or __file, or at minimum are an object
    expect(typeof AppointmentForm).toBe('object')
  })
})

// ---------------------------------------------------------------------------
// Composable — imported directly from the feature path
// ---------------------------------------------------------------------------

const FeatureFormWrapper = defineComponent({
  setup() {
    return useAppointmentForm()
  },
  template: '<div />',
})

/** Reach the vee-validate form context from within a mounted component. */
function getFormCtx(wrapper: any): any {
  const provides: Record<symbol, unknown> = (wrapper.vm as any).$.provides ?? {}
  for (const key of Object.getOwnPropertySymbols(provides)) {
    const v = provides[key] as any
    if (v && typeof v === 'object' && typeof v.setFieldValue === 'function') return v
  }
  return null
}

function setField(wrapper: any, field: string, value: string) {
  const ctx = getFormCtx(wrapper)
  if (!ctx) throw new Error(`[test] Could not find vee-validate form context on wrapper`)
  ctx.setFieldValue(field, value)
}

describe('useAppointmentForm — imported from feature path', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('populates services on mount via GET /api/services', async () => {
    mockFetch.mockResolvedValueOnce(okResponse(SERVICES))

    const wrapper = await mountSuspended(FeatureFormWrapper)
    await flushPromises()

    expect(wrapper.vm.services).toHaveLength(2)
    expect(wrapper.vm.services?.[0].name).toBe('General Consultation')
  })

  it('fetches professionals when a service is selected', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse(SERVICES))
      .mockResolvedValueOnce(okResponse(PROFESSIONALS))

    const wrapper = await mountSuspended(FeatureFormWrapper)
    await flushPromises()

    setField(wrapper, 'service_id', '1')
    await flushPromises()

    expect(wrapper.vm.professionals).toHaveLength(1)
    expect(wrapper.vm.professionals?.[0].name).toBe('Dr. Jane Smith')
  })

  it('sets generalError and does NOT show success overlay on a failed POST', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse(SERVICES))
      .mockResolvedValueOnce(okResponse(PROFESSIONALS))
      .mockResolvedValueOnce(errorResponse('Booking failed — slot taken', 422))

    const wrapper = await mountSuspended(FeatureFormWrapper)
    await flushPromises()

    setField(wrapper, 'service_id', '1')
    await flushPromises()
    setField(wrapper, 'health_professional_id', '10')
    setField(wrapper, 'date', '2026-05-01T10:00')
    setField(wrapper, 'customer_email', 'patient@example.com')
    await flushPromises()

    await wrapper.vm.handleSubmit()
    await flushPromises()

    expect(wrapper.vm.showSuccessState).toBe(false)
    expect(wrapper.vm.generalError).toBe('Booking failed — slot taken')
  })
})

// ---------------------------------------------------------------------------
// Component — imported directly from the feature path
// ---------------------------------------------------------------------------

describe('AppointmentForm component — imported from feature path', () => {
  let mockFetch: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockFetch = vi.fn()
    vi.stubGlobal('fetch', mockFetch)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders the "Book Your Appointment" heading', async () => {
    mockFetch.mockResolvedValueOnce(okResponse(SERVICES))

    const wrapper = await mountSuspended(AppointmentForm)
    await flushPromises()

    expect(wrapper.text()).toContain('Book Your Appointment')
  })

  it('renders service names in the dropdown', async () => {
    mockFetch.mockResolvedValueOnce(okResponse(SERVICES))

    const wrapper = await mountSuspended(AppointmentForm)
    await flushPromises()

    expect(wrapper.text()).toContain('General Consultation')
    expect(wrapper.text()).toContain('Dental Checkup')
  })

  it('reveals progressive fields after professionals load', async () => {
    mockFetch
      .mockResolvedValueOnce(okResponse(SERVICES))
      .mockResolvedValueOnce(okResponse(PROFESSIONALS))

    const wrapper = await mountSuspended(AppointmentForm)
    await flushPromises()

    // Grab the vee-validate context from the component's provides
    const provides: Record<symbol, unknown> = (wrapper.vm as any).$.provides ?? {}
    for (const key of Object.getOwnPropertySymbols(provides)) {
      const v = provides[key] as any
      if (v && typeof v === 'object' && typeof v.setFieldValue === 'function') {
        v.setFieldValue('service_id', '1')
        break
      }
    }
    await flushPromises()

    expect(wrapper.text()).toContain('Health Professional')
    expect(wrapper.text()).toContain('Book Appointment Now')
  })
})

// ---------------------------------------------------------------------------
// Legacy shim paths still resolve (adapter smoke-check)
// ---------------------------------------------------------------------------

describe('legacy shim paths still resolve', () => {
  it('app/composables/useAppointmentForm re-exports the feature composable', async () => {
    const mod = await import('../../../app/composables/useAppointmentForm')
    expect(typeof mod.useAppointmentForm).toBe('function')
  })

  it('app/stores/serviceStore re-exports useServiceStore', async () => {
    const mod = await import('../../../app/stores/serviceStore')
    expect(typeof mod.useServiceStore).toBe('function')
  })

  it('app/stores/appointmentStore re-exports useAppointmentStore', async () => {
    const mod = await import('../../../app/stores/appointmentStore')
    expect(typeof mod.useAppointmentStore).toBe('function')
  })
})

