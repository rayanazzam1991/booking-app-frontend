import { useApi } from '~/composables/useApi'
import type { CreatePaymentInput, PaymentRecord, UpdatePaymentInput } from '../Payment.contract'

type ListPaymentResponse = {
  items: PaymentRecord[]
  error?: string
}

type MutatePaymentResponse = {
  success: boolean
  item: PaymentRecord | null
  error?: string
}

const API_PATH = '/api/payment'

export async function listPaymentItemsService(): Promise<PaymentRecord[]> {
  const { api } = useApi()
  const response = await api.get<ListPaymentResponse>(API_PATH)
  return response.items ?? []
}

export async function createPaymentItemService(payload: CreatePaymentInput): Promise<PaymentRecord | null> {
  const { api } = useApi()
  const response = await api.post<MutatePaymentResponse>(API_PATH, payload)
  return response.item
}

export async function updatePaymentItemService(id: string, payload: UpdatePaymentInput): Promise<PaymentRecord | null> {
  const { api } = useApi()
  const response = await api.put<MutatePaymentResponse>(`${API_PATH}/${id}`, payload)
  return response.item
}

export async function removePaymentItemService(id: string): Promise<boolean> {
  const { api } = useApi()
  const response = await api.delete<{ success: boolean }>(`${API_PATH}/${id}`)
  return Boolean(response.success)
}
