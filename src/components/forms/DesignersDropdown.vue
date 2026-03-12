<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="designers"
      option-label="full_name"
      option-value="id"
      :loading="designersLoading"
      :required="required"
      :placeholder="placeholder"
    />
    <p v-if="error" class="text-[10px] text-red-500 mt-1 font-bold">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'المصمم' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر المصمم...' },
})

defineEmits(['update:modelValue'])

const userStore = useUserStore()
const { designers, designersLoading } = storeToRefs(userStore)
const error = ref(null)

onMounted(async () => {
  // جلب المصممين فقط إذا كانت القائمة فارغة
  if (designers.value.length === 0) {
    try {
      await userStore.fetchDesigners()
    } catch (err) {
      error.value = 'فشل تحميل قائمة المصممين.'
    }
  }
})
</script>
