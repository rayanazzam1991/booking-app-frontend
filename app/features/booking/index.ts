/**
 * Booking Feature — Public API
 *
 * This is the single import boundary for everything the booking feature
 * exposes to the rest of the application.  External code must import
 * from this file, not from the feature's internal modules.
 *
 * Migration phase: "migrating"
 *   All booking-slice business logic has been moved into this feature.
 *   Legacy files in app/components/, app/composables/, and app/stores/ are
 *   now re-export shims and will be removed in a future cleanup step.
 */

export { bookingFeatureManifest } from './feature.manifest'
export type { BookingFeatureManifest } from './feature.manifest'

// Stores
export { useServiceStore } from './stores/serviceStore'
export { useAppointmentStore } from './stores/appointmentStore'

// Composables
export { useAppointmentForm } from './composables/useAppointmentForm'

// Components
export { default as AppointmentForm } from './components/AppointmentForm.vue'
