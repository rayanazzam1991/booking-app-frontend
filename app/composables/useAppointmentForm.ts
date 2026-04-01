/**
 * Re-export shim — useAppointmentForm
 *
 * The canonical implementation now lives at:
 *   app/features/booking/composables/useAppointmentForm.ts
 *
 * This shim keeps the legacy import path alive so that:
 *  - Nuxt auto-imports still resolve `useAppointmentForm` from app/composables/
 *  - Any direct `import { useAppointmentForm } from '~/composables/useAppointmentForm'`
 *    continues to work without changes
 *
 * Remove this file only after the component has been updated to import from
 * the feature path and the page no longer relies on the auto-import shim.
 */
export { useAppointmentForm } from '../features/booking/composables/useAppointmentForm'
