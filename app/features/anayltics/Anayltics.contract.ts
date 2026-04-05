import type { ComputedRef, Ref } from 'vue'

export type AnaylticsLifecycle = 'idle' | 'loading' | 'ready' | 'error'
export type AnaylticsItemStatus = 'draft' | 'active' | 'archived'

export interface AnaylticsRecord {
  id: string
  title: string
  description: string
  status: AnaylticsItemStatus
  createdAt: string
  updatedAt: string
}

export interface CreateAnaylticsInput {
  title: string
  description?: string
  status?: AnaylticsItemStatus
}

export interface UpdateAnaylticsInput {
  title?: string
  description?: string
  status?: AnaylticsItemStatus
}

export interface AnaylticsFilters {
  searchTerm: string
}

/**
 * ANAYLTICS CONTRACT
 *
 * Public API for the Anayltics feature.
 * Other features should import this contract through the feature index only.
 */
export interface AnaylticsContract {
  status: ComputedRef<AnaylticsLifecycle>
  items: ComputedRef<AnaylticsRecord[]>
  selectedItem: ComputedRef<AnaylticsRecord | null>
  error: ComputedRef<string | null>
  filters: Readonly<Ref<AnaylticsFilters>>
  init(): Promise<void>
  refresh(): Promise<void>
  createItem(payload: CreateAnaylticsInput): Promise<AnaylticsRecord | null>
  updateItem(id: string, payload: UpdateAnaylticsInput): Promise<AnaylticsRecord | null>
  removeItem(id: string): Promise<boolean>
  selectItem(id: string | null): void
  setSearchTerm(value: string): void
  clearError(): void
}
