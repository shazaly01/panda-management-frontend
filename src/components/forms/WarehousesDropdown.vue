<!---->
<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="warehouses"
      option-label="name"
      option-value="id"
      :loading="loading"
      :required="required"
      :placeholder="placeholder"
    />
    <p v-if="error" class="text-sm text-red-500 mt-1">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWarehouseStore } from '@/stores/warehouseStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'المخزن' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر المخزن...' },
})

defineEmits(['update:modelValue'])

const warehouseStore = useWarehouseStore()
const { warehouses, loading } = storeToRefs(warehouseStore)
const error = ref(null)

onMounted(async () => {
  if (warehouses.value.length === 0) {
    try {
      await warehouseStore.fetchWarehouses()
    } catch (err) {
      error.value = 'فشل تحميل قائمة المخازن.'
      console.error('Failed to fetch warehouses for dropdown:', err)
    }
  }
})
</script>
