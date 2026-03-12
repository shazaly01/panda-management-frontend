<template>
  <AppTable :headers="headers" :items="units" :is-loading="isLoading" :row-clickable="false">
    <template #cell-is_active="{ item }">
      <span
        :class="item.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
        class="px-2.5 py-0.5 rounded-full text-xs font-medium"
      >
        {{ item.is_active ? 'نشط' : 'معطل' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="space-x-2 space-x-reverse">
        <button
          v-if="can('unit.update')"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:underline"
        >
          تعديل
        </button>
        <button
          v-if="can('unit.delete')"
          @click="$emit('delete', item.id)"
          class="text-red-600 hover:underline"
        >
          حذف
        </button>
      </div>
    </template>
  </AppTable>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import AppTable from '@/components/ui/AppTable.vue'

defineProps({
  units: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

const { can } = useAuthStore()

// تعريف أعمدة الجدول
const headers = ref([
  { key: 'id', label: 'رقم الوحدة' },
  { key: 'name', label: 'اسم الوحدة' },
  { key: 'is_active', label: 'الحالة' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center' },
])
</script>
