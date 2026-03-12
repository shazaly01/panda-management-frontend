<template>
  <div class="space-y-6 mt-8">
    <div
      class="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300"
    >
      <div class="text-center md:text-right">
        <p
          class="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2"
        >
          إجمالي الفاتورة
        </p>
        <p class="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
          {{ grandTotal.toFixed(2) }}
        </p>
      </div>

      <div>
        <AppInput
          id="paid-amount"
          label="المبلغ المدفوع للمورد (الآن)"
          type="number"
          step="0.01"
          min="0"
          :max="grandTotal"
          v-model.number="form.paid_amount"
          class="text-xl font-bold text-emerald-600 focus-within:ring-emerald-500/20"
          placeholder="0.00"
        />
      </div>

      <div class="text-center md:text-right">
        <p
          class="text-gray-500 dark:text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2"
        >
          المتبقي (يُسجل كآجل)
        </p>
        <p
          class="text-3xl font-extrabold transition-colors duration-300"
          :class="
            remainingBalance > 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
          "
        >
          {{ remainingBalance.toFixed(2) }}
        </p>
      </div>
    </div>

    <div
      v-if="form.paid_amount > 0"
      class="bg-emerald-50/50 dark:bg-emerald-900/10 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800/50 animate-fade-in-down"
    >
      <div class="w-full md:w-1/2">
        <TreasuriesDropdown
          id="treasury-id"
          label="من أي خزينة سيتم دفع المبلغ؟ (الخزينة/البنك)"
          v-model="form.treasury_id"
          :required="true"
        />
        <p v-if="errors?.treasury_id" class="text-rose-500 text-[10px] font-bold mt-1 mr-2">
          بما أنه تم دفع مبلغ، يجب تحديد الخزينة التي تم الصرف منها *
        </p>
      </div>
    </div>

    <div
      class="flex flex-col md:flex-row justify-end items-center gap-3 bg-gray-50 dark:bg-gray-800/80 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <AppButton
        type="button"
        variant="secondary"
        @click="$emit('cancel')"
        class="px-6 w-full md:w-auto"
      >
        إلغاء
      </AppButton>
      <AppButton
        type="submit"
        :disabled="isSaving"
        class="px-8 shadow-md bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500 w-full md:w-auto"
      >
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ واعتماد الفاتورة</span>
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import TreasuriesDropdown from '@/components/forms/TreasuriesDropdown.vue'

// استخدام defineModel لربط نموذج البيانات بالأب
const form = defineModel('form', { type: Object, required: true })

// الخصائص القادمة من الأب
const props = defineProps({
  errors: { type: Object, default: () => ({}) },
  grandTotal: { type: Number, required: true },
  isSaving: { type: Boolean, default: false },
})

defineEmits(['cancel'])

// حساب المتبقي تلقائياً
const remainingBalance = computed(() => {
  const total = Number(props.grandTotal) || 0
  const paid = Number(form.value.paid_amount) || 0
  return Math.max(0, total - paid)
})
</script>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 0.3s ease-out;
}
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.app-input-label) {
  @apply text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block mr-1;
}
</style>
