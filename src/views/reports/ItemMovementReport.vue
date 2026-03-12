<template>
  <div class="space-y-6">
    <h1 class="text-3xl font-black text-white">تقرير حركة صنف (كارت صنف)</h1>

    <AppCard class="p-6 border border-gray-800 bg-surface-section/60">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div class="space-y-1">
          <label class="text-xs text-gray-400 font-bold">الصنف</label>
          <ItemsDropdown v-model="filters.item_id" placeholder="اختر الصنف..." />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-gray-400 font-bold">المخزن (اختياري)</label>
          <WarehousesDropdown
            id="wh-filter"
            v-model="filters.warehouse_id"
            placeholder="كل المخازن"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-gray-400 font-bold">من تاريخ</label>
          <input
            type="date"
            v-model="filters.date_from"
            class="w-full bg-surface-section border border-gray-700 rounded-lg p-2 text-white"
          />
        </div>

        <div class="space-y-1">
          <label class="text-xs text-gray-400 font-bold">إلى تاريخ</label>
          <input
            type="date"
            v-model="filters.date_to"
            class="w-full bg-surface-section border border-gray-700 rounded-lg p-2 text-white"
          />
        </div>

        <div class="md:col-span-4 flex justify-end">
          <AppButton @click="handleFetch" :loading="loading" class="bg-indigo-600 px-8">
            عرض التقرير
          </AppButton>
        </div>
      </div>
    </AppCard>

    <AppCard v-if="itemMovement.length" class="border border-gray-800 bg-surface-section/40">
      <AppTable :headers="headers" :items="itemMovement">
        <template #cell-in_qty="{ item }">
          <span class="text-emerald-400 font-bold">
            {{ parseFloat(item.in_qty) > 0 ? item.in_qty : '-' }}
          </span>
        </template>

        <template #cell-out_qty="{ item }">
          <span class="text-rose-400 font-bold">
            {{ parseFloat(item.out_qty) > 0 ? item.out_qty : '-' }}
          </span>
        </template>

        <template #cell-balance="{ item }">
          <span class="text-white font-black px-2 py-1 bg-gray-800 rounded">
            {{ item.balance }}
          </span>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import { storeToRefs } from 'pinia'
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'
import WarehousesDropdown from '@/components/forms/WarehousesDropdown.vue'
import ItemsDropdown from '@/components/forms/ItemsDropdown.vue'

const reportStore = useReportStore()
const { itemMovement, loading } = storeToRefs(reportStore)

const filters = ref({
  item_id: '',
  warehouse_id: '',
  date_from: '',
  date_to: '',
})

// تم إزالة 'unit_name' لأن جميع الحركات الآن مسجلة بالوحدة الأساسية (Base Unit)
const headers = [
  { key: 'trx_date', label: 'التاريخ' },
  { key: 'trx_no', label: 'رقم الحركة' },
  { key: 'type_label', label: 'النوع' },
  { key: 'description', label: 'البيان' },
  { key: 'in_qty', label: 'وارد (+)' },
  { key: 'out_qty', label: 'صادر (-)' },
  { key: 'balance', label: 'الرصيد' },
]

const handleFetch = () => {
  if (!filters.value.item_id) {
    alert('يرجى اختيار الصنف أولاً')
    return
  }
  reportStore.fetchItemMovement(filters.value)
}
</script>
