import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AnaylticsRecord } from '../Anayltics.contract'
import {
  createAnaylticsItemService,
  listAnaylticsItemsService,
  removeAnaylticsItemService,
  updateAnaylticsItemService,
} from '../services/AnaylticsService'
import { useAnaylticsStoreInternal } from '../stores/AnaylticsStore'

vi.mock('../services/AnaylticsService', () => ({
  listAnaylticsItemsService: vi.fn(),
  createAnaylticsItemService: vi.fn(),
  updateAnaylticsItemService: vi.fn(),
  removeAnaylticsItemService: vi.fn(),
}))

const listItemsMock = vi.mocked(listAnaylticsItemsService)
const createItemMock = vi.mocked(createAnaylticsItemService)
const updateItemMock = vi.mocked(updateAnaylticsItemService)
const removeItemMock = vi.mocked(removeAnaylticsItemService)

const baseItems: AnaylticsRecord[] = [
  {
    id: 'anayltics-1',
    title: 'Write tests',
    description: 'Cover create and update flows',
    status: 'active',
    createdAt: '2026-03-23T00:00:00.000Z',
    updatedAt: '2026-03-23T00:00:00.000Z',
  },
  {
    id: 'anayltics-2',
    title: 'Review copy',
    description: 'Make the summary clearer',
    status: 'draft',
    createdAt: '2026-03-22T00:00:00.000Z',
    updatedAt: '2026-03-22T00:00:00.000Z',
  },
]

describe('AnaylticsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('loads items and filters them by title or description', async () => {
    listItemsMock.mockResolvedValueOnce(baseItems)

    const store = useAnaylticsStoreInternal()

    await store.refresh()

    expect(store.status).toBe('ready')
    expect(store.items).toEqual(baseItems)
    expect(store.visibleItems).toEqual(baseItems)

    store.setSearchTerm('summary')
    expect(store.visibleItems).toEqual([baseItems[1]])

    store.setSearchTerm('CREATE')
    expect(store.visibleItems).toEqual([baseItems[0]])
  })

  it('supports create, update, select, and remove flows', async () => {
    const createdItem: AnaylticsRecord = {
      id: 'anayltics-3',
      title: 'Ship feature',
      description: 'Verify the production path',
      status: 'active',
      createdAt: '2026-03-24T00:00:00.000Z',
      updatedAt: '2026-03-24T00:00:00.000Z',
    }

    const updatedItem: AnaylticsRecord = {
      ...baseItems[0],
      title: 'Write stronger tests',
      status: 'archived',
      updatedAt: '2026-03-25T00:00:00.000Z',
    }

    createItemMock.mockResolvedValueOnce(createdItem)
    updateItemMock.mockResolvedValueOnce(updatedItem)
    removeItemMock.mockResolvedValueOnce(true)

    const store = useAnaylticsStoreInternal()
    store.items = [...baseItems]

    const created = await store.createItem({
      title: createdItem.title,
      description: createdItem.description,
      status: createdItem.status,
    })

    expect(created).toEqual(createdItem)
    expect(store.items[0]).toEqual(createdItem)

    store.selectItem(baseItems[0].id)
    expect(store.selectedItem).toEqual(baseItems[0])

    const updated = await store.updateItem(baseItems[0].id, {
      title: updatedItem.title,
      status: updatedItem.status,
    })

    expect(updated).toEqual(updatedItem)
    expect(store.items.find((item) => item.id === baseItems[0].id)).toEqual(updatedItem)

    const removed = await store.removeItem(baseItems[0].id)

    expect(removed).toBe(true)
    expect(store.items.some((item) => item.id === baseItems[0].id)).toBe(false)
    expect(store.selectedItem).toBe(null)
  })

  it('stores a friendly error when refresh fails', async () => {
    listItemsMock.mockRejectedValueOnce(new Error('Network down'))

    const store = useAnaylticsStoreInternal()

    await store.refresh()

    expect(store.status).toBe('error')
    expect(store.error).toBe('Network down')
  })
})
