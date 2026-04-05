import { computed } from 'vue'
import type { AnaylticsContract } from '../Anayltics.contract'
import { useAnaylticsStoreInternal } from '../stores/AnaylticsStore'

/**
 * ANAYLTICS PUBLIC COMPOSABLE
 *
 * Public bridge into the Anayltics feature internals.
 */
export const useAnayltics = (): AnaylticsContract => {
  const store = useAnaylticsStoreInternal()

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
