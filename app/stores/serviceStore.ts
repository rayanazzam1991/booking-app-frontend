/**
 * Re-export shim — serviceStore
 *
 * The canonical implementation now lives at:
 *   app/features/booking/stores/serviceStore.ts
 *
 * This shim keeps the legacy import path alive so that:
 *  - @pinia/nuxt auto-imports still resolve `useServiceStore`
 *  - Any direct `import { useServiceStore } from '~/stores/serviceStore'`
 *    continues to work without changes
 *
 * Remove this file only after the page and all direct callers have been
 * updated to import from the feature path.
 */
export { useServiceStore } from '../features/booking/stores/serviceStore'
