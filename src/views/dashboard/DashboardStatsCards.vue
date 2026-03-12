<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
    <div
      v-for="card in cardConfigs"
      :key="card.key"
      class="bg-surface-section p-5 rounded-2xl border border-surface-border shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div class="flex items-start justify-between mb-4">
        <div
          :class="card.colorClass"
          class="p-3 rounded-xl transition-transform group-hover:scale-110"
        >
          <component :is="card.icon" class="h-6 w-6" />
        </div>

        <div
          v-if="isLoading"
          class="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"
        ></div>
      </div>

      <div v-if="!isLoading">
        <p class="text-xs font-bold text-text-muted mb-1">{{ card.label }}</p>
        <div class="flex items-baseline gap-1">
          <h4 class="text-xl font-black text-text-primary tracking-tight">
            {{ formatValue(stats?.[card.key], card.isCount) }}
          </h4>
          <span v-if="!card.isCount" class="text-[10px] text-text-muted font-bold">د.ل</span>
        </div>
      </div>

      <div v-else class="space-y-2">
        <div class="h-3 w-16 bg-surface-ground animate-pulse rounded"></div>
        <div class="h-6 w-24 bg-surface-ground animate-pulse rounded"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, h } from 'vue'

// استيراد أيقونات بسيطة (يمكنك استبدالها بأي مكتبة أيقونات لديك)
const IconSales = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-6 h-6' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    }),
  ])
const IconPurchases = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-6 h-6' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z',
    }),
  ])
const IconCash = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-6 h-6' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z',
    }),
  ])
const IconUsers = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-6 h-6' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
    }),
  ])
const IconAlert = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor', class: 'w-6 h-6' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2',
      d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    }),
  ])

const props = defineProps({
  stats: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false },
})

// إعدادات البطاقات لسهولة التحكم في الألوان والأيقونات
const cardConfigs = [
  {
    key: 'sales_today',
    label: 'مبيعات اليوم',
    colorClass: 'bg-blue-100 text-blue-600',
    icon: IconSales,
  },
  {
    key: 'purchases_today',
    label: 'مشتريات اليوم',
    colorClass: 'bg-emerald-100 text-emerald-600',
    icon: IconPurchases,
  },
  {
    key: 'cash_balance',
    label: 'الرصيد النقدي',
    colorClass: 'bg-amber-100 text-amber-600',
    icon: IconCash,
  },
  {
    key: 'receivables',
    label: 'ديون العملاء',
    colorClass: 'bg-indigo-100 text-indigo-600',
    icon: IconUsers,
  },
  {
    key: 'payables',
    label: 'ديون الموردين',
    colorClass: 'bg-rose-100 text-rose-600',
    icon: IconCash,
  },
  {
    key: 'low_stock_count',
    label: 'نواقص المخزون',
    colorClass: 'bg-orange-100 text-orange-600',
    icon: IconAlert,
    isCount: true,
  },
]

// دالة تنسيق الأرقام
const formatValue = (val, isCount) => {
  if (val === undefined || val === null) return '0'
  return isCount ? val : Number(val).toLocaleString('ar-EG', { minimumFractionDigits: 2 })
}
</script>
