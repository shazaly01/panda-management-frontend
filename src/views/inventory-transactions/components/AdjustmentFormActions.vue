<template>
  <div
    class="flex justify-end items-center bg-gray-50 dark:bg-gray-800/80 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
  >
    <div class="flex gap-3">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" class="px-6">
        إلغاء
      </AppButton>
      <AppButton
        type="submit"
        :disabled="isSaving"
        class="px-8 shadow-md bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
      >
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>تنفيذ التسوية</span>
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from '@/components/ui/AppButton.vue'

// استقبال حالة الحفظ من المكون الأب
defineProps({
  isSaving: { type: Boolean, default: false },
})

// إرسال حدث الإلغاء للأب
defineEmits(['cancel'])
</script>
