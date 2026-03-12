<template>
  <div class="p-6 space-y-6">
    <div
      class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 no-print"
    >
      <div>
        <h1 class="text-2xl font-black text-blue-500">تقرير أرصدة العملاء والموردين</h1>
        <p class="text-gray-400 text-sm font-medium">
          كشف المديونيات والدائنية الحالية حتى تاريخ اليوم
        </p>
      </div>
      <div class="flex gap-3">
        <button
          @click="fetchData"
          class="p-2.5 bg-gray-800 text-gray-400 hover:text-white rounded-xl border border-gray-700 transition-all"
          title="تحديث البيانات"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            :class="{ 'animate-spin': reportStore.loading }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
        <button
          @click="printReport"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl flex items-center gap-2 font-black text-xs shadow-lg shadow-blue-500/20 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
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
          طباعة التقرير
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 no-print">
      <div
        class="bg-emerald-500/10 border border-emerald-500/20 p-5 rounded-2xl relative overflow-hidden group"
      >
        <div
          class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-24 w-24 text-emerald-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
        </div>
        <h3 class="text-emerald-500 text-xs font-black uppercase tracking-widest mb-1">
          إجمالي مديونية العملاء (لنا)
        </h3>
        <p class="text-2xl font-black text-white tabular-nums">
          {{ formatCurrency(reportStore.partnerTotals.total_debit) }}
        </p>
      </div>

      <div
        class="bg-rose-500/10 border border-rose-500/20 p-5 rounded-2xl relative overflow-hidden group"
      >
        <div
          class="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-24 w-24 text-rose-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
            />
          </svg>
        </div>
        <h3 class="text-rose-500 text-xs font-black uppercase tracking-widest mb-1">
          إجمالي دائنية الموردين (علينا)
        </h3>
        <p class="text-2xl font-black text-white tabular-nums">
          {{ formatCurrency(reportStore.partnerTotals.total_credit) }}
        </p>
      </div>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-900/40 p-4 rounded-2xl border border-gray-800 no-print"
    >
      <input
        v-model="filters.search"
        @input="fetchData"
        type="text"
        placeholder="بحث بالاسم أو الكود..."
        class="bg-black/20 border-gray-700 text-white rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 transition-all placeholder:text-gray-600"
      />

      <select
        v-model="filters.type"
        @change="fetchData"
        class="w-full bg-black/20 border-gray-700 text-white rounded-xl p-2.5 text-sm outline-none"
      >
        <option value="">الكل (عملاء وموردين)</option>
        <option value="1">العملاء فقط</option>
        <option value="2">الموردين فقط</option>
        <option value="3">عملاء وموردين</option>
      </select>

      <select
        v-model="filters.balance_status"
        @change="fetchData"
        class="bg-black/20 border-gray-700 text-white rounded-xl p-2.5 text-sm outline-none"
      >
        <option value="">كل الحسابات</option>
        <option value="debit">الحسابات المدينة (لنا)</option>
        <option value="credit">الحسابات الدائنة (علينا)</option>
        <option value="zero">الحسابات الصفرية</option>
      </select>
    </div>

    <div
      class="bg-gray-900/80 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl relative"
    >
      <div
        v-if="reportStore.loading"
        class="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-10"
      >
        <div
          class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <table class="w-full text-right border-collapse">
        <thead>
          <tr
            class="bg-black/40 text-gray-500 text-[10px] font-black uppercase tracking-widest border-b border-gray-800"
          >
            <th class="p-4 w-24">الكود</th>
            <th class="p-4">اسم الحساب</th>
            <th class="p-4 text-center">النوع</th>
            <th class="p-4 text-left">الرصيد الحالي</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-800">
          <tr
            v-for="item in reportStore.partnerBalances"
            :key="item.id"
            class="hover:bg-white/[0.02] transition-colors"
          >
            <td class="p-4 tabular-nums text-blue-400 font-bold text-sm">#{{ item.code }}</td>
            <td class="p-4 font-bold text-gray-200">{{ item.name }}</td>
            <td class="p-4 text-center">
              <span
                :class="
                  item.type === 'customer'
                    ? 'text-cyan-400 border-cyan-400/20 bg-cyan-400/5'
                    : 'text-purple-400 border-purple-400/20 bg-purple-400/5'
                "
                class="px-3 py-1 rounded-lg text-[10px] font-black border uppercase"
              >
                {{ item.type_label }}
              </span>
            </td>
            <td class="p-4 text-left font-black tabular-nums">
              <div class="flex flex-col items-end">
                <span
                  :class="
                    parseFloat(item.current_balance) > 0
                      ? 'text-emerald-400'
                      : parseFloat(item.current_balance) < 0
                        ? 'text-rose-400'
                        : 'text-gray-500'
                  "
                  class="text-sm"
                >
                  {{ formatCurrency(Math.abs(item.current_balance)) }}
                </span>
                <span class="text-[9px] font-bold opacity-50 uppercase">
                  {{
                    parseFloat(item.current_balance) > 0
                      ? 'مدين لك'
                      : parseFloat(item.current_balance) < 0
                        ? 'دائن له'
                        : 'رصيد مغلق'
                  }}
                </span>
              </div>
            </td>
          </tr>
          <tr v-if="reportStore.partnerBalances.length === 0 && !reportStore.loading">
            <td colspan="4" class="p-10 text-center text-gray-600 font-bold">
              لا توجد بيانات مطابقة للبحث
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useReportStore } from '@/stores/reportStore'

const reportStore = useReportStore()

const filters = reactive({
  search: '',
  type: '',
  balance_status: '',
})

const fetchData = () => {
  reportStore.fetchPartnerBalances(filters)
}

const formatCurrency = (val) => {
  return (
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val || 0) + ' SDG'
  )
}

const printReport = () => window.print()

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
  .bg-gray-900\/80 {
    background: transparent !important;
    border: 1px solid #ddd !important;
  }
  .text-white,
  .text-gray-200 {
    color: black !important;
  }
  .text-blue-400,
  .text-emerald-400,
  .text-rose-400 {
    color: black !important;
    font-weight: bold;
  }
  table {
    border-collapse: collapse;
  }
  th,
  td {
    border: 1px solid #eee !important;
    color: black !important;
  }
}
</style>
