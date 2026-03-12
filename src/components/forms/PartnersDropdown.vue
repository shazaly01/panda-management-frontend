<!--src\components\forms\PartnersDropdown.vue-->
<template>
  <div>
    <AppDropdown
      :id="id"
      :label="label"
      :model-value="modelValue"
      @update:model-value="$emit('update:modelValue', $event)"
      :options="partners"
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
import { usePartnerStore } from '@/stores/partnerStore'
import { storeToRefs } from 'pinia'
import AppDropdown from '@/components/ui/AppDropdown.vue'

defineProps({
  id: { type: String, required: true },
  label: { type: String, default: 'الشريك' }, // يمكن تمرير "العميل" أو "المورد" كـ prop عند الاستخدام
  modelValue: { type: [String, Number], default: '' },
  required: { type: Boolean, default: false },
  placeholder: { type: String, default: 'اختر الشريك...' },
})

defineEmits(['update:modelValue'])

const partnerStore = usePartnerStore()
const { partners, loading } = storeToRefs(partnerStore)
const error = ref(null)

onMounted(async () => {
  if (partners.value.length === 0) {
    try {
      await partnerStore.fetchPartners()
    } catch (err) {
      error.value = 'فشل تحميل قائمة الشركاء.'
      console.error('Failed to fetch partners for dropdown:', err)
    }
  }
})
</script>
