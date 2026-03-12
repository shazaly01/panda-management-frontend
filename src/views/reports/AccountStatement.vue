<template>
  <div class="p-6 space-y-6">
    <div class="bg-gray-900/50 p-6 rounded-2xl border border-gray-800 no-print space-y-4 shadow-xl">
      <div class="flex items-center gap-2 mb-2">
        <div class="w-1.5 h-6 bg-blue-600 rounded-full"></div>
        <h2 class="text-white font-black text-lg">كشف حساب تفصيلي</h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div class="space-y-1.5">
          <label class="text-[11px] font-black text-gray-500 mr-1 uppercase">نوع الحساب</label>
          <select
            v-model="form.account_type"
            class="w-full bg-black/40 border-gray-700 text-white rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 transition-all"
          >
            <option value="partner">عميل / مورد</option>
            <option value="treasury">خزينة / بنك</option>
          </select>
        </div>

        <div class="space-y-1.5">
          <PartnersDropdown
            v-if="form.account_type === 'partner'"
            id="partner-select"
            label="اختر الشريك"
            v-model="form.account_id"
            :required="true"
            @update:model-value="handleAccountChange"
          />
          <TreasuriesDropdown
            v-else
            id="treasury-select"
            label="اختر الخزينة / البنك"
            v-model="form.account_id"
            :required="true"
            @update:model-value="handleAccountChange"
          />
        </div>

        <div class="space-y-1.5">
          <label class="text-[11px] font-black text-gray-500 mr-1 uppercase"
            >من تاريخ (اختياري)</label
          >
          <input
            v-model="form.date_from"
            type="date"
            class="w-full bg-black/40 border-gray-700 text-white rounded-xl p-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
        <div class="space-y-1.5">
          <label class="text-[11px] font-black text-gray-500 mr-1 uppercase"
            >إلى تاريخ (اختياري)</label
          >
          <input
            v-model="form.date_to"
            type="date"
            class="w-full bg-black/40 border-gray-700 text-white rounded-xl p-2.5 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div class="flex justify-end gap-3 pt-2">
        <button
          v-if="form.date_from || form.date_to"
          @click="clearDates"
          class="text-xs font-bold text-rose-500 hover:underline px-4"
        >
          تفريغ التواريخ
        </button>
        <button
          @click="fetchReport"
          :disabled="reportStore.loading"
          class="bg-blue-600 hover:bg-blue-700 text-white px-10 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50"
        >
          <span v-if="!reportStore.loading">عرض الكشف</span>
          <span v-else class="flex items-center gap-2">
            <svg
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            جاري التحميل...
          </span>
        </button>
      </div>
    </div>

    <div
      v-if="reportStore.accountStatement"
      class="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-2xl relative"
    >
      <div
        class="p-8 border-b border-gray-800 flex flex-col md:flex-row justify-between items-start md:items-end bg-black/20 gap-4"
      >
        <div>
          <span
            class="px-3 py-1 bg-blue-500/10 text-blue-500 text-[10px] font-black rounded-lg uppercase tracking-widest border border-blue-500/20"
          >
            Statement / كشف حساب
          </span>
          <h1 class="text-3xl font-black text-white mt-2">
            {{ reportStore.accountStatement.account_name }}
          </h1>
        </div>

        <div class="flex flex-col items-start md:items-end gap-2">
          <p class="text-gray-500 text-[10px] font-bold tabular-nums uppercase">
            تاريخ الاستخراج: {{ new Date().toLocaleString() }}
          </p>
          <div class="flex gap-2">
            <div class="px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-left">
              <span class="block text-[9px] text-gray-500 font-black">الرصيد الافتتاحي</span>
              <span class="text-sm font-black text-white tabular-nums">{{
                formatCurrency(reportStore.accountStatement.opening_balance)
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-right border-collapse">
          <thead>
            <tr
              class="bg-black/40 text-gray-500 text-[10px] font-black uppercase tracking-tighter border-b border-gray-800"
            >
              <th class="p-4 w-32">التاريخ</th>
              <th class="p-4 w-28">المرجع</th>
              <th class="p-4">البيان</th>
              <th class="p-4 text-left w-32">مدين / صرف</th>
              <th class="p-4 text-left w-32">دائن / قبض</th>
              <th class="p-4 text-left w-36 bg-blue-500/5 text-blue-400">الرصيد</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800/50">
            <tr
              v-for="(move, index) in reportStore.accountStatement.data"
              :key="index"
              class="hover:bg-white/[0.02] transition-colors group"
            >
              <td class="p-4 tabular-nums text-[11px] text-gray-400 font-medium">
                {{ move.date }}
              </td>
              <td class="p-4 tabular-nums text-blue-500 font-bold text-xs">#{{ move.trx_no }}</td>
              <td class="p-4 text-gray-200 text-sm font-medium">{{ move.description }}</td>
              <td class="p-4 text-left tabular-nums text-sm text-rose-500 font-bold">
                {{ parseFloat(move.debit) !== 0 ? formatCurrency(move.debit) : '-' }}
              </td>
              <td class="p-4 text-left tabular-nums text-sm text-emerald-400 font-bold">
                {{ parseFloat(move.credit) !== 0 ? formatCurrency(move.credit) : '-' }}
              </td>
              <td
                class="p-4 text-left tabular-nums text-sm font-black text-white bg-blue-500/5 border-l border-gray-800"
              >
                {{ formatCurrency(move.balance) }}
              </td>
            </tr>
          </tbody>
          <tfoot class="bg-black/60 border-t-2 border-gray-700">
            <tr>
              <td
                colspan="5"
                class="p-6 text-right font-black text-gray-400 uppercase text-xs tracking-widest"
              >
                صافي الرصيد الختامي
              </td>
              <td class="p-6 text-left font-black text-2xl text-blue-500 tabular-nums">
                {{ formatCurrency(reportStore.accountStatement.final_balance) }}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReportStore } from '@/stores/reportStore'
import PartnersDropdown from '@/components/forms/PartnersDropdown.vue'
import TreasuriesDropdown from '@/components/forms/TreasuriesDropdown.vue'

const route = useRoute()
const reportStore = useReportStore()

const form = reactive({
  account_type: 'partner',
  account_id: '',
  date_from: '',
  date_to: '',
})

onMounted(() => {
  // استقبال البيانات القادمة من روابط خارجية (مثل تقرير الأرصدة)
  if (route.query.account_id && route.query.account_type) {
    form.account_type = route.query.account_type
    setTimeout(() => {
      form.account_id = Number(route.query.account_id)
      fetchReport()
    }, 200)
  }
})

// دالة لجلب التقرير تلقائياً عند تغيير الحساب المختار (لتجربة مستخدم أسرع)
const handleAccountChange = (val) => {
  if (val) {
    fetchReport()
  } else {
    reportStore.accountStatement = null
  }
}

const fetchReport = async () => {
  if (!form.account_id) return
  await reportStore.fetchAccountStatement(form)
}

const clearDates = () => {
  form.date_from = ''
  form.date_to = ''
  fetchReport()
}

const formatCurrency = (val) => {
  return (
    new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val || 0) + ''
  )
}
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
    border: 1px solid #000 !important;
  }
  .text-white,
  .text-gray-200,
  .text-gray-400 {
    color: black !important;
  }
  .bg-black\/20,
  .bg-blue-500\/5,
  .bg-gray-800\/50 {
    background: transparent !important;
    border: 1px solid #eee !important;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th,
  td {
    border: 1px solid #ddd !important;
    padding: 8px !important;
    color: black !important;
  }
  .text-rose-500,
  .text-emerald-400,
  .text-blue-500 {
    color: black !important;
    font-weight: bold;
  }
}
</style>
