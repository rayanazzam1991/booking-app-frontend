/**
 * Feature Registry
 *
 * The single source of truth for every registered feature in this application.
 * New Studio's protected-feature scanner reads this file to discover all
 * feature boundaries.
 *
 * Rules:
 *  - Every feature under `app/features/` MUST have an entry here.
 *  - Import only the feature's manifest (not its full public API) so that
 *    this file stays side-effect-free and statically analysable.
 *  - The `FeatureId` type is derived from the registry keys — use it
 *    wherever a feature identifier is needed at the type level.
 */

import { bookingFeatureManifest } from './booking/manifest'

export const featureRegistry = {
  booking: bookingFeatureManifest,
} as const

/** Union type of every registered feature ID. */
export type FeatureId = keyof typeof featureRegistry

/**
 * Look up a feature manifest by its ID.
 * Returns `undefined` if the ID is not registered (runtime guard).
 */
export function getFeatureManifest(id: FeatureId) {
  return featureRegistry[id]
}

// Re-export each feature's public API so consumers can use a single import
// path: `import { ... } from '~/features'`
export * from './booking'
