<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="items"
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
import { useItemStore } from '@/stores/ItemStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'الصنف' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر الصنف...' },
})

defineEmits(['update:modelValue'])

const itemStore = useItemStore()
const { items, loading } = storeToRefs(itemStore)
const error = ref(null)

onMounted(async () => {
  if (items.value.length === 0) {
    try {
      await itemStore.fetchItems()
    } catch (err) {
      error.value = 'فشل تحميل قائمة الأصناف.'
      console.error('Failed to fetch items for dropdown:', err)
    }
  }
})
</script>
