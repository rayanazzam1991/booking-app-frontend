import { computed } from 'vue'
import type { PaymentContract } from '../Payment.contract'
import { usePaymentStoreInternal } from '../stores/PaymentStore'

/**
 * PAYMENT PUBLIC COMPOSABLE
 *
 * Public bridge into the Payment feature internals.
 */
export const usePayment = (): PaymentContract => {
  const store = usePaymentStoreInternal()

  return {
    status: computed(() => store.status),
    items: computed(() => store.visibleItems),
    selectedItem: computed(() => store.selectedItem),
    error: computed(() => store.error),
    filters: store.filters,
    init: store.init,
    refresh: store.refresh,
    createItem: store.createItem,
    updateItem: store.updateItem,
    removeItem: store.removeItem,
    selectItem: store.selectItem,
    setSearchTerm: store.setSearchTerm,
    clearError: store.clearError,
  }
}
