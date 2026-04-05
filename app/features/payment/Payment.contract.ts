import type { ComputedRef, Ref } from 'vue'

export type PaymentLifecycle = 'idle' | 'loading' | 'ready' | 'error'
export type PaymentItemStatus = 'draft' | 'active' | 'archived'

export interface PaymentRecord {
  id: string
  title: string
  description: string
  status: PaymentItemStatus
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentInput {
  title: string
  description?: string
  status?: PaymentItemStatus
}

export interface UpdatePaymentInput {
  title?: string
  description?: string
  status?: PaymentItemStatus
}

export interface PaymentFilters {
  searchTerm: string
}

/**
 * PAYMENT CONTRACT
 *
 * Public API for the Payment feature.
 * Other features should import this contract through the feature index only.
 */
export interface PaymentContract {
  status: ComputedRef<PaymentLifecycle>
  items: ComputedRef<PaymentRecord[]>
  selectedItem: ComputedRef<PaymentRecord | null>
  error: ComputedRef<string | null>
  filters: Readonly<Ref<PaymentFilters>>
  init(): Promise<void>
  refresh(): Promise<void>
  createItem(payload: CreatePaymentInput): Promise<PaymentRecord | null>
  updateItem(id: string, payload: UpdatePaymentInput): Promise<PaymentRecord | null>
  removeItem(id: string): Promise<boolean>
  selectItem(id: string | null): void
  setSearchTerm(value: string): void
  clearError(): void
}
