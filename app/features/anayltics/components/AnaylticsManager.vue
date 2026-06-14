<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import type { AnaylticsItemStatus, AnaylticsRecord } from '../Anayltics.contract'
import { useAnayltics } from '../composables/useAnayltics'


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
} = useAnayltics()

const createForm = reactive({
  title: '',
  description: '',
  status: 'active' as AnaylticsItemStatus,
})

const editForm = reactive({
  title: '',
  description: '',
  status: 'active' as AnaylticsItemStatus,
})

const isSubmitting = computed(() => status.value === 'loading')

const resetCreateForm = () => {
  createForm.title = ''
  createForm.description = ''
  createForm.status = 'active'
}

const beginEdit = (item: AnaylticsRecord) => {
  selectItem(item.id)
  editForm.title = item.title
  editForm.description = item.description
  editForm.status = item.status
}

const cancelEdit = () => {
  selectItem(null)
}

const submitCreate = async () => {
  if (!createForm.title.trim()) return
  const created = await createItem({
    title: createForm.title.trim(),
    description: createForm.description.trim(),
    status: createForm.status,
  })
  if (created) resetCreateForm()
}

const submitEdit = async () => {
  if (!selectedItem.value) return
  const updated = await updateItem(selectedItem.value.id, {
    title: editForm.title.trim(),
    description: editForm.description.trim(),
    status: editForm.status,
  })
  if (updated) selectItem(null)
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
    <section class="rounded-2xl border border-border bg-background p-6 shadow-sm">
      <div class="space-y-2">
        <h2 class="heading-4">Create Anayltics</h2>
        <p class="body-small text-muted">Add the first anayltics record to start iterating.</p>
      </div>

      <div class="mt-6 space-y-4">
        <div class="space-y-2">
          <label for="create-title" class="body-small font-semibold">Title</label>
          <input
            id="create-title"
            v-model="createForm.title"
            type="text"
            placeholder="Enter a title"
            class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div class="space-y-2">
          <label for="create-description" class="body-small font-semibold">Description</label>
          <textarea
            id="create-description"
            v-model="createForm.description"
            class="flex min-h-[110px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="Add helpful detail"
          />
        </div>

        <div class="space-y-2">
          <label for="create-status" class="body-small font-semibold">Status</label>
          <select
            id="create-status"
            v-model="createForm.status"
            class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <button type="button" class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90" class="w-full" :disabled="isSubmitting" @click="submitCreate">{{ isSubmitting ? 'Saving...' : 'Create Item' }}</button>

        <p v-if="error" class="body-small text-destructive">{{ error }}</p>
      </div>
    </section>

    <section class="space-y-6">
      <div class="rounded-2xl border border-border bg-background p-6 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 class="heading-4">Anayltics Workspace</h3>
            <p class="body-small text-muted">Generated CRUD workspace for the Anayltics feature.</p>
          </div>
          <div class="w-full md:w-72">
            <label for="search-Anayltics" class="body-small font-semibold">Search</label>
            <input
              id="search-Anayltics"
              :value="filters.searchTerm"
              type="text"
              placeholder="Filter by title or description"
              class="mt-2 flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
              @input="setSearchTerm(String(($event.target as HTMLInputElement).value))"
            />
          </div>
        </div>
      </div>

      <div v-if="items.length === 0 && status !== 'loading'" class="rounded-2xl border border-dashed border-border p-10 text-center">
        <p class="heading-5">No items yet</p>
        <p class="body-small mt-2 text-muted">Use the form to create the first record for this feature.</p>
      </div>

      <div class="grid gap-4">
        <article v-for="item in items" :key="item.id" class="rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div class="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div class="space-y-2">
              <h4 class="heading-5">{{ item.title }}</h4>
              <p class="body-small text-muted">{{ item.description || 'No description yet.' }}</p>
            </div>
            <span class="body-xs rounded-full border border-border px-3 py-1 text-muted">{{ item.status }}</span>
          </div>

          <div class="mt-4 space-y-4">
            <template v-if="selectedItem?.id === item.id">
              <div class="grid gap-4 md:grid-cols-2">
                <div class="space-y-2">
                  <label :for="`edit-title-${item.id}`" class="body-small font-semibold">Title</label>
                  <input
                    :id="`edit-title-${item.id}`"
                    v-model="editForm.title"
                    type="text"
                    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div class="space-y-2">
                  <label :for="`edit-status-${item.id}`" class="body-small font-semibold">Status</label>
                  <select
                    :id="`edit-status-${item.id}`"
                    v-model="editForm.status"
                    class="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div class="space-y-2">
                <label :for="`edit-description-${item.id}`" class="body-small font-semibold">Description</label>
                <textarea
                  :id="`edit-description-${item.id}`"
                  v-model="editForm.description"
                  class="flex min-h-[110px] w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div class="flex gap-3">
                <button type="button" class="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-90" :disabled="isSubmitting" @click="submitEdit">Save Changes</button>
                <button type="button" class="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-muted" @click="cancelEdit">Cancel</button>
              </div>
            </template>

            <template v-else>
              <div class="flex flex-wrap items-center gap-3 body-xs text-muted">
                <span>Created {{ new Date(item.createdAt).toLocaleDateString() }}</span>
                <span>Updated {{ new Date(item.updatedAt).toLocaleDateString() }}</span>
              </div>

              <div class="flex gap-3">
                <button type="button" class="rounded-md border border-border px-4 py-2 text-sm text-foreground hover:bg-muted" @click="beginEdit(item)">Edit</button>
                <button type="button" class="rounded-md bg-destructive px-4 py-2 text-sm text-white hover:opacity-90" @click="deleteRecord(item.id)">Delete</button>
              </div>
            </template>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
