/**
 * Re-export shim — appointmentStore
 *
 * The canonical implementation now lives at:
 *   app/features/booking/stores/appointmentStore.ts
 *
 * This shim keeps the legacy import path alive so that:
 *  - @pinia/nuxt auto-imports still resolve `useAppointmentStore`
 *  - Any direct import from '~/stores/appointmentStore' continues to work
 *
 * Remove this file only after all direct callers are updated.
 */
export { useAppointmentStore } from '../features/booking/stores/appointmentStore'
