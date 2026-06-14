<script setup lang="ts">
import AnaylticsManager from '../components/AnaylticsManager.vue'
import {usePayment} from "~/features/payment";
const {init} = usePayment()

</script>

<template>
  <main class="min-h-screen bg-background text-foreground">
    <section class="mx-auto max-w-6xl space-y-10 px-6 py-12">
      <header class="space-y-3">
        <p class="body-small font-semibold uppercase tracking-[0.25em] text-muted">Feature Workspace</p>
        <h1 class="heading-1">Anayltics</h1>
        <p class="body-large max-w-3xl text-muted">Anayltics ships with a working store, service layer, UI manager, CRUD API, and migration stub.</p>
      </header>

      <AnaylticsManager />
    </section>
  </main>
</template>
