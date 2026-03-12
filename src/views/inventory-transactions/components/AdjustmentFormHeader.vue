<template>
  <div
    class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300"
  >
    <div class="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-5">
      <div class="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-amber-600 dark:text-amber-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
          />
        </svg>
      </div>
      <div>
        <h2 class="text-xl font-black text-gray-800 dark:text-white">
          البيانات الأساسية للتسوية الجردية
        </h2>
        <p class="text-xs text-gray-400 mt-1 font-medium">
          قم بتحديد التاريخ، المخزن المراد جرده، ونوع التسوية (زيادة أو عجز)
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-8">
      <div class="space-y-1">
        <AppInput
          id="trx-date"
          label="تاريخ التسوية"
          type="date"
          v-model="form.trx_date"
          :required="true"
          class="focus-within:ring-2 focus-within:ring-amber-500/20"
        />
        <p v-if="errors.trx_date" class="text-rose-500 text-[10px] font-bold mr-2">
          هذا الحقل مطلوب *
        </p>
      </div>

      <div class="space-y-1">
        <WarehousesDropdown
          id="warehouse-id"
          label="المخزن المراد تسويته"
          v-model="form.warehouse_id"
          :required="true"
        />
        <p v-if="errors.warehouse_id" class="text-rose-500 text-[10px] font-bold mr-2">
          يجب تحديد المخزن *
        </p>
      </div>

      <div class="space-y-1">
        <AppDropdown
          id="trx-type"
          label="نوع التسوية"
          v-model="form.trx_type"
          :options="adjustmentTypes"
          option-label="name"
          option-value="id"
          :required="true"
        />
        <p v-if="errors.trx_type" class="text-rose-500 text-[10px] font-bold mr-2">
          يجب تحديد نوع التسوية *
        </p>
      </div>
    </div>

    <div class="mt-10 pt-6 border-t border-gray-50 dark:border-gray-800">
      <div class="relative group">
        <div
          class="absolute right-3 top-3 text-gray-400 group-focus-within:text-amber-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        </div>
        <AppInput
          id="notes"
          label="سبب التسوية / ملاحظات (اختياري)"
          v-model="form.notes"
          placeholder="أدخل سبب التسوية، مثلاً: عجز بعد الجرد السنوي، أو تلف بضاعة..."
          class="pr-10 focus-within:ring-2 focus-within:ring-amber-500/20"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import WarehousesDropdown from '@/components/forms/WarehousesDropdown.vue'

// ربط كائن form بالمكون الأب
const form = defineModel('form', { type: Object, required: true })

// استقبال الأخطاء لعرضها
defineProps({
  errors: { type: Object, required: true },
})

// أنواع التسوية
const adjustmentTypes = ref([
  { id: 'adjustment_in', name: 'تسوية بزيادة (إدخال للمخزن)' },
  { id: 'adjustment_out', name: 'تسوية بعجز (إخراج من المخزن)' },
])
</script>

<style scoped>
/* تحسين شكل حقول الإدخال لتتناسب مع التصميم الجديد */
:deep(.app-input-label) {
  @apply text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 block mr-1;
}

:deep(input),
:deep(select) {
  @apply rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200;
}
</style>
