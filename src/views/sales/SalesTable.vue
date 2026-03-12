<template>
  <AppTable
    :headers="headers"
    :items="sales"
    :is-loading="isLoading"
    :row-clickable="true"
    @row-click="(item) => $emit('edit', item)"
  >
    <template #cell-trx_no="{ item }">
      <div class="flex items-center gap-3">
        <span class="font-bold text-blue-400 tabular-nums"> #{{ item.trx_no }} </span>

        <button
          @click.stop="$emit('print', item)"
          class="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-all group"
          title="طباعة سريعة"
        >
          <svg
            class="h-4 w-4 transform group-hover:scale-110 transition-transform"
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
      </div>
    </template>

    <template #cell-invoice_date="{ item }">
      <span class="text-gray-300 tabular-nums text-xs">
        {{ formatDate(item.invoice_date) }}
      </span>
    </template>

    <template #cell-partner_name="{ item }">
      <div class="flex flex-col">
        <span class="font-bold text-white leading-tight"> {{ item.partner_name || '---' }} </span>
        <span v-if="item.designer_name" class="text-[10px] text-cyan-400 font-bold mt-0.5">
          المصمم: {{ item.designer_name }}
        </span>
      </div>
    </template>

    <template #cell-financial_summary="{ item }">
      <div
        class="bg-gray-800/40 dark:bg-black/30 p-1.5 rounded-lg border border-gray-700/50 max-w-[170px] ml-auto"
      >
        <div class="flex justify-between items-center mb-1">
          <span class="text-[9px] text-gray-400 font-black">الإجمالي</span>
          <span class="text-xs font-black text-white tabular-nums">
            {{ formatCurrency(item.net_amount) }}
          </span>
        </div>
        <div class="space-y-0.5 pt-1 border-t border-gray-700/60">
          <div class="flex justify-between items-center">
            <span class="text-[9px] text-emerald-400 font-bold">المدفوع</span>
            <span class="text-[10px] font-bold text-emerald-400 tabular-nums">
              {{ formatCurrency(item.paid_amount) }}
            </span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-[9px] text-rose-400 font-bold">المتبقي</span>
            <span
              :class="
                Number(item.remaining_amount) > 0 ? 'text-rose-400 font-black' : 'text-gray-500'
              "
              class="text-[10px] tabular-nums"
            >
              {{ formatCurrency(item.remaining_amount) }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <template #cell-status="{ item }">
      <span
        :class="
          item.status === 'confirmed'
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
        "
        class="px-2 py-0.5 rounded-md text-[9px] font-black border uppercase"
      >
        {{ item.status === 'confirmed' ? 'معتمدة' : 'مسودة' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="flex items-center justify-center gap-2" @click.stop>
        <button
          v-if="item.status === 'draft' && can('sale.change_status')"
          @click="$emit('confirm', item)"
          class="p-2 text-emerald-400 hover:bg-emerald-500/10 rounded-full transition-all"
          title="اعتماد الآن"
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
              stroke-width="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </button>

        <button
          v-if="can('sale.delete')"
          @click="$emit('delete', item.id)"
          class="px-3 py-1.5 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white font-bold text-xs rounded-lg transition-all"
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
  sales: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete', 'print', 'confirm'])

const { can } = useAuthStore()

const formatDate = (dateString) => {
  if (!dateString) return '---'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatCurrency = (value) => {
  return (
    new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
      value || 0,
    ) + ' ج.س'
  )
}

const headers = ref([
  { key: 'trx_no', label: 'رقم الفاتورة', class: 'w-40' }, // وسعنا العرض قليلاً ليشمل الرقم والزر
  { key: 'invoice_date', label: 'التاريخ', class: 'w-28' },
  { key: 'partner_name', label: 'العميل / المصمم' },
  { key: 'financial_summary', label: 'الموقف المالي', class: 'text-right w-52' },
  { key: 'status', label: 'الحالة', class: 'text-center w-24' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center w-32' },
])
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
</style>
