import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePaymentApprovalFlow } from '../composables/usePaymentApprovalFlow'

describe('usePaymentApprovalFlow feature flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('exposes the initialized widget state and supports refresh-style updates', async () => {
    const feature = usePaymentApprovalFlow()

    await feature.init()

    expect(feature.status.value).toBe('ready')
    expect(feature.data.value).toEqual({
      summary: 'Payment Approval Flow is ready for implementation.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })

    feature.updateData({
      summary: 'Payment Approval Flow copy has been refined.',
      highlights: ['Shows summary', 'Shows implementation highlights'],
    })

    expect(feature.data.value).toEqual({
      summary: 'Payment Approval Flow copy has been refined.',
      highlights: ['Shows summary', 'Shows implementation highlights'],
    })

    await feature.refresh()

    expect(feature.data.value).toEqual({
      summary: 'Payment Approval Flow is ready for implementation.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })
  })
})
