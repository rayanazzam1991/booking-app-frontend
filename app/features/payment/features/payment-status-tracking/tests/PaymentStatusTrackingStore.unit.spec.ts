import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePaymentStatusTrackingStoreInternal } from '../stores/PaymentStatusTrackingStore'

describe('PaymentStatusTrackingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes widget content and supports partial updates', async () => {
    const store = usePaymentStatusTrackingStoreInternal()

    await store.init()

    expect(store.status).toBe('ready')
    expect(store.data).toEqual({
      summary: 'Payment Status Tracking is ready for implementation.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })

    store.updateData({
      summary: 'Payment Status Tracking is wired up.',
    })

    expect(store.data).toEqual({
      summary: 'Payment Status Tracking is wired up.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })
  })

  it('clears stale errors', () => {
    const store = usePaymentStatusTrackingStoreInternal()

    store.error = 'Something went wrong'
    store.clearError()

    expect(store.error).toBe(null)
  })
})
