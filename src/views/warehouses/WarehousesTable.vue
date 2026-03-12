<template>
  <AppTable :headers="headers" :items="warehouses" :is-loading="isLoading" :row-clickable="false">
    <template #cell-location="{ item }">
      <span class="text-text-secondary">{{ item.location || 'غير محدد' }}</span>
    </template>

    <template #cell-keeper_name="{ item }">
      <span class="text-text-secondary">{{ item.keeper_name || '---' }}</span>
    </template>

    <template #cell-actions="{ item }">
      <div class="space-x-2 space-x-reverse">
        <button
          v-if="can('warehouse.update')"
          @click="$emit('edit', item)"
          class="text-blue-600 hover:underline"
        >
          تعديل
        </button>
        <button
          v-if="can('warehouse.delete')"
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
  warehouses: { type: Array, required: true },
  isLoading: { type: Boolean, default: false },
})

defineEmits(['edit', 'delete'])

const { can } = useAuthStore()

const headers = ref([
  { key: 'id', label: 'الرقم' },
  { key: 'name', label: 'المخزن' },
  { key: 'location', label: 'الموقع' },
  { key: 'keeper_name', label: 'أمين المخزن' },
  { key: 'actions', label: 'الإجراءات', class: 'text-center', cellClass: 'text-center' },
])
</script>
