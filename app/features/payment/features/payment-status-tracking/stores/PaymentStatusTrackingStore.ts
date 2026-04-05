import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaymentStatusTrackingState } from '../PaymentStatusTracking.contract'

/**
 * PAYMENT STATUS TRACKING INTERNAL STORE
 *
 * Private store for the Payment Status Tracking subfeature.
 */
export const usePaymentStatusTrackingStoreInternal = defineStore('PaymentStatusTrackingInternal', () => {
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const data = ref<PaymentStatusTrackingState | null>(null)
  const error = ref<string | null>(null)

  const clearError = () => {
    error.value = null
  }

  const refresh = async () => {
    status.value = 'loading'
    clearError()

    try {
      data.value = {
        summary: 'Payment Status Tracking is ready for implementation.',
        highlights: [
          'Public composable scaffolded',
          'Private store scaffolded',
          'Widget scaffolded',
        ],
      }
      status.value = 'ready'
    } catch (caughtError) {
      status.value = 'error'
      error.value = caughtError instanceof Error ? caughtError.message : 'Failed to initialize Payment Status Tracking.'
    }
  }

  const init = async () => {
    await refresh()
  }

  const updateData = (payload: Partial<PaymentStatusTrackingState>) => {
    data.value = {
      summary: payload.summary ?? data.value?.summary ?? '',
      highlights: payload.highlights ?? data.value?.highlights ?? [],
    }
  }

  return {
    status,
    data,
    error,
    init,
    refresh,
    updateData,
    clearError,
  }
})
