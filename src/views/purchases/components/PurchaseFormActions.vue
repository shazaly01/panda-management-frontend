<template>
  <div
    class="flex flex-col md:flex-row justify-between items-center bg-gray-50 dark:bg-gray-800/80 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
  >
    <div class="mb-4 md:mb-0 text-center md:text-right">
      <p
        class="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1"
      >
        إجمالي المشتريات
      </p>
      <p class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
        {{ grandTotal.toFixed(2) }}
      </p>
    </div>

    <div class="flex gap-3">
      <AppButton type="button" variant="secondary" @click="$emit('cancel')" class="px-6">
        إلغاء
      </AppButton>
      <AppButton
        type="submit"
        :disabled="isSaving"
        class="px-8 shadow-md bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
      >
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ واعتماد الفاتورة</span>
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from '@/components/ui/AppButton.vue'

// استقبال الإجمالي العام وحالة الحفظ من المكون الأب
defineProps({
  grandTotal: { type: Number, required: true },
  isSaving: { type: Boolean, default: false },
})

// إرسال حدث الإلغاء للأب
defineEmits(['cancel'])
</script>
