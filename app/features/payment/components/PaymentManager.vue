<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import type { PaymentItemStatus, PaymentRecord } from '../Payment.contract'
import { usePayment } from '../composables/usePayment'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

const {
  items,
  status,
  error,
  filters,
  init,
  createItem,
  updateItem,
  removeItem,
  selectItem,
  selectedItem,
  setSearchTerm,
} = usePayment()

const createForm = reactive({
  title: '',
  description: '',
  status: 'active' as PaymentItemStatus,
})

const editForm = reactive({
  title: '',
  description: '',
  status: 'active' as PaymentItemStatus,
})

const isSubmitting = computed(() => status.value === 'loading')

const resetCreateForm = () => {
  createForm.title = ''
  createForm.description = ''
  createForm.status = 'active'
}

const beginEdit = (item: PaymentRecord) => {
  selectItem(item.id)
  editForm.title = item.title
  editForm.description = item.description
  editForm.status = item.status
}

const cancelEdit = () => {
  selectItem(null)
}

const submitCreate = async () => {
  if (!createForm.title.trim()) {
    return
  }

  const created = await createItem({
    title: createForm.title.trim(),
    description: createForm.description.trim(),
    status: createForm.status,
  })

  if (created) {
    resetCreateForm()
  }
}

const submitEdit = async () => {
  if (!selectedItem.value) {
    return
  }

  const updated = await updateItem(selectedItem.value.id, {
    title: editForm.title.trim(),
    description: editForm.description.trim(),
    status: editForm.status,
  })

  if (updated) {
    selectItem(null)
  }
}

const deleteRecord = async (id: string) => {
  await removeItem(id)
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="grid gap-6 xl:grid-cols-[360px,1fr]">
    <Card class="border-border">
      <CardHeader>
        <CardTitle class="heading-4">Create Payment</CardTitle>
        <CardDescription>Manage payment submission, verification, and payment state across the product.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <Label for="create-title">Title</Label>
          <Input id="create-title" v-model="createForm.title" placeholder="Enter a title" />
        </div>

        <div class="space-y-2">
          <Label for="create-description">Description</Label>
          <textarea
            id="create-description"
            v-model="createForm.description"
            class="flex min-h-[110px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Add helpful detail"
          />
        </div>

        <div class="space-y-2">
          <Label for="create-status">Status</Label>
          <select
            id="create-status"
            v-model="createForm.status"
            class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <Button class="w-full" :disabled="isSubmitting" @click="submitCreate">
          {{ isSubmitting ? 'Saving...' : 'Create Item' }}
        </Button>

        <p v-if="error" class="body-small text-destructive">{{ error }}</p>
      </CardContent>
    </Card>

    <div class="space-y-6">
      <Card class="border-border">
        <CardHeader class="gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <CardTitle class="heading-4">Payment Workspace</CardTitle>
            <CardDescription>Generated CRUD workspace for the Payment feature.</CardDescription>
          </div>
          <div class="w-full md:w-72">
            <Label for="search-Payment">Search</Label>
            <Input
              id="search-Payment"
              :model-value="filters.searchTerm"
              placeholder="Filter by title or description"
              @update:model-value="setSearchTerm(String($event))"
            />
          </div>
        </CardHeader>
      </Card>

      <div v-if="items.length === 0 && status !== 'loading'" class="rounded-2xl border border-dashed border-border p-10 text-center">
        <p class="heading-5">No items yet</p>
        <p class="body-small mt-2 text-muted">Use the form to create the first record for this feature.</p>
      </div>

      <div class="grid gap-4">
        <Card v-for="item in items" :key="item.id" class="border-border">
          <CardHeader class="gap-3 md:flex-row md:items-start md:justify-between">
            <div class="space-y-2">
              <CardTitle class="heading-5">{{ item.title }}</CardTitle>
              <CardDescription>{{ item.description || 'No description yet.' }}</CardDescription>
            </div>
            <Badge variant="secondary">{{ item.status }}</Badge>
          </CardHeader>
          <CardContent class="space-y-4">
            <template v-if="selectedItem?.id === item.id">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <Label :for="`edit-title-${item.id}`">Title</Label>
                  <Input :id="`edit-title-${item.id}`" v-model="editForm.title" />
                </div>
                <div class="space-y-2">
                  <Label :for="`edit-status-${item.id}`">Status</Label>
                  <select
                    :id="`edit-status-${item.id}`"
                    v-model="editForm.status"
                    class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <Label :for="`edit-description-${item.id}`">Description</Label>
                <textarea
                  :id="`edit-description-${item.id}`"
                  v-model="editForm.description"
                  class="flex min-h-[110px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </div>

              <div class="flex gap-3">
                <Button :disabled="isSubmitting" @click="submitEdit">Save Changes</Button>
                <Button variant="outline" @click="cancelEdit">Cancel</Button>
              </div>
            </template>

            <template v-else>
              <div class="flex flex-wrap items-center gap-3 body-xs text-muted">
                <span>Created {{ new Date(item.createdAt).toLocaleDateString() }}</span>
                <span>Updated {{ new Date(item.updatedAt).toLocaleDateString() }}</span>
              </div>

              <div class="flex gap-3">
                <Button size="sm" variant="outline" @click="beginEdit(item)">Edit</Button>
                <Button size="sm" variant="destructive" @click="deleteRecord(item.id)">Delete</Button>
              </div>
            </template>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>
