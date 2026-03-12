<template>
  <AppTable :headers="headers" :items="purchases" :is-loading="isLoading" :row-clickable="false">
    <template #cell-code="{ item }">
      <span class="font-bold text-emerald-600 dark:text-emerald-400"> #{{ item.code }} </span>
    </template>

    <template #cell-trx_date="{ item }">
      <span class="text-text-secondary whitespace-nowrap">
        {{ formatDate(item.trx_date) }}
      </span>
    </template>

    <template #cell-partner="{ item }">
      <div class="flex flex-col">
        <span class="font-medium text-gray-900 dark:text-white">
          {{ item.partner?.name || '---' }}
        </span>
      </div>
    </template>

    <template #cell-warehouse="{ item }">
      <span class="text-text-secondary">
        {{ item.warehouse?.name || '---' }}
      </span>
    </template>

    <template #cell-grand_total="{ item }">
      <span dir="ltr" class="font-extrabold text-gray-800 dark:text-gray-200">
        {{ Number(item.grand_total || 0).toFixed(2) }}
      </span>
    </template>

    <template #cell-is_approved="{ item }">
      <span
        :class="
          item.is_approved
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : 'bg-amber-100 text-amber-800 border border-amber-200'
        "
        class="px-2.5 py-0.5 rounded-full text-xs font-bold"
      >
        {{ item.is_approved ? 'معتمدة ومستلمة' : 'مسودة' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-center space-x-3 space-x-reverse">
        <button
          v-if="can('purchase.print')"
          @click="$emit('print', item)"
          class="text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 transition-colors"
          title="طباعة الفاتورة"
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
          v-if="can('purchase.update') && !item.is_approved"
          @click="$emit('edit', item)"
          class="text-emerald-600 hover:text-emerald-800 transition-colors font-medium"
        >
          تعديل
        </button>

        <button
          v-if="item.is_approved"
          @click="$emit('view', item)"
          class="text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
        >
          عرض
        </button>

        <button
          v-if="can('purchase.delete') && !item.is_approved"
          @click="$emit('delete', item.id)"
          class="text-red-600 hover:text-red-800 transition-colors font-medium"
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
  // مصفوفة فواتير المشتريات القادمة من الباك إند
  purchases: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'print', 'view'])

const { can } = useAuthStore()

// دالة تنسيق التاريخ
const formatDate = (dateString) => {
  if (!dateString) return '---'
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}

// تعريف أعمدة جدول المشتريات
const headers = ref([
  { key: 'code', label: 'رقم الفاتورة', class: 'w-32' },
  { key: 'trx_date', label: 'التاريخ', class: 'w-32' },
  { key: 'partner', label: 'المورد' }, // تعديل المسمى
  { key: 'warehouse', label: 'المخزن المستلم' }, // تعديل المسمى
  { key: 'grand_total', label: 'إجمالي المشتريات', class: 'text-left', cellClass: 'text-left' },
  { key: 'is_approved', label: 'الحالة', class: 'text-center', cellClass: 'text-center' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center w-48' },
])
</script>
