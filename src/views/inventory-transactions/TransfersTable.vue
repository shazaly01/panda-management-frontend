<template>
  <AppTable :headers="headers" :items="transfers" :is-loading="isLoading" :row-clickable="false">
    <template #cell-code="{ item }">
      <span class="font-bold text-indigo-600 dark:text-indigo-400"> #{{ item.code }} </span>
    </template>

    <template #cell-trx_date="{ item }">
      <span class="text-text-secondary whitespace-nowrap">
        {{ formatDate(item.trx_date) }}
      </span>
    </template>

    <template #cell-from_warehouse="{ item }">
      <span class="font-medium text-gray-900 dark:text-white">
        {{ item.from_warehouse?.name || '---' }}
      </span>
    </template>

    <template #cell-to_warehouse="{ item }">
      <span class="font-medium text-gray-900 dark:text-white text-indigo-500">
        {{ item.to_warehouse?.name || '---' }}
      </span>
    </template>

    <template #cell-items_count="{ item }">
      <span class="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-bold">
        {{ item.items?.length || 0 }} أصناف
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-center space-x-3 space-x-reverse">
        <button
          v-if="can('transfer.print')"
          @click="$emit('print', item)"
          class="text-gray-400 hover:text-gray-600"
          title="طباعة إذن التحويل"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
        </button>

        <button
          v-if="can('transfer.update') && !item.is_approved"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:underline"
        >
          تعديل
        </button>

        <button @click="$emit('view', item)" class="text-indigo-600 hover:underline">عرض</button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AppTable from '@/components/ui/AppTable.vue'

defineProps({
  transfers: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'print', 'view'])

const { can } = useAuthStore()

const formatDate = (dateString) => {
  if (!dateString) return '---'
  return new Date(dateString).toLocaleDateString('ar-EG')
}

const headers = ref([
  { key: 'code', label: 'رقم التحويل', class: 'w-32' },
  { key: 'trx_date', label: 'التاريخ', class: 'w-32' },
  { key: 'from_warehouse', label: 'من مخزن' },
  { key: 'to_warehouse', label: 'إلى مخزن' },
  { key: 'items_count', label: 'الكميات', class: 'text-center', cellClass: 'text-center' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center' },
])
</script>
