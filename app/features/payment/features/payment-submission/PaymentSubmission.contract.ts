import type { ComputedRef, Ref } from 'vue'

export type PaymentSubmissionLifecycle = 'idle' | 'loading' | 'ready' | 'error'

export interface PaymentSubmissionState {
  summary: string
  highlights: string[]
}

/**
 * PAYMENT SUBMISSION CONTRACT
 *
 * Public API for the Payment Submission subfeature.
 */
export interface PaymentSubmissionContract {
  status: ComputedRef<PaymentSubmissionLifecycle>
  data: Readonly<Ref<PaymentSubmissionState | null>>
  error: ComputedRef<string | null>
  init(): Promise<void>
  refresh(): Promise<void>
  updateData(payload: Partial<PaymentSubmissionState>): void
  clearError(): void
}
