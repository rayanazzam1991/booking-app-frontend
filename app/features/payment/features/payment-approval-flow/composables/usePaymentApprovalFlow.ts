import { computed } from 'vue'
import type { PaymentApprovalFlowContract } from '../PaymentApprovalFlow.contract'
import { usePaymentApprovalFlowStoreInternal } from '../stores/PaymentApprovalFlowStore'

/**
 * PAYMENT APPROVAL FLOW PUBLIC COMPOSABLE
 */
export const usePaymentApprovalFlow = (): PaymentApprovalFlowContract => {
  const store = usePaymentApprovalFlowStoreInternal()

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
