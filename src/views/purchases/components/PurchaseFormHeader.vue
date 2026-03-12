<template>
  <div
    class="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300"
  >
    <div class="flex items-center gap-3 mb-8 border-b border-gray-50 dark:border-gray-800 pb-5">
      <div class="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-emerald-600 dark:text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>
      <div>
        <h2 class="text-xl font-black text-gray-800 dark:text-white">
          البيانات الأساسية للمشتريات
        </h2>
        <p class="text-xs text-gray-400 mt-1 font-medium">
          قم بتعبئة بيانات المورد والمخزن وتحديد ما إذا كان طلب شراء أم إدخال فعلي
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
      <div class="space-y-1">
        <AppInput
          id="trx-date"
          label="تاريخ الفاتورة / الطلب"
          type="date"
          v-model="form.trx_date"
          :required="true"
          class="focus-within:ring-2 focus-within:ring-emerald-500/20"
        />
        <p v-if="errors.trx_date" class="text-rose-500 text-[10px] font-bold mr-2">
          هذا الحقل مطلوب *
        </p>
      </div>

      <div class="space-y-1">
        <PartnersDropdown
          id="partner-id"
          label="المورد"
          v-model="form.partner_id"
          :required="true"
        />
        <p v-if="errors.partner_id" class="text-rose-500 text-[10px] font-bold mr-2">
          يجب تحديد المورد *
        </p>
      </div>

      <div class="space-y-1">
        <WarehousesDropdown
          id="warehouse-id"
          label="المخزن المستلم"
          v-model="form.warehouse_id"
          :required="true"
        />
        <p v-if="errors.warehouse_id" class="text-rose-500 text-[10px] font-bold mr-2">
          يجب تحديد المخزن *
        </p>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mr-1">
          حالة العملية (التأثير المخزني والمالي)
        </label>
        <div
          class="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/80 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700"
        >
          <label
            class="flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all duration-300"
            :class="[
              form.status === 'draft'
                ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 shadow-sm'
                : 'bg-transparent text-gray-500',
              form.paid_amount > 0
                ? 'opacity-40 cursor-not-allowed grayscale'
                : 'cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700',
            ]"
            :title="form.paid_amount > 0 ? 'لا يمكن اختيار طلب شراء لوجود دفعة مالية للمورد' : ''"
          >
            <input
              type="radio"
              v-model="form.status"
              value="draft"
              class="hidden"
              :disabled="form.paid_amount > 0"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span class="font-bold text-[11px] sm:text-xs">طلب شراء (PO)</span>
          </label>

          <label
            class="flex-1 flex items-center justify-center gap-1.5 cursor-pointer py-2 px-2 rounded-lg transition-all duration-300"
            :class="
              form.status === 'confirmed'
                ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 shadow-sm'
                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-500'
            "
          >
            <input type="radio" v-model="form.status" value="confirmed" class="hidden" />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span class="font-bold text-[11px] sm:text-xs">إدخال فعلي</span>
          </label>
        </div>

        <p
          v-if="form.paid_amount > 0"
          class="text-[10px] font-bold text-amber-600 dark:text-amber-500 mt-1 mr-1 flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-3 w-3"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clip-rule="evenodd"
            />
          </svg>
          تم اختيار "إدخال فعلي" إجبارياً لوجود دفعة مالية للمورد.
        </p>
      </div>
    </div>

    <div class="mt-10 pt-6 border-t border-gray-50 dark:border-gray-800">
      <div class="relative group">
        <div
          class="absolute right-3 top-3 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
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
          label="ملاحظات وتوصيات إضافية"
          v-model="form.notes"
          placeholder="اكتب أي شروط استلام، أو رقم فاتورة المورد الورقية للرجوع إليها..."
          class="pr-10"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppInput from '@/components/ui/AppInput.vue'
import PartnersDropdown from '@/components/forms/PartnersDropdown.vue'
import WarehousesDropdown from '@/components/forms/WarehousesDropdown.vue'

// استقبال الموديل والأخطاء
const form = defineModel('form', { type: Object, required: true })

defineProps({
  errors: { type: Object, required: true },
})
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
