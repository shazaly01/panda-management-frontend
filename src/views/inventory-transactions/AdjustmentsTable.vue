<template>
  <AppTable :headers="headers" :items="adjustments" :is-loading="isLoading" :row-clickable="false">
    <template #cell-code="{ item }">
      <span class="font-bold text-amber-600 dark:text-amber-400"> #{{ item.code }} </span>
    </template>

    <template #cell-trx_date="{ item }">
      <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
        {{ formatDate(item.trx_date) }}
      </span>
    </template>

    <template #cell-trx_type="{ item }">
      <div class="flex items-center gap-2">
        <span
          :class="
            item.trx_type === 'adjustment_in'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
          "
          class="px-2 py-1 rounded-md text-[10px] font-black uppercase"
        >
          {{ item.trx_type === 'adjustment_in' ? 'زيادة +' : 'عجز -' }}
        </span>
      </div>
    </template>

    <template #cell-increase_percentage="{ item }">
      <span
        class="font-mono font-bold text-sm"
        :class="item.trx_type === 'adjustment_in' ? 'text-green-600' : 'text-rose-600'"
      >
        {{ item.trx_type === 'adjustment_in' ? '+' : '-' }}{{ item.increase_percentage || 0 }}%
      </span>
    </template>

    <template #cell-warehouse="{ item }">
      <span class="text-gray-500 dark:text-gray-400 text-xs">
        {{ item.from_warehouse?.name || '---' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-center gap-4">
        <button
          v-if="can('adjustment.update') && !item.is_approved"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold text-xs transition-colors"
        >
          تعديل
        </button>

        <button
          @click="$emit('view', item)"
          class="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 font-bold text-xs transition-colors"
        >
          عرض
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
  adjustments: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'view'])

const { can } = useAuthStore()

// --- الترويسات المحدثة ---
const headers = ref([
  { key: 'code', label: 'رقم التسوية', class: 'w-24' },
  { key: 'trx_date', label: 'التاريخ', class: 'w-28' },
  { key: 'warehouse', label: 'المخزن' },
  { key: 'trx_type', label: 'النوع', class: 'w-24' },
  {
    key: 'increase_percentage',
    label: 'النسبة (%)',
    class: 'text-center w-24',
    cellClass: 'text-center',
  },
  { key: 'actions', label: 'الإجراءات', class: 'text-center w-32', cellClass: 'text-center' },
])

// --- دالة تنسيق التاريخ ليكون قصيراً ---
const formatDate = (dateStr) => {
  if (!dateStr) return '---'
  // يأخذ الجزء الأول فقط من التاريخ (YYYY-MM-DD)
  return dateStr.split('T')[0].split(' ')[0]
}
</script>
