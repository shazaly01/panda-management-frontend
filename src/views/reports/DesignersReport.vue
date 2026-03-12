<template>
  <div class="p-6 space-y-7">
    <div
      class="bg-gray-900/60 backdrop-blur-md p-6 rounded-3xl border border-gray-800 no-print shadow-2xl relative overflow-hidden"
    >
      <div
        class="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl rounded-full -mr-10 -mt-10"
      ></div>

      <div class="flex flex-col lg:flex-row justify-between gap-6 relative z-10">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-cyan-500/10 rounded-2xl border border-cyan-500/20 shadow-inner">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-cyan-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2a4 4 0 00-4-4H5m11 0h.01M13 21h8m0 0l-3-3m3 3l-3 3M9 7a4 4 0 11-8 0 4 4 0 018 0zm6 5a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">تقرير وعمولات المصممين</h1>
            <p class="text-gray-400 text-[10px] font-bold mt-0.5 uppercase tracking-[0.2em] italic">
              Designer Revenue & Commissions
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-end gap-3 flex-1 lg:max-w-3xl">
          <div class="flex-1 min-w-[220px]">
            <DesignersDropdown
              id="designer-filter"
              v-model="filters.designer_id"
              label="تصفية حسب المصمم"
              placeholder="البحث عن مصمم محدد..."
            />
          </div>

          <div class="space-y-1 w-36">
            <label class="text-[10px] font-black text-gray-500 mr-1 uppercase">من تاريخ</label>
            <input
              v-model="filters.date_from"
              type="date"
              class="w-full bg-black/40 border-gray-700 text-white rounded-xl p-2 text-sm outline-none focus:border-cyan-500 transition-all shadow-inner"
            />
          </div>

          <div class="space-y-1 w-36">
            <label class="text-[10px] font-black text-gray-500 mr-1 uppercase">إلى تاريخ</label>
            <input
              v-model="filters.date_to"
              type="date"
              class="w-full bg-black/40 border-gray-700 text-white rounded-xl p-2 text-sm outline-none focus:border-cyan-500 transition-all shadow-inner"
            />
          </div>

          <button
            @click="fetchData"
            class="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95"
          >
            تحديث
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
      <div
        class="bg-gray-900 border border-gray-800 p-6 rounded-3xl relative group shadow-xl transition-all hover:border-gray-700"
      >
        <span class="text-gray-500 text-[10px] font-black uppercase tracking-widest block mb-1"
          >إجمالي إنتاج المصممين</span
        >
        <h2 class="text-3xl font-black text-white tabular-nums tracking-tighter italic">
          {{ formatCurrency(reportStore.designersTotals.total_sales) }}
        </h2>
      </div>

      <div
        class="bg-cyan-500/5 border border-cyan-500/10 p-6 rounded-3xl relative group shadow-xl transition-all hover:border-cyan-500/30"
      >
        <span class="text-cyan-500 text-[10px] font-black uppercase tracking-widest block mb-1"
          >صافي العمولات المقدرة</span
        >
        <h2 class="text-3xl font-black text-white tabular-nums tracking-tighter italic">
          {{ formatCurrency(reportStore.designersTotals.total_commissions) }}
        </h2>
      </div>
    </div>

    <div
      class="bg-gray-900/80 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative backdrop-blur-sm"
    >
      <div
        v-if="reportStore.loading"
        class="absolute inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-20 transition-all"
      >
        <div class="flex flex-col items-center gap-4">
          <div
            class="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin shadow-lg"
          ></div>
          <span
            class="text-cyan-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse"
            >جاري سحب البيانات...</span
          >
        </div>
      </div>

      <table class="w-full text-right border-collapse">
        <thead>
          <tr
            v-if="isDetailed"
            class="bg-black/40 text-gray-500 text-[10px] font-black uppercase border-b border-gray-800"
          >
            <th class="p-5">تاريخ الفاتورة</th>
            <th class="p-5">رقم المرجع</th>
            <th class="p-5">العميل</th>
            <th class="p-5 text-left">قيمة الفاتورة</th>
            <th class="p-5 text-center">النسبة</th>
            <th class="p-5 text-left text-cyan-400 font-black">العمولة</th>
          </tr>
          <tr
            v-else
            class="bg-black/40 text-gray-500 text-[10px] font-black uppercase border-b border-gray-800"
          >
            <th class="p-5">اسم المصمم</th>
            <th class="p-5 text-center">العمليات</th>
            <th class="p-5 text-left">إجمالي الإنتاج</th>
            <th class="p-5 text-center">متوسط النسبة</th>
            <th class="p-5 text-left text-cyan-400 font-black tracking-widest italic">
              المستحق المالي
            </th>
          </tr>
        </thead>

        <tbody class="divide-y divide-gray-800/50">
          <template v-if="isDetailed">
            <tr
              v-for="(item, idx) in reportStore.designersReport"
              :key="idx"
              class="hover:bg-white/[0.03] transition-colors group"
            >
              <td class="p-5 tabular-nums text-xs text-gray-400">{{ item.date }}</td>
              <td class="p-5 tabular-nums text-blue-500 font-black text-xs">#{{ item.trx_no }}</td>
              <td class="p-5 text-gray-200 text-sm font-medium">{{ item.partner_name }}</td>
              <td class="p-5 text-left tabular-nums text-sm font-medium">
                {{ formatCurrency(item.net_amount) }}
              </td>
              <td class="p-5 text-center">
                <span class="bg-gray-800 px-2 py-0.5 rounded text-[10px] text-gray-400 font-black"
                  >10%</span
                >
              </td>
              <td class="p-5 text-left tabular-nums font-black text-cyan-400 text-base italic">
                {{ formatCurrency(item.commission_val) }}
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="item in reportStore.designersReport"
              :key="item.designer_id"
              class="hover:bg-white/[0.04] cursor-pointer group transition-all"
              @click="drillDown(item.designer_id)"
            >
              <td class="p-5">
                <div class="flex items-center gap-3">
                  <div
                    class="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] font-black text-cyan-500 border border-cyan-500/20 group-hover:scale-110 transition-transform"
                  >
                    ID-{{ item.designer_id }}
                  </div>
                  <span
                    class="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors"
                    >{{ item.designer_name }}</span
                  >
                </div>
              </td>
              <td class="p-5 text-center tabular-nums text-gray-500 font-black text-xs">
                {{ item.invoices_count }} Op
              </td>
              <td class="p-5 text-left tabular-nums font-bold text-gray-300">
                {{ formatCurrency(item.total_sales) }}
              </td>
              <td class="p-5 text-center">
                <span
                  class="bg-gray-800/50 px-2 py-1 rounded text-[10px] text-gray-500 font-black italic"
                  >10.00%</span
                >
              </td>
              <td
                class="p-5 text-left tabular-nums font-black text-cyan-400 text-xl bg-cyan-500/[0.02] group-hover:bg-cyan-500/[0.05] transition-colors"
              >
                {{ formatCurrency(item.commission_val) }}
              </td>
            </tr>
          </template>

          <tr v-if="!reportStore.loading && reportStore.designersReport.length === 0">
            <td colspan="6" class="p-20 text-center opacity-20">
              <span class="font-black text-xs uppercase tracking-[0.5em] text-white"
                >لا توجد بيانات متاحة حالياً</span
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import { useReportStore } from '@/stores/reportStore'
import DesignersDropdown from '@/components/forms/DesignersDropdown.vue'

const reportStore = useReportStore()

const filters = reactive({
  designer_id: null,
  date_from: '',
  date_to: '',
})

const isDetailed = computed(() => !!filters.designer_id)

const fetchData = () => {
  reportStore.fetchDesignersReport(filters)
}

const drillDown = (id) => {
  filters.designer_id = id
  fetchData()
}

const formatCurrency = (val) => {
  return (
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val || 0) + ' SDG'
  )
}

onMounted(fetchData)
</script>

<style scoped>
.tabular-nums {
  font-variant-numeric: tabular-nums;
}
@media print {
  .no-print {
    display: none !important;
  }
  .p-6 {
    padding: 0 !important;
  }
  .bg-gray-900 {
    background: white !important;
    color: black !important;
  }
  th,
  td {
    border: 1px solid #000 !important;
    color: black !important;
    padding: 8px !important;
  }
}
</style>
