<template>
  <div class="p-6 space-y-8 bg-[#0f172a] min-h-screen text-gray-100">
    <div
      class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-6"
    >
      <div>
        <h1
          class="text-4xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          غرفة العمليات <span class="text-indigo-500 text-lg">لوحة التحكم</span>
        </h1>
        <p class="text-gray-400 mt-1 font-medium">
          تحليل ذكي للأداء المالي، المخزني، ونشاط المصممين
        </p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="dashboardStore.fetchStats()"
          class="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-gray-400"
            :class="{ 'animate-spin': loading }"
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
        <div
          class="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-500/20"
        >
          توقيت البيانات: {{ lastUpdated }}
        </div>
      </div>
    </div>

    <DashboardStatsCards :stats="stats?.cards" :is-loading="loading" />

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div
        class="lg:col-span-8 bg-surface-section/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <div class="flex items-center justify-between mb-8">
          <h3 class="text-lg font-bold text-white flex items-center gap-2">
            <span class="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
            تحليل التدفقات الأسبوعية
          </h3>
          <div class="flex gap-4 text-[10px] font-bold uppercase">
            <span class="flex items-center gap-1.5 text-blue-400"
              ><span class="w-2 h-2 bg-blue-500 rounded-full"></span> مبيعات</span
            >
            <span class="flex items-center gap-1.5 text-emerald-400"
              ><span class="w-2 h-2 bg-emerald-500 rounded-full"></span> مشتريات</span
            >
          </div>
        </div>
        <DashboardChart v-if="stats?.charts" :chart-data="stats.charts" :is-loading="loading" />
      </div>

      <div
        class="lg:col-span-4 bg-surface-section/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <h3 class="text-lg font-bold text-white mb-6">توزيع السيولة</h3>
        <div class="space-y-6">
          <div v-for="item in stats?.liquidity" :key="item.type_name" class="space-y-2">
            <div class="flex justify-between text-xs font-bold uppercase tracking-wider">
              <span class="text-gray-400">{{ item.type_name }}</span>
              <span class="text-white">{{ Number(item.balance).toLocaleString() }} جنيه</span>
            </div>
            <div class="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-1000"
                :class="item.type_name === 'البنوك' ? 'bg-cyan-500' : 'bg-amber-500'"
                :style="{ width: calculatePercentage(item.balance) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="bg-surface-section/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5 text-amber-400"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
            />
          </svg>
          نجوم التصميم (هذا الشهر)
        </h3>
        <div class="space-y-4">
          <div
            v-for="(designer, index) in stats?.top_designers"
            :key="designer.designer_id"
            class="flex items-center gap-4 p-3 rounded-xl bg-gray-800/30 border border-gray-700/30"
          >
            <div
              class="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-black"
            >
              {{ index + 1 }}
            </div>
            <div class="flex-1">
              <p class="text-sm font-bold text-white">{{ designer.designer?.name }}</p>
              <p class="text-[10px] text-gray-500">
                العمولة: {{ Number(designer.total_commissions).toLocaleString() }} جنيه
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm font-black text-indigo-400">
                {{ Number(designer.total_sales).toLocaleString() }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-surface-section/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <h3 class="text-lg font-bold text-white mb-6">الأصناف الأكثر رواجاً</h3>
        <div class="space-y-6">
          <div v-for="item in stats?.top_items" :key="item.item_id" class="relative">
            <div class="flex justify-between mb-1">
              <span class="text-sm font-bold text-gray-300">{{ item.item?.name }}</span>
              <span class="text-xs font-black text-emerald-400"
                >{{ Number(item.total_revenue).toLocaleString() }} جنيه</span
              >
            </div>
            <div class="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <div
                class="bg-emerald-500 h-full transition-all duration-1000"
                :style="{ width: '70%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div
        class="bg-surface-section/40 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-2xl"
      >
        <h3 class="text-lg font-bold text-white mb-6 flex items-center gap-2">
          أحدث حركات المبيعات
        </h3>
        <DashboardRecentList :items="stats?.recent?.sales" type="sales" :is-loading="loading" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboardStore'

// استيراد المكونات الفرعية المحدثة
import DashboardStatsCards from './DashboardStatsCards.vue'
import DashboardChart from './DashboardChart.vue'
import DashboardRecentList from './DashboardRecentList.vue'

const dashboardStore = useDashboardStore()
const { stats, loading, error } = storeToRefs(dashboardStore)

const lastUpdated = computed(() => {
  return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
})

// دالة بسيطة لحساب النسبة المئوية لتوزيع السيولة
const calculatePercentage = (value) => {
  const total = stats.value?.cards?.cash_balance || 1
  return (value / total) * 100
}

onMounted(() => {
  dashboardStore.fetchStats()
})
</script>

<style scoped>
/* المظهر الداكن العميق */
.bg-surface-section\/40 {
  background-color: rgba(30, 41, 59, 0.4);
}
</style>
