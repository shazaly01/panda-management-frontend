<!--src\views\inventory-transactions\AdjustmentsTable.vue-->
<template>
  <AppTable :headers="headers" :items="adjustments" :is-loading="isLoading" :row-clickable="false">
    <template #cell-code="{ item }">
      <span class="font-bold text-amber-600 dark:text-amber-400"> #{{ item.code }} </span>
    </template>

    <template #cell-trx_type="{ item }">
      <span
        :class="item.trx_type === 'adjustment_in' ? 'text-green-600' : 'text-rose-600'"
        class="text-xs font-bold"
      >
        {{ item.trx_type === 'adjustment_in' ? 'تسوية بزيادة (+)' : 'تسوية بعجز (-)' }}
      </span>
    </template>

    <template #cell-warehouse="{ item }">
      <span class="text-text-secondary">
        {{ item.from_warehouse?.name || '---' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-center space-x-3 space-x-reverse">
        <button
          v-if="can('adjustment.update') && !item.is_approved"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:underline"
        >
          تعديل
        </button>

        <button @click="$emit('view', item)" class="text-amber-600 hover:underline">عرض</button>
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

const headers = ref([
  { key: 'code', label: 'رقم التسوية', class: 'w-32' },
  { key: 'trx_date', label: 'التاريخ', class: 'w-32' },
  { key: 'warehouse', label: 'المخزن' },
  { key: 'trx_type', label: 'نوع التسوية' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center' },
])
</script>
