<template>
  <AppTable :headers="headers" :items="treasuries" :is-loading="isLoading" :row-clickable="false">
    <template #cell-is_bank="{ item }">
      <span
        :class="item.is_bank ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'"
        class="px-2.5 py-0.5 rounded text-xs font-semibold"
      >
        {{ item.is_bank ? 'حساب بنكي' : 'خزينة نقدية' }}
      </span>
    </template>

    <template #cell-bank_account_no="{ item }">
      <span class="text-text-secondary font-mono">
        {{ item.bank_account_no || '---' }}
      </span>
    </template>

    <template #cell-current_balance="{ item }">
      <span dir="ltr" class="font-bold text-gray-700 dark:text-gray-300">
        {{ Number(item.current_balance || 0).toFixed(2) }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="space-x-2 space-x-reverse">
        <button
          v-if="can('treasury.update')"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:underline"
        >
          تعديل
        </button>
        <button
          v-if="can('treasury.delete')"
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
  treasuries: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

const { can } = useAuthStore()

const headers = ref([
  { key: 'id', label: 'الرقم', class: 'w-24' },
  { key: 'name', label: 'الاسم' },
  { key: 'is_bank', label: 'النوع' },
  { key: 'bank_account_no', label: 'رقم الحساب' },
  { key: 'current_balance', label: 'الرصيد الحالي', class: 'text-left', cellClass: 'text-left' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center' },
])
</script>
