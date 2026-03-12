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
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl font-black text-white tracking-tight">تقرير أداء المصممين</h1>
            <p class="text-gray-400 text-xs font-medium mt-0.5 uppercase tracking-wider italic">
              Designer Performance Analytics (ID Based)
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-end gap-3 flex-1 lg:max-w-3xl">
          <div class="flex-1 min-w-[200px]">
            <DesignersDropdown
              id="designer-filter"
              v-model="filters.designer_id"
              label="المصمم المسؤول"
              placeholder="البحث في كل المصممين..."
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
            class="bg-cyan-600 hover:bg-cyan-500 text-white px-8 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-cyan-500/25 active:scale-95 flex items-center gap-2"
          >
            <span>تحديث البيانات</span>
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
      <div
        class="bg-gray-900 border border-gray-800 p-6 rounded-3xl relative group transition-all hover:border-gray-700 shadow-xl overflow-hidden"
      >
        <div
          class="absolute -left-4 -bottom-4 text-white/5 group-hover:text-white/10 transition-colors"
        >
          <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
            />
          </svg>
        </div>
        <div class="flex justify-between items-start relative z-10">
          <div>
            <span class="text-gray-500 text-[10px] font-black uppercase tracking-widest"
              >إجمالي حجم المبيعات</span
            >
            <p class="text-3xl font-black text-white tabular-nums mt-2 tracking-tighter italic">
              {{ formatCurrency(reportStore.designersTotals.total_sales) }}
            </p>
          </div>
          <div
            class="p-3 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors shadow-lg"
          >
            <span class="text-gray-400 font-bold text-xs uppercase">Sales</span>
          </div>
        </div>
      </div>

      <div
        class="bg-cyan-500/5 border border-cyan-500/10 p-6 rounded-3xl relative group transition-all hover:border-cyan-500/30 shadow-xl shadow-cyan-500/5 overflow-hidden"
      >
        <div
          class="absolute -left-4 -bottom-4 text-cyan-500/5 group-hover:text-cyan-500/10 transition-colors"
        >
          <svg class="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
            />
          </svg>
        </div>
        <div class="flex justify-between items-start relative z-10">
          <div>
            <span
              class="text-cyan-500 text-[10px] font-black uppercase tracking-widest text-shadow-sm"
              >إجمالي العمولات المستحقة (10%)</span
            >
            <p class="text-3xl font-black text-white tabular-nums mt-2 tracking-tighter italic">
              {{ formatCurrency(reportStore.designersTotals.total_commissions) }}
            </p>
          </div>
          <div
            class="p-3 bg-cyan-500/10 rounded-2xl group-hover:bg-cyan-500/20 transition-colors shadow-lg shadow-cyan-500/10"
          >
            <span class="text-cyan-500 font-bold text-xs uppercase">Profit</span>
          </div>
        </div>
      </div>
    </div>

    <div
      class="bg-gray-900/80 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative backdrop-blur-sm transition-all duration-500"
    >
      <div
        v-if="reportStore.loading"
        class="absolute inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-20"
      >
        <div class="flex flex-col items-center gap-5">
          <div class="relative w-16 h-16">
            <div class="absolute inset-0 border-4 border-cyan-500/20 rounded-full"></div>
            <div
              class="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"
            ></div>
          </div>
          <span class="text-cyan-500 font-black text-xs uppercase tracking-[0.4em] animate-pulse"
            >Analyzing Data...</span
          >
        </div>
      </div>

      <table class="w-full text-right border-collapse">
        <thead>
          <tr
            v-if="isDetailed"
            class="bg-black/40 text-gray-500 text-[10px] font-black uppercase border-b border-gray-800"
          >
            <th class="p-5 w-32">تاريخ الحركة</th>
            <th class="p-5 w-32">رقم المرجع</th>
            <th class="p-5">اسم العميل</th>
            <th class="p-5 text-left">قيمة الفاتورة</th>
            <th class="p-5 text-left text-cyan-400">العمولة</th>
          </tr>
          <tr
            v-else
            class="bg-black/40 text-gray-500 text-[10px] font-black uppercase border-b border-gray-800"
          >
            <th class="p-5">اسم المصمم</th>
            <th class="p-5 text-center">الإنتاجية (عدد)</th>
            <th class="p-5 text-left">إجمالي المبيعات</th>
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
              <td
                class="p-5 tabular-nums text-[11px] text-gray-500 font-bold group-hover:text-gray-300"
              >
                {{ item.date }}
              </td>
              <td
                class="p-5 tabular-nums text-blue-500 font-black text-[11px] tracking-wider italic"
              >
                #{{ item.trx_no }}
              </td>
              <td class="p-5 text-gray-200 text-sm font-semibold tracking-tight">
                {{ item.partner_name }}
              </td>
              <td class="p-5 text-left tabular-nums text-sm font-medium text-gray-400 italic">
                {{ formatCurrency(item.net_amount) }}
              </td>
              <td
                class="p-5 text-left tabular-nums font-black text-cyan-400 bg-cyan-500/[0.03] shadow-inner"
              >
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
                    class="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-[10px] font-black text-cyan-500 border border-cyan-500/20 group-hover:scale-110 transition-transform shadow-lg shadow-cyan-500/5"
                  >
                    {{ item.designer_id }}
                  </div>
                  <span
                    class="font-bold text-gray-200 group-hover:text-cyan-400 transition-colors"
                    >{{ item.designer_name }}</span
                  >
                </div>
              </td>
              <td
                class="p-5 text-center tabular-nums text-gray-500 font-black tracking-widest text-xs italic"
              >
                {{ item.invoices_count }} Op
              </td>
              <td class="p-5 text-left tabular-nums font-bold text-gray-300">
                {{ formatCurrency(item.total_sales) }}
              </td>
              <td
                class="p-5 text-left tabular-nums font-black text-cyan-400 text-lg bg-cyan-500/[0.02] group-hover:bg-cyan-500/[0.05] transition-colors"
              >
                {{ formatCurrency(item.commission_val) }}
              </td>
            </tr>
          </template>

          <tr v-if="!reportStore.loading && reportStore.designersReport.length === 0">
            <td colspan="5" class="p-20 text-center">
              <div class="flex flex-col items-center gap-4 opacity-15">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <span class="font-black text-xs uppercase tracking-[0.5em] text-white"
                  >No Results Found</span
                >
              </div>
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
  designer_id: null, // استخدام المعرف الرقمي
  date_from: '',
  date_to: '',
})

// يتحدد وضع العرض بناءً على اختيار مصمم بعينه عبر الـ ID
const isDetailed = computed(() => !!filters.designer_id)

const fetchData = () => {
  reportStore.fetchDesignersReport(filters)
}

/**
 * الانتقال لكشف حساب مصمم محدد عند الضغط عليه في القائمة العامة
 * @param {Number} id - معرف المصمم
 */
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

/* تأثيرات الطباعة */
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
  }
  .text-cyan-400,
  .text-blue-500 {
    color: black !important;
    font-weight: bold;
  }
}
</style>
