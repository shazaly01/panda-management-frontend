<template>
  <div class="space-y-4">
    <div v-if="isLoading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="h-12 bg-surface-ground animate-pulse rounded-lg"></div>
    </div>

    <div v-else-if="items && items.length > 0" class="divide-y divide-surface-border">
      <div
        v-for="item in items"
        :key="item.id"
        class="py-3 flex items-center justify-between group"
      >
        <div class="flex items-center gap-3">
          <div
            :class="
              type === 'sales' ? 'bg-blue-100 text-blue-600' : 'bg-emerald-100 text-emerald-600'
            "
            class="p-2 rounded-lg transition-transform group-hover:scale-110"
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
                stroke-width="2"
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
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
                stroke-width="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <div>
            <p class="text-sm font-bold text-text-primary">#{{ item.trx_no }}</p>
            <p class="text-xs text-text-muted">{{ item.partner?.name }}</p>
          </div>
        </div>
        <div class="text-left">
          <p class="text-sm font-extrabold text-text-primary">
            {{ Number(item.net_amount).toFixed(2) }}
          </p>
          <p class="text-[10px] text-text-muted">{{ formatDate(item.invoice_date) }}</p>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-6 text-text-muted text-sm">لا توجد حركات مؤخراً</div>
  </div>
</template>

<script setup>
defineProps({
  items: Array,
  type: String, // 'sales' or 'purchases'
  isLoading: Boolean,
})

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })
}
</script>
