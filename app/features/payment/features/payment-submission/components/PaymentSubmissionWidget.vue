<script setup lang="ts">
import { onMounted } from 'vue'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { usePaymentSubmission } from '../composables/usePaymentSubmission'

const { status, data, error, init, refresh } = usePaymentSubmission()

onMounted(() => {
  init()
})
</script>

<template>
  <Card class="border-border">
    <CardHeader class="gap-3 md:flex-row md:items-start md:justify-between">
      <div>
        <CardTitle class="heading-5">Payment Submission</CardTitle>
        <CardDescription>Allow users to submit payment proof and attach it to the related booking or order.</CardDescription>
      </div>
      <Badge variant="secondary">{{ status }}</Badge>
    </CardHeader>
    <CardContent class="space-y-4">
      <p class="body-small text-muted">{{ data?.summary || 'No summary yet.' }}</p>

      <ul class="space-y-2">
        <li v-for="highlight in data?.highlights || []" :key="highlight" class="body-small">
          • {{ highlight }}
        </li>
      </ul>

      <p v-if="error" class="body-small text-destructive">{{ error }}</p>

      <Button size="sm" variant="outline" @click="refresh">Refresh Subfeature</Button>
    </CardContent>
  </Card>
</template>
