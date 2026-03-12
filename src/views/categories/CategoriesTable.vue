<template>
  <AppTable :headers="headers" :items="categories" :is-loading="isLoading" :row-clickable="false">
    <template #cell-parent_name="{ item }">
      <span class="text-text-secondary">
        {{ item.parent_name || '---' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="space-x-2 space-x-reverse">
        <button
          v-if="can('category.update')"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:underline"
        >
          تعديل
        </button>
        <button
          v-if="can('category.delete')"
          @click="$emit('delete', item.id)"
          class="text-red-600 hover:underline"
        >
          حذف
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AppTable from '@/components/ui/AppTable.vue'

defineProps({
  categories: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

const { can } = useAuthStore()

const headers = ref([
  { key: 'id', label: 'الرقم' },
  { key: 'name', label: 'اسم التصنيف' },
  { key: 'parent_name', label: 'التصنيف الأب' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center' },
])
</script>
