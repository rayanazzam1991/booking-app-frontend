import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePaymentSubmissionStoreInternal } from '../stores/PaymentSubmissionStore'

describe('PaymentSubmissionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes widget content and supports partial updates', async () => {
    const store = usePaymentSubmissionStoreInternal()

    await store.init()

    expect(store.status).toBe('ready')
    expect(store.data).toEqual({
      summary: 'Payment Submission is ready for implementation.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })

    store.updateData({
      summary: 'Payment Submission is wired up.',
    })

    expect(store.data).toEqual({
      summary: 'Payment Submission is wired up.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })
  })

  it('clears stale errors', () => {
    const store = usePaymentSubmissionStoreInternal()

    store.error = 'Something went wrong'
    store.clearError()

    expect(store.error).toBe(null)
  })
})
