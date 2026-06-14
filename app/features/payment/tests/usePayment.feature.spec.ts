import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { PaymentRecord } from '../Payment.contract'
import { usePayment } from '../composables/usePayment'
import {
  createPaymentItemService,
  listPaymentItemsService,
  removePaymentItemService,
  updatePaymentItemService,
} from '../services/PaymentService'

vi.mock('../services/PaymentService', () => ({
  listPaymentItemsService: vi.fn(),
  createPaymentItemService: vi.fn(),
  updatePaymentItemService: vi.fn(),
  removePaymentItemService: vi.fn(),
}))

const listItemsMock = vi.mocked(listPaymentItemsService)
const createItemMock = vi.mocked(createPaymentItemService)
const updateItemMock = vi.mocked(updatePaymentItemService)
const removeItemMock = vi.mocked(removePaymentItemService)

const seededItems: PaymentRecord[] = [
  {
    id: 'payment-1',
    title: 'Write tests',
    description: 'Cover create and search',
    status: 'active',
    createdAt: '2026-03-23T00:00:00.000Z',
    updatedAt: '2026-03-23T00:00:00.000Z',
  },
  {
    id: 'payment-2',
    title: 'Review copy',
    description: 'Improve empty state messaging',
    status: 'draft',
    createdAt: '2026-03-22T00:00:00.000Z',
    updatedAt: '2026-03-22T00:00:00.000Z',
  },
]

describe('usePayment feature flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('supports the core workflow through the public composable', async () => {
    const createdItem: PaymentRecord = {
      id: 'payment-3',
      title: 'Ship feature',
      description: 'Verify create, edit, and delete flows',
      status: 'active',
      createdAt: '2026-03-24T00:00:00.000Z',
      updatedAt: '2026-03-24T00:00:00.000Z',
    }
    const updatedItem: PaymentRecord = {
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

    const feature = usePayment()

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
