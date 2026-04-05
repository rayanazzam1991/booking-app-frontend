import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { usePaymentStatusTracking } from '../composables/usePaymentStatusTracking'

describe('usePaymentStatusTracking feature flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('exposes the initialized widget state and supports refresh-style updates', async () => {
    const feature = usePaymentStatusTracking()

    await feature.init()

    expect(feature.status.value).toBe('ready')
    expect(feature.data.value).toEqual({
      summary: 'Payment Status Tracking is ready for implementation.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })

    feature.updateData({
      summary: 'Payment Status Tracking copy has been refined.',
      highlights: ['Shows summary', 'Shows implementation highlights'],
    })

    expect(feature.data.value).toEqual({
      summary: 'Payment Status Tracking copy has been refined.',
      highlights: ['Shows summary', 'Shows implementation highlights'],
    })

    await feature.refresh()

    expect(feature.data.value).toEqual({
      summary: 'Payment Status Tracking is ready for implementation.',
      highlights: [
        'Public composable scaffolded',
        'Private store scaffolded',
        'Widget scaffolded',
      ],
    })
  })
})
