<template>
  <AppTable :headers="headers" :items="items" :is-loading="isLoading" :row-clickable="false">
    <template #cell-category="{ item }">
      <span class="text-text-secondary">
        {{ item.category?.name || '---' }}
      </span>
    </template>

    <template #cell-type_label="{ item }">
      <span
        class="px-2.5 py-0.5 rounded text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      >
        {{ item.type_label || item.type }}
      </span>
    </template>

    <template #cell-barcode="{ item }">
      <span class="font-mono text-text-secondary text-xs">
        {{ item.barcode || '---' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="space-x-2 space-x-reverse">
        <button
          v-if="can('item.update')"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:underline"
        >
          تعديل
        </button>
        <button
          v-if="can('item.delete')"
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
  // تم تغيير الاسم إلى items ليتوافق مع المكون
  items: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

const { can } = useAuthStore()

const headers = ref([
  { key: 'id', label: 'رقم الصنف', class: 'w-24' },
  { key: 'name', label: 'اسم الصنف' },
  { key: 'category', label: 'التصنيف' },
  { key: 'type_label', label: 'النوع' },
  { key: 'barcode', label: 'الباركود' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center' },
])
</script>
