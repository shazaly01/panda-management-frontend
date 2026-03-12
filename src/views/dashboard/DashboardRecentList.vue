<template>
  <div class="space-y-4">
    <div v-if="isLoading" class="space-y-4">
      <div
        v-for="i in 5"
        :key="i"
        class="flex items-center justify-between p-3 bg-gray-800/20 animate-pulse rounded-xl"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-gray-700 rounded-lg"></div>
          <div class="space-y-2">
            <div class="h-3 w-16 bg-gray-700 rounded"></div>
            <div class="h-2 w-24 bg-gray-700 rounded"></div>
          </div>
        </div>
        <div class="h-4 w-12 bg-gray-700 rounded"></div>
      </div>
    </div>

    <div v-else-if="items && items.length > 0" class="space-y-3">
      <div
        v-for="item in items"
        :key="item.id"
        class="group relative flex items-center justify-between p-3 rounded-xl border border-transparent hover:border-gray-700/50 hover:bg-gray-800/30 transition-all duration-300"
      >
        <div class="flex items-center gap-4">
          <div
            :class="[
              type === 'sales'
                ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
            ]"
            class="p-2.5 rounded-xl border transition-transform group-hover:scale-110"
          >
            <svg
              v-if="type === 'sales'"
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <svg
              v-else
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2.5"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>

          <div>
            <div class="flex items-center gap-2">
              <span class="text-sm font-black text-gray-100 uppercase">#{{ item.trx_no }}</span>
              <span
                v-if="item.status === 'confirmed'"
                class="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_#10b981]"
              ></span>
            </div>
            <p class="text-[10px] font-bold text-gray-500 truncate max-w-[100px]">
              {{ item.partner?.name || 'عميل نقدي' }}
            </p>
          </div>
        </div>

        <div class="text-left flex flex-col items-end">
          <div
            class="text-sm font-black tracking-tight flex items-baseline gap-1"
            :class="type === 'sales' ? 'text-blue-400' : 'text-emerald-400'"
          >
            {{ formatAmount(item.net_amount) }}
            <span class="text-[9px] font-bold opacity-60">جنيه</span>
          </div>
          <p class="text-[10px] font-bold text-gray-600 uppercase">
            {{ formatDate(item.invoice_date) }}
          </p>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center justify-center py-10 opacity-40">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-10 w-10 mb-2 text-gray-600"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p class="text-xs font-bold text-gray-500 italic">لا توجد سجلات حديثة</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: Array,
  type: String, // 'sales' or 'purchases'
  isLoading: Boolean,
})

// 🌟 دالة تنسيق المبالغ المالية الموحدة (إنجليزية + جنيه + ذكاء الأصفار)
const formatAmount = (val) => {
  if (val === undefined || val === null) return '0'

  const num = Number(val)
  // التحقق إذا كان الرقم صحيحاً أم يحتوي على كسر حقيقي
  const hasDecimals = num % 1 !== 0

  return num.toLocaleString('en-US', {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  })
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.group {
  animation: fadeIn 0.3s ease-in-out backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
