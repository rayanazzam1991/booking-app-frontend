<script setup lang="ts">
import PaymentManager from '../components/PaymentManager.vue'
</script>

<template>
  <main class="min-h-screen bg-background text-foreground">
    <section class="mx-auto max-w-6xl space-y-10 px-6 py-12">
      <header class="space-y-3">
        <p class="body-small font-semibold uppercase tracking-[0.25em] text-muted">Feature Workspace</p>
        <h1 class="heading-1">Payment</h1>
        <p class="body-large max-w-3xl text-muted">Manage payment submission, verification, and payment state across the product.</p>
      </header>

      <PaymentManager />
    </section>
  </main>
</template>
