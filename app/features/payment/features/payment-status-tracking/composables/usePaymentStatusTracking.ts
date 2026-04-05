import { computed } from 'vue'
import type { PaymentStatusTrackingContract } from '../PaymentStatusTracking.contract'
import { usePaymentStatusTrackingStoreInternal } from '../stores/PaymentStatusTrackingStore'

/**
 * PAYMENT STATUS TRACKING PUBLIC COMPOSABLE
 */
export const usePaymentStatusTracking = (): PaymentStatusTrackingContract => {
  const store = usePaymentStatusTrackingStoreInternal()

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
