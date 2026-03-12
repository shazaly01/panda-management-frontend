<template>
  <div class="p-6 space-y-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold text-text-primary">لوحة التحكم</h1>
        <p class="text-text-muted mt-1">نظرة عامة على أداء المؤسسة المالي والمخزني اليوم</p>
      </div>
      <div
        class="text-sm text-text-muted bg-surface-ground px-4 py-2 rounded-lg border border-surface-border"
      >
        تحديث: {{ lastUpdated }}
      </div>
    </div>

    <div
      v-if="error"
      class="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl flex items-center gap-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1-2 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      <div>
        <p class="font-bold">فشل تحميل البيانات</p>
        <p class="text-sm">{{ error }}</p>
      </div>
    </div>

    <DashboardStatsCards :stats="stats?.cards" :is-loading="loading" />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div
        class="lg:col-span-2 bg-surface-section p-6 rounded-2xl border border-surface-border shadow-sm"
      >
        <h3 class="text-lg font-bold text-text-primary mb-6 flex items-center gap-2">
          <span class="w-2 h-6 bg-primary rounded-full"></span>
          مقارنة المبيعات والمشتريات (أسبوعي)
        </h3>
        <DashboardChart v-if="stats?.charts" :chart-data="stats.charts" :is-loading="loading" />
      </div>

      <div class="space-y-6">
        <div class="bg-surface-section p-6 rounded-2xl border border-surface-border shadow-sm">
          <h3 class="text-lg font-bold text-text-primary mb-4">أحدث فواتير البيع</h3>
          <DashboardRecentList :items="stats?.recent?.sales" type="sales" :is-loading="loading" />
        </div>

        <div class="bg-surface-section p-6 rounded-2xl border border-surface-border shadow-sm">
          <h3 class="text-lg font-bold text-text-primary mb-4">أحدث فواتير الشراء</h3>
          <DashboardRecentList
            :items="stats?.recent?.purchases"
            type="purchases"
            :is-loading="loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboardStore } from '@/stores/dashboardStore' // تم تعديل المسار والمسمى بناءً على ملفك الجديد

// استيراد المكونات الفرعية
import DashboardStatsCards from './DashboardStatsCards.vue'
import DashboardChart from './DashboardChart.vue' // سنقوم بإنشائه
import DashboardRecentList from './DashboardRecentList.vue' // سنقوم بإنشائه

// 1. استخدام الـ Store الجديد
const dashboardStore = useDashboardStore()

// 2. استخراج البيانات بشكل تفاعلي
const { stats, loading, error } = storeToRefs(dashboardStore)

// 3. وقت التحديث الأخير
const lastUpdated = computed(() => {
  return new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
})

// 4. جلب البيانات عند التحميل
onMounted(() => {
  dashboardStore.fetchStats()
})
</script>
