<!--src\components\forms\TreasuriesDropdown.vue-->
<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="treasuries"
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
import { useTreasuryStore } from '@/stores/treasuryStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'الخزينة/البنك' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر الخزينة...' },
})

defineEmits(['update:modelValue'])

const treasuryStore = useTreasuryStore()
const { treasuries, loading } = storeToRefs(treasuryStore)
const error = ref(null)

onMounted(async () => {
  if (treasuries.value.length === 0) {
    try {
      await treasuryStore.fetchTreasuries()
    } catch (err) {
      error.value = 'فشل تحميل قائمة الخزائن.'
      console.error('Failed to fetch treasuries for dropdown:', err)
    }
  }
})
</script>
