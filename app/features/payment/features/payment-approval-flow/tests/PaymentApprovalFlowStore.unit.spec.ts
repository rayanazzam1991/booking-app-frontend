import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePaymentApprovalFlowStoreInternal } from '../stores/PaymentApprovalFlowStore'

describe('PaymentApprovalFlowStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes widget content and supports partial updates', async () => {
    const store = usePaymentApprovalFlowStoreInternal()

    await store.init()

    expect(store.status).toBe('ready')
    expect(store.data).toEqual({
      summary: 'Payment Approval Flow is ready for implementation.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })

    store.updateData({
      summary: 'Payment Approval Flow is wired up.',
    })

    expect(store.data).toEqual({
      summary: 'Payment Approval Flow is wired up.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })
  })

  it('clears stale errors', () => {
    const store = usePaymentApprovalFlowStoreInternal()

    store.error = 'Something went wrong'
    store.clearError()

    expect(store.error).toBe(null)
  })
})
