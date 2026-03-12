<template>
  <div>
    <AppDropdown
      :id="id"
      :label="showLabel ? label : ''"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="units"
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
import { useUnitStore } from '@/stores/unitStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'الوحدة' },

  // 🌟 إضافة هذه الخاصية لاستقبال أمر الإخفاء من المكون الأب
  showLabel: { type: Boolean, default: true },

  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر الوحدة...' },
})

defineEmits(['update:modelValue'])

const unitStore = useUnitStore()
const { units, loading } = storeToRefs(unitStore)
const error = ref(null)

onMounted(async () => {
  // جلب البيانات إذا لم تكن موجودة مسبقاً
  if (units.value.length === 0) {
    try {
      await unitStore.fetchUnits()
    } catch (err) {
      error.value = 'فشل تحميل قائمة الوحدات.'
      console.error('Failed to fetch units for dropdown:', err)
    }
  }
})
</script>
