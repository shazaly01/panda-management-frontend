<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="categoryList"
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
import { useCategoryStore } from '@/stores/categoryStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'التصنيف' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر التصنيف...' },
})

defineEmits(['update:modelValue'])

const categoryStore = useCategoryStore()
// نستخدم categoryList بدلاً من categories المخصصة للجدول
const { categoryList, loading } = storeToRefs(categoryStore)
const error = ref(null)

onMounted(async () => {
  if (categoryList.value.length === 0) {
    try {
      // نستخدم الدالة المخصصة لجلب القائمة المسطحة (بدون Pagination)
      await categoryStore.fetchCategoryList()
    } catch (err) {
      error.value = 'فشل تحميل قائمة التصنيفات.'
      console.error('Failed to fetch category list for dropdown:', err)
    }
  }
})
</script>
