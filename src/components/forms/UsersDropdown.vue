<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="users"
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
// افترضت أن لديك store باسم userStore، قم بتعديل المسار إذا كان مختلفاً
import { useUserStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

const props = defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'المستخدم' },
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر المستخدم...' },
})

defineEmits(['update:modelValue'])

const userStore = useUserStore()
const { users, loading } = storeToRefs(userStore)
const error = ref(null)

onMounted(async () => {
  // جلب البيانات إذا لم تكن موجودة مسبقاً
  if (users.value.length === 0) {
    try {
      // نعتمد على دالة الجلب الموجودة في الـ Store الخاص بالمستخدمين
      await userStore.fetchUsers()
    } catch (err) {
      error.value = 'فشل تحميل قائمة المستخدمين.'
      console.error('Failed to fetch users for dropdown:', err)
    }
  }
})
</script>
