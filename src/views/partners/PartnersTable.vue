<template>
  <AppTable :headers="headers" :items="partners" :is-loading="isLoading" :row-clickable="false">
    <template #cell-type_label="{ item }">
      <span
        :class="
          item.type === 'customer' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
        "
        class="px-2.5 py-0.5 rounded text-xs font-semibold"
      >
        {{ item.type_label || item.type }}
      </span>
    </template>

    <template #cell-current_balance="{ item }">
      <span dir="ltr" class="font-bold text-gray-700 dark:text-gray-300">
        {{ Number(item.current_balance || 0).toFixed(2) }}
      </span>
    </template>

    <template #cell-is_active="{ item }">
      <span :class="item.is_active ? 'text-green-600' : 'text-red-600'" class="text-xs font-bold">
        {{ item.is_active ? 'نشط' : 'معطل' }}
      </span>
    </template>

    <template #cell-actions="{ item }">
      <div class="space-x-2 space-x-reverse">
        <button
          v-if="can('partner.update')"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:underline"
        >
          تعديل
        </button>
        <button
          v-if="can('partner.delete')"
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
  partners: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

const { can } = useAuthStore()

const headers = ref([
  { key: 'id', label: 'الرقم', class: 'w-24' },
  { key: 'name', label: 'اسم الشريك' },
  { key: 'type_label', label: 'النوع' },
  { key: 'phone', label: 'رقم الهاتف' },
  { key: 'current_balance', label: 'الرصيد الحالي', class: 'text-left', cellClass: 'text-left' },
  { key: 'is_active', label: 'الحالة', class: 'text-center', cellClass: 'text-center' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center' },
])
</script>
