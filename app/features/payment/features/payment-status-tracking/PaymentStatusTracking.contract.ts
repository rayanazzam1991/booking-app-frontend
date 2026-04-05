import type { ComputedRef, Ref } from 'vue'

export type PaymentStatusTrackingLifecycle = 'idle' | 'loading' | 'ready' | 'error'

export interface PaymentStatusTrackingState {
  summary: string
  highlights: string[]
}

/**
 * PAYMENT STATUS TRACKING CONTRACT
 *
 * Public API for the Payment Status Tracking subfeature.
 */
export interface PaymentStatusTrackingContract {
  status: ComputedRef<PaymentStatusTrackingLifecycle>
  data: Readonly<Ref<PaymentStatusTrackingState | null>>
  error: ComputedRef<string | null>
  init(): Promise<void>
  refresh(): Promise<void>
  updateData(payload: Partial<PaymentStatusTrackingState>): void
  clearError(): void
}
