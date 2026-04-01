/**
 * Booking Feature — Public API
 *
 * This is the single import boundary for everything the booking feature
 * exposes to the rest of the application.  External code must import
 * from this file, not from the feature's internal modules.
 *
 * Migration phase: "shell"
 *   Only the manifest is exported right now.  As business logic is
 *   progressively moved into this feature (components, composables,
 *   stores) their exports will be added here and legacy re-export shims
 *   will be placed in the original locations to avoid breaking changes.
 *
 * Future exports (added in later migration steps):
 *   export { default as AppointmentForm } from './components/AppointmentForm.vue'
 *   export { useAppointmentForm }         from './composables/useAppointmentForm'
 *   export { useAppointmentStore }        from './stores/appointmentStore'
 *   export { useServiceStore }            from './stores/serviceStore'
 */

export { bookingFeatureManifest } from './feature.manifest'
export type { BookingFeatureManifest } from './feature.manifest'

