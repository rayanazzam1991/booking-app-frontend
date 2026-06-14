import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { AnaylticsRecord } from '../Anayltics.contract'
import { useAnayltics } from '../composables/useAnayltics'
import {
  createAnaylticsItemService,
  listAnaylticsItemsService,
  removeAnaylticsItemService,
  updateAnaylticsItemService,
} from '../services/AnaylticsService'

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

const seededItems: AnaylticsRecord[] = [
  {
    id: 'anayltics-1',
    title: 'Write tests',
    description: 'Cover create and search',
    status: 'active',
    createdAt: '2026-03-23T00:00:00.000Z',
    updatedAt: '2026-03-23T00:00:00.000Z',
  },
  {
    id: 'anayltics-2',
    title: 'Review copy',
    description: 'Improve empty state messaging',
    status: 'draft',
    createdAt: '2026-03-22T00:00:00.000Z',
    updatedAt: '2026-03-22T00:00:00.000Z',
  },
]

describe('useAnayltics feature flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('supports the core workflow through the public composable', async () => {
    const createdItem: AnaylticsRecord = {
      id: 'anayltics-3',
      title: 'Ship feature',
      description: 'Verify create, edit, and delete flows',
      status: 'active',
      createdAt: '2026-03-24T00:00:00.000Z',
      updatedAt: '2026-03-24T00:00:00.000Z',
    }
    const updatedItem: AnaylticsRecord = {
      ...seededItems[0],
      title: 'Write stronger tests',
      description: 'Cover create, edit, search, and delete',
      status: 'archived',
      updatedAt: '2026-03-25T00:00:00.000Z',
    }

    listItemsMock.mockResolvedValueOnce(seededItems)
    createItemMock.mockResolvedValueOnce(createdItem)
    updateItemMock.mockResolvedValueOnce(updatedItem)
    removeItemMock.mockResolvedValueOnce(true)

    const feature = useAnayltics()

    await feature.init()

    expect(feature.status.value).toBe('ready')
    expect(feature.items.value).toEqual(seededItems)

    feature.setSearchTerm('empty state')
    expect(feature.items.value).toEqual([seededItems[1]])

    feature.setSearchTerm('')
    const created = await feature.createItem({
      title: createdItem.title,
      description: createdItem.description,
      status: createdItem.status,
    })
    expect(created).toEqual(createdItem)
    expect(feature.items.value[0]).toEqual(createdItem)

    feature.selectItem(seededItems[0].id)
    expect(feature.selectedItem.value).toEqual(seededItems[0])

    const updated = await feature.updateItem(seededItems[0].id, {
      title: updatedItem.title,
      description: updatedItem.description,
      status: updatedItem.status,
    })
    expect(updated).toEqual(updatedItem)
    expect(feature.selectedItem.value).toEqual(updatedItem)

    const removed = await feature.removeItem(seededItems[0].id)
    expect(removed).toBe(true)
    expect(feature.items.value.some((item) => item.id === seededItems[0].id)).toBe(false)
    expect(feature.selectedItem.value).toBe(null)
  })
})
