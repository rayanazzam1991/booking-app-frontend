import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PaymentApprovalFlowState } from '../PaymentApprovalFlow.contract'

/**
 * PAYMENT APPROVAL FLOW INTERNAL STORE
 *
 * Private store for the Payment Approval Flow subfeature.
 */
export const usePaymentApprovalFlowStoreInternal = defineStore('PaymentApprovalFlowInternal', () => {
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const data = ref<PaymentApprovalFlowState | null>(null)
  const error = ref<string | null>(null)

  const clearError = () => {
    error.value = null
  }

  const refresh = async () => {
    status.value = 'loading'
    clearError()

    try {
      data.value = {
        summary: 'Payment Approval Flow is ready for implementation.',
        highlights: [
          'Public composable scaffolded',
          'Private store scaffolded',
          'Widget scaffolded',
        ],
      }
      status.value = 'ready'
    } catch (caughtError) {
      status.value = 'error'
      error.value = caughtError instanceof Error ? caughtError.message : 'Failed to initialize Payment Approval Flow.'
    }
  }

  const init = async () => {
    await refresh()
  }

  const updateData = (payload: Partial<PaymentApprovalFlowState>) => {
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
