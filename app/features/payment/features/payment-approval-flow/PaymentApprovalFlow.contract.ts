import type { ComputedRef, Ref } from 'vue'

export type PaymentApprovalFlowLifecycle = 'idle' | 'loading' | 'ready' | 'error'

export interface PaymentApprovalFlowState {
  summary: string
  highlights: string[]
}

/**
 * PAYMENT APPROVAL FLOW CONTRACT
 *
 * Public API for the Payment Approval Flow subfeature.
 */
export interface PaymentApprovalFlowContract {
  status: ComputedRef<PaymentApprovalFlowLifecycle>
  data: Readonly<Ref<PaymentApprovalFlowState | null>>
  error: ComputedRef<string | null>
  init(): Promise<void>
  refresh(): Promise<void>
  updateData(payload: Partial<PaymentApprovalFlowState>): void
  clearError(): void
}
