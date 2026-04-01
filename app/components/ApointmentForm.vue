<!--
  Re-export shim — ApointmentForm (legacy name preserved intentionally)

  The canonical implementation now lives at:
    app/features/booking/components/AppointmentForm.vue

  This shim keeps the legacy Nuxt auto-import path alive so that:
   - <ApointmentForm/> in app/pages/index.vue resolves without changes
   - Any test that imports '~/components/ApointmentForm.vue' gets the same
     component object as the feature component

  Because `export { default }` re-exports the feature component class itself
  (not a wrapper), the mounted instance IS the feature component — provides,
  vee-validate context, and all reactive state are identical.

  Remove this file once index.vue is updated to import the feature component
  directly and all callers have been updated.
-->
<script lang="ts">
export { default } from '../features/booking/components/AppointmentForm.vue'
</script>

