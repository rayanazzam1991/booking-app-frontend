/**
 * Step 3 verification — Feature Architecture Shell
 *
 * These tests assert that the feature registry and booking manifest are
 * structurally correct.  They are purely structural (no components mounted,
 * no stores accessed, no HTTP calls) so no `fetch` mock is needed.
 *
 * Acceptance criteria:
 *  1. The feature registry exports a `featureRegistry` object.
 *  2. `featureRegistry` has a `booking` key.
 *  3. The booking manifest has the expected shape (id, name, status, etc.).
 *  4. `getFeatureManifest('booking')` returns the same manifest.
 *  5. `bookingFeatureManifest.legacyRoots` lists every legacy file for this slice.
 *  6. No legacy source file was modified (checked via import resolution — if
 *     legacy imports still resolve, they were not deleted).
 */

import { describe, it, expect } from 'vitest'
import {
  featureRegistry,
  getFeatureManifest,
  type FeatureId,
} from '../../../app/features'
import { bookingFeatureManifest } from '../../../app/features/booking/feature.manifest'

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

describe('featureRegistry', () => {
  it('is defined and is an object', () => {
    expect(featureRegistry).toBeDefined()
    expect(typeof featureRegistry).toBe('object')
  })

  it('contains the "booking" feature', () => {
    expect('booking' in featureRegistry).toBe(true)
  })

  it('does not contain unregistered features', () => {
    const knownKeys: FeatureId[] = ['booking']
    const actualKeys = Object.keys(featureRegistry)
    expect(actualKeys).toEqual(knownKeys)
  })
})

// ---------------------------------------------------------------------------
// Booking manifest shape
// ---------------------------------------------------------------------------

describe('bookingFeatureManifest', () => {
  it('has id "booking"', () => {
    expect(bookingFeatureManifest.id).toBe('booking')
  })

  it('has a non-empty name', () => {
    expect(typeof bookingFeatureManifest.name).toBe('string')
    expect(bookingFeatureManifest.name.length).toBeGreaterThan(0)
  })

  it('has a non-empty description', () => {
    expect(typeof bookingFeatureManifest.description).toBe('string')
    expect(bookingFeatureManifest.description.length).toBeGreaterThan(0)
  })

  it('has a semver-like version string', () => {
    expect(bookingFeatureManifest.version).toMatch(/^\d+\.\d+\.\d+$/)
  })

  it('has status "migrating" after booking logic was moved into the feature directory', () => {
    expect(bookingFeatureManifest.status).toBe('migrating')
  })

  it('lists all four legacy roots that belong to this slice', () => {
    const roots = [...bookingFeatureManifest.legacyRoots]
    expect(roots).toContain('app/components/ApointmentForm.vue')
    expect(roots).toContain('app/composables/useAppointmentForm.ts')
    expect(roots).toContain('app/stores/appointmentStore.ts')
    expect(roots).toContain('app/stores/serviceStore.ts')
    expect(roots).toHaveLength(4)
  })
})

// ---------------------------------------------------------------------------
// Registry ↔ manifest consistency
// ---------------------------------------------------------------------------

describe('getFeatureManifest', () => {
  it('returns the booking manifest for id "booking"', () => {
    const manifest = getFeatureManifest('booking')
    expect(manifest).toBe(bookingFeatureManifest)
  })

  it('registry booking entry is the same reference as the direct import', () => {
    expect(featureRegistry.booking).toBe(bookingFeatureManifest)
  })
})

// ---------------------------------------------------------------------------
// Legacy source roots are unchanged (import-resolution smoke check)
// ---------------------------------------------------------------------------

describe('legacy source roots — not deleted or moved', () => {
  it('can still import useAppointmentStore from the legacy path', async () => {
    // Dynamic import so the test does not fail at parse time if the file moves.
    // We only assert that the module resolves and the export exists.
    const mod = await import('../../../app/stores/appointmentStore')
    expect(typeof mod.useAppointmentStore).toBe('function')
  })

  it('can still import useServiceStore from the legacy path', async () => {
    const mod = await import('../../../app/stores/serviceStore')
    expect(typeof mod.useServiceStore).toBe('function')
  })
})

