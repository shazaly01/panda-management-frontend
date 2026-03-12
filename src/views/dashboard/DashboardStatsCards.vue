<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7 gap-6">
    <div
      v-for="card in cardConfigs"
      :key="card.key"
      class="relative overflow-hidden p-5 border-r-4 bg-surface-section/60 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.3)] rounded-xl transition-all duration-300 hover:scale-[1.02] group"
      :class="card.borderColor"
    >
      <div
        class="text-[10px] uppercase tracking-widest mb-3 font-bold transition-colors"
        :class="card.labelColor"
      >
        {{ card.label }}
      </div>

      <div class="flex justify-between items-end">
        <div v-if="!isLoading" class="space-y-1">
          <div
            class="text-2xl font-black tracking-tighter flex items-baseline gap-1"
            :class="[card.valueColor, card.glowClass]"
          >
            {{ formatValue(stats?.[card.key], card.isCount) }}

            <span v-if="!card.isCount" class="text-[10px] font-bold opacity-70">جنيه</span>
          </div>
        </div>

        <div v-else class="h-8 w-24 bg-gray-700/50 animate-pulse rounded"></div>

        <div class="opacity-20 group-hover:opacity-100 transition-opacity duration-500">
          <component :is="card.icon" :class="['h-7 w-7', card.valueColor]" />
        </div>
      </div>

      <div
        class="absolute -bottom-4 -left-4 w-16 h-16 rounded-full blur-3xl opacity-20"
        :class="card.bgGlow"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { h } from 'vue'

// --- الأيقونات (نفس الأكواد السابقة) ---
const IconSales = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2.5',
      d: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
    }),
  ])
const IconProfit = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2.5',
      d: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    }),
  ])
const IconPurchases = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2.5',
      d: 'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
    }),
  ])
const IconCash = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2.5',
      d: 'M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    }),
  ])
const IconUsers = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2.5',
      d: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z',
    }),
  ])
const IconAlert = () =>
  h('svg', { fill: 'none', viewBox: '0 0 24 24', stroke: 'currentColor' }, [
    h('path', {
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-width': '2.5',
      d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    }),
  ])

const props = defineProps({
  stats: { type: Object, default: () => ({}) },
  isLoading: { type: Boolean, default: false },
})

// --- إعدادات البطاقات السبعة ---
const cardConfigs = [
  {
    key: 'sales_today',
    label: 'مبيعات اليوم',
    borderColor: 'border-r-indigo-500',
    labelColor: 'text-indigo-200/60',
    valueColor: 'text-indigo-400',
    glowClass: 'drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]',
    bgGlow: 'bg-indigo-500',
    icon: IconSales,
  },
  {
    key: 'profit_today',
    label: 'صافي الربح',
    borderColor: 'border-r-amber-400',
    labelColor: 'text-amber-200/60',
    valueColor: 'text-amber-400',
    glowClass: 'drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]',
    bgGlow: 'bg-amber-400',
    icon: IconProfit,
  },
  {
    key: 'purchases_today',
    label: 'المشتريات',
    borderColor: 'border-r-emerald-400',
    labelColor: 'text-emerald-200/60',
    valueColor: 'text-emerald-400',
    glowClass: 'drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    bgGlow: 'bg-emerald-400',
    icon: IconPurchases,
  },
  {
    key: 'cash_balance',
    label: 'السيولة',
    borderColor: 'border-r-cyan-400',
    labelColor: 'text-cyan-200/60',
    valueColor: 'text-cyan-300',
    glowClass: 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    bgGlow: 'bg-cyan-400',
    icon: IconCash,
  },
  {
    key: 'receivables',
    label: 'ديون العملاء',
    borderColor: 'border-r-blue-400',
    labelColor: 'text-blue-200/60',
    valueColor: 'text-blue-400',
    glowClass: 'drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]',
    bgGlow: 'bg-blue-400',
    icon: IconUsers,
  },
  {
    key: 'payables',
    label: 'ديون الموردين',
    borderColor: 'border-r-rose-400',
    labelColor: 'text-rose-200/60',
    valueColor: 'text-rose-400',
    glowClass: 'drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]',
    bgGlow: 'bg-rose-400',
    icon: IconCash,
  },
  {
    key: 'low_stock_count',
    label: 'نواقص المخزون',
    borderColor: 'border-r-orange-500',
    labelColor: 'text-orange-200/60',
    valueColor: 'text-orange-400',
    glowClass: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]',
    bgGlow: 'bg-orange-500',
    icon: IconAlert,
    isCount: true,
  },
]

// 🌟 دالة تنسيق الأرقام الذكية
const formatValue = (val, isCount) => {
  if (val === undefined || val === null) return '0'

  const num = Number(val)

  if (isCount) return num.toString() // للأعداد الصحيحة (مثل عدد النواقص)

  // منطق العملة:
  // إذا كان الرقم صحيحاً (لا يوجد كسر)، لا تظهر أصفار عشرية
  const hasDecimals = num % 1 !== 0

  return num.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })
}
</script>

<style scoped>
.bg-surface-section\/60 {
  background-color: rgba(30, 41, 59, 0.6);
}
</style>
