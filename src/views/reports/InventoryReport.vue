<template>
  <div class="space-y-6 print:hidden">
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <h1 class="text-3xl font-black text-white tracking-tight">تقرير الأصناف والمخزون الحالي</h1>

      <div class="flex gap-3 items-center">
        <div class="w-64">
          <WarehousesDropdown
            id="warehouse-filter"
            label=""
            placeholder="كل المخازن..."
            v-model="selectedWarehouseId"
            @update:model-value="handleRefresh"
          />
        </div>

        <AppButton
          @click="handlePrint"
          class="bg-indigo-500 hover:bg-indigo-400 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]"
          :disabled="!inventoryReport.length"
        >
          <PrinterIcon class="w-5 h-5 ml-2" />
          طباعة التقرير
        </AppButton>

        <AppButton
          @click="handleRefresh"
          :loading="loading"
          variant="secondary"
          class="border-gray-600 text-gray-200"
        >
          <ArrowPathIcon class="w-5 h-5 ml-2" :class="{ 'animate-spin': loading }" />
          تحديث
        </AppButton>
      </div>
    </div>

    <div v-if="inventoryReport.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      <AppCard
        class="relative overflow-hidden p-5 border-r-4 border-r-cyan-400 bg-surface-section/60 shadow-[0_4_20px_rgba(0,0,0,0.3)]"
      >
        <div class="text-xs text-cyan-200/60 uppercase tracking-widest mb-2 font-bold">
          إجمالي عدد الأصناف
        </div>
        <div class="text-2xl font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">
          {{ totalItems }} <span class="text-sm font-normal text-gray-400">صنف</span>
        </div>
      </AppCard>

      <AppCard
        class="relative overflow-hidden p-5 border-r-4 border-r-emerald-400 bg-surface-section/60 shadow-[0_4_20px_rgba(0,0,0,0.3)]"
      >
        <div class="text-xs text-emerald-200/60 uppercase tracking-widest mb-2 font-bold">
          إجمالي كميات المخزون
        </div>
        <div
          class="text-2xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        >
          {{ totalQuantity }} <span class="text-sm font-normal text-gray-400">وحدة</span>
        </div>
      </AppCard>
    </div>

    <AppCard class="border border-gray-800 bg-surface-section/40 backdrop-blur-sm">
      <AppTable :headers="tableHeaders" :items="inventoryReport" :is-loading="loading">
        <template #cell-item_code="{ item }">
          <span class="text-gray-400 font-medium">{{ item.item_code }}</span>
        </template>

        <template #cell-item_name="{ item }">
          <span
            class="font-bold text-cyan-300 hover:text-cyan-100 cursor-pointer transition-all duration-300"
          >
            {{ item.item_name }}
          </span>
        </template>

        <template #cell-barcode="{ item }">
          <span class="text-gray-300">{{ item.barcode || '---' }}</span>
        </template>

        <template #cell-lowest_unit_name="{ item }">
          <span class="text-fuchsia-300 bg-fuchsia-500/10 px-2 py-1 rounded text-sm">
            {{ item.lowest_unit_name }}
          </span>
        </template>

        <template #cell-quantity="{ item }">
          <span
            class="font-black drop-shadow-[0_0_5px_rgba(52,211,153,0.3)]"
            :class="item.quantity > 0 ? 'text-emerald-400' : 'text-rose-400'"
          >
            {{ item.quantity }}
          </span>
        </template>
      </AppTable>
    </AppCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useReportStore } from '@/stores/reportStore'
import { storeToRefs } from 'pinia'
import { PrinterIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

// استيراد المكونات الأساسية
import AppCard from '@/components/ui/AppCard.vue'
import AppTable from '@/components/ui/AppTable.vue'
import AppButton from '@/components/ui/AppButton.vue'

// +++ استيراد مكون القائمة المنسدلة للمخازن +++
// (الرجاء التأكد من صحة مسار الاستيراد حسب هيكل مشروعك)
import WarehousesDropdown from '@/components/forms/WarehousesDropdown.vue'

const router = useRouter()
const reportStore = useReportStore()
const { inventoryReport, loading } = storeToRefs(reportStore)

// متغير لتخزين رقم المخزن للفلترة (أصبح يستقبل القيمة من الـ Dropdown)
const selectedWarehouseId = ref('')

// إحصائيات محسوبة من الجدول مباشرة
const totalItems = computed(() => inventoryReport.value.length)
const totalQuantity = computed(() => {
  return inventoryReport.value.reduce((sum, item) => sum + Number(item.quantity || 0), 0)
})

const tableHeaders = [
  { key: 'item_code', label: 'كود الصنف' },
  { key: 'item_name', label: 'اسم الصنف' },
  { key: 'barcode', label: 'الباركود' },
  { key: 'lowest_unit_name', label: 'وحدة القياس' },
  { key: 'quantity', label: 'الرصيد الحالي' },
]

const handleRefresh = () => {
  // تمرير رقم المخزن إذا كان موجوداً
  reportStore.fetchInventoryReport(selectedWarehouseId.value || null)
}

const handlePrint = () => {
  if (inventoryReport.value.length === 0) return

  // حفظ البيانات للنافذة الجديدة
  sessionStorage.setItem(
    'printData',
    JSON.stringify({
      inventoryReport: inventoryReport.value,
      totalItems: totalItems.value,
      totalQuantity: totalQuantity.value,
      warehouseId: selectedWarehouseId.value,
    }),
  )

  const routeData = router.resolve({ name: 'PrintInventory' })
  window.open(routeData.href, '_blank')
}

onMounted(() => {
  handleRefresh()
})
</script>

<style scoped>
:deep(.AppTable th) {
  @apply text-gray-400 font-bold uppercase tracking-wider text-xs border-b border-gray-800;
}

:deep(.AppTable td) {
  @apply py-4 border-b border-gray-800/50;
}
</style>
