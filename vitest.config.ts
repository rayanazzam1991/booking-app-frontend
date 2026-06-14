import { defineVitestConfig } from '@nuxt/test-utils/config'

/**
 * Vitest config wired to the Nuxt runtime environment.
 *
 * All tests run inside the same Nuxt app context so that Pinia, vee-validate,
 * auto-imports, and useRuntimeConfig() all work without hand-rolled shims.
 *
 * Network calls are intercepted per-test via vi.stubGlobal('fetch', vi.fn())
 * — no real backend is ever contacted.
 */
export default defineVitestConfig({
  test: {
    environment: 'nuxt',
    setupFiles: ['./test/setup.ts'],
    environmentOptions: {
      nuxt: {
        rootDir: '.',
      },
    },
  },
})

