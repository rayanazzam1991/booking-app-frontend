/**
 * Booking Feature — Manifest
 *
 * Declares the static metadata for the booking feature slice.
 * This file MUST remain side-effect-free (no runtime imports, no store
 * access, no composables) so it can be statically analysed by New Studio's
 * protected-feature scanner.
 *
 * Migration status: "migrating"
 *   The booking feature owns the canonical implementation now. Legacy
 *   source roots listed in `legacyRoots` remain in place as compatibility
 *   shims until the cleanup step removes them.
 */

export const bookingFeatureManifest = {
  /** Unique identifier used by the feature registry. */
  id: 'booking',

  /** Human-readable display name. */
  name: 'Booking',

  /** Short description of what this feature owns. */
  description:
    'Healthcare appointment booking flow — service selection, professional picker, and appointment submission.',

  /** Semver string; bump when public API surface changes. */
  version: '0.1.0',

  /**
   * Migration lifecycle status.
   *
   * "shell"     — directory skeleton created; no logic moved yet
   * "migrating" — logic has moved and legacy adapters still exist (current)
   * "complete"  — all legacy roots have been absorbed
   */
  status: 'migrating' as const,

  /**
   * Legacy source files that this feature will absorb in future steps.
   * Kept here so tooling and reviewers know exactly which files belong to
   * this slice.  Do not delete these roots until their replacements inside
   * this feature are complete and all tests pass.
   */
  legacyRoots: [
    'app/components/ApointmentForm.vue',
    'app/composables/useAppointmentForm.ts',
    'app/stores/appointmentStore.ts',
    'app/stores/serviceStore.ts',
  ] as const,
} as const

export type BookingFeatureManifest = typeof bookingFeatureManifest
