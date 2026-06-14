import { useApi } from '~/composables/useApi'
import type { CreateAnaylticsInput, AnaylticsRecord, UpdateAnaylticsInput } from '../Anayltics.contract'

type ListAnaylticsResponse = {
  items: AnaylticsRecord[]
  error?: string
}

type MutateAnaylticsResponse = {
  success: boolean
  item: AnaylticsRecord | null
  error?: string
}

const API_PATH = '/api/anayltics'

export async function listAnaylticsItemsService(): Promise<AnaylticsRecord[]> {
  const { api } = useApi()
  const response = await api.get<ListAnaylticsResponse>(API_PATH)
  return response.items ?? []
}

export async function createAnaylticsItemService(payload: CreateAnaylticsInput): Promise<AnaylticsRecord | null> {
  const { api } = useApi()
  const response = await api.post<MutateAnaylticsResponse>(API_PATH, payload)
  return response.item
}

export async function updateAnaylticsItemService(id: string, payload: UpdateAnaylticsInput): Promise<AnaylticsRecord | null> {
  const { api } = useApi()
  const response = await api.put<MutateAnaylticsResponse>(`${API_PATH}/${id}`, payload)
  return response.item
}

export async function removeAnaylticsItemService(id: string): Promise<boolean> {
  const { api } = useApi()
  const response = await api.delete<{ success: boolean }>(`${API_PATH}/${id}`)
  return Boolean(response.success)
}
