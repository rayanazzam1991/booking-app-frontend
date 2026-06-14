import { computed } from 'vue'
import type { PaymentSubmissionContract } from '../PaymentSubmission.contract'
import { usePaymentSubmissionStoreInternal } from '../stores/PaymentSubmissionStore'

/**
 * PAYMENT SUBMISSION PUBLIC COMPOSABLE
 */
export const usePaymentSubmission = (): PaymentSubmissionContract => {
  const store = usePaymentSubmissionStoreInternal()

  return {
    status: computed(() => store.status),
    data: computed(() => store.data),
    error: computed(() => store.error),
    init: store.init,
    refresh: store.refresh,
    updateData: store.updateData,
    clearError: store.clearError,
  }
}
