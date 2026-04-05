import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { CreatePaymentInput, PaymentFilters, PaymentItemStatus, PaymentRecord, UpdatePaymentInput } from '../Payment.contract'
import {
  createPaymentItemService,
  listPaymentItemsService,
  removePaymentItemService,
  updatePaymentItemService,
} from '../services/PaymentService'

/**
 * PAYMENT INTERNAL STORE
 *
 * This store stays internal to the feature. Consume it through the public composable.
 */
export const usePaymentStoreInternal = defineStore('PaymentInternal', () => {
  const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
  const items = ref<PaymentRecord[]>([])
  const selectedId = ref<string | null>(null)
  const error = ref<string | null>(null)
  const filters = ref<PaymentFilters>({
    searchTerm: '',
  })

  const visibleItems = computed(() => {
    const searchTerm = filters.value.searchTerm.trim().toLowerCase()

    if (!searchTerm) {
      return items.value
    }

    return items.value.filter((item) =>
      item.title.toLowerCase().includes(searchTerm)
      || item.description.toLowerCase().includes(searchTerm),
    )
  })

  const selectedItem = computed(() => items.value.find((item) => item.id === selectedId.value) ?? null)

  const clearError = () => {
    error.value = null
  }

  const setSearchTerm = (value: string) => {
    filters.value.searchTerm = value
  }

  const selectItem = (id: string | null) => {
    selectedId.value = id
  }

  const refresh = async () => {
    status.value = 'loading'
    clearError()

    try {
      items.value = await listPaymentItemsService()
      status.value = 'ready'
    } catch (caughtError) {
      status.value = 'error'
      error.value = caughtError instanceof Error ? caughtError.message : 'Failed to load Payment.'
    }
  }

  const init = async () => {
    await refresh()
  }

  const createItem = async (payload: CreatePaymentInput) => {
    status.value = 'loading'
    clearError()

    try {
      const created = await createPaymentItemService(payload)
      if (created) {
        items.value = [created, ...items.value]
      }
      status.value = 'ready'
      return created
    } catch (caughtError) {
      status.value = 'error'
      error.value = caughtError instanceof Error ? caughtError.message : 'Failed to create Payment.'
      return null
    }
  }

  const updateItem = async (id: string, payload: UpdatePaymentInput) => {
    status.value = 'loading'
    clearError()

    try {
      const updated = await updatePaymentItemService(id, payload)
      if (updated) {
        items.value = items.value.map((item) => item.id === id ? updated : item)
      }
      status.value = 'ready'
      return updated
    } catch (caughtError) {
      status.value = 'error'
      error.value = caughtError instanceof Error ? caughtError.message : 'Failed to update Payment.'
      return null
    }
  }

  const removeItem = async (id: string) => {
    status.value = 'loading'
    clearError()

    try {
      const removed = await removePaymentItemService(id)
      if (removed) {
        items.value = items.value.filter((item) => item.id !== id)
        if (selectedId.value === id) {
          selectedId.value = null
        }
      }
      status.value = 'ready'
      return removed
    } catch (caughtError) {
      status.value = 'error'
      error.value = caughtError instanceof Error ? caughtError.message : 'Failed to remove Payment.'
      return false
    }
  }

  const seedDraft = (): CreatePaymentInput => ({
    title: '',
    description: '',
    status: 'active' as PaymentItemStatus,
  })

  return {
    status,
    items,
    selectedId,
    selectedItem,
    visibleItems,
    error,
    filters,
    init,
    refresh,
    createItem,
    updateItem,
    removeItem,
    selectItem,
    setSearchTerm,
    clearError,
    seedDraft,
  }
})
