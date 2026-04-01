/**
 * Global Vitest setup — runs once before all tests in the Nuxt environment.
 *
 * Responsibilities:
 * - Silence console.log noise from the application code (fetchServices logs, etc.)
 * - Keep console.error and console.warn visible so real failures surface.
 *
 * Network mocking (vi.stubGlobal('fetch', ...)) is done per-test inside each
 * spec file so that each test controls exactly what the mock returns.
 */
import { vi } from 'vitest'

// Suppress application-level console.log noise (store debug logs, etc.)
// Comment out this line if you need verbose output while debugging a test.
vi.spyOn(console, 'log').mockImplementation(() => {})

