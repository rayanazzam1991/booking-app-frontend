import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaymentSubmissionState } from '../PaymentSubmission.contract'

/**
 * PAYMENT SUBMISSION INTERNAL STORE
 *
 * Private store for the Payment Submission subfeature.
 */
export const usePaymentSubmissionStoreInternal = defineStore('PaymentSubmissionInternal', () => {
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const data = ref<PaymentSubmissionState | null>(null)
  const error = ref<string | null>(null)

  const clearError = () => {
    error.value = null
  }

  const refresh = async () => {
    status.value = 'loading'
    clearError()

    try {
      data.value = {
        summary: 'Payment Submission is ready for implementation.',
        highlights: [
          'Public composable scaffolded',
          'Private store scaffolded',
          'Widget scaffolded',
        ],
      }
      status.value = 'ready'
    } catch (caughtError) {
      status.value = 'error'
      error.value = caughtError instanceof Error ? caughtError.message : 'Failed to initialize Payment Submission.'
    }
  }

  const init = async () => {
    await refresh()
  }

  const updateData = (payload: Partial<PaymentSubmissionState>) => {
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
