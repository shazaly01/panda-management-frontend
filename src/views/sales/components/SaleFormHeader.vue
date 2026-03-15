<template>
  <div
    class="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all duration-300"
  >
    <div class="flex items-center gap-4 mb-8 border-b border-gray-50 dark:border-gray-800 pb-5">
      <div class="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-indigo-600 dark:text-indigo-400"
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
      </div>
      <div>
        <h2 class="text-xl font-black text-gray-800 dark:text-white leading-none">
          بيانات الفاتورة
        </h2>
      </div>
    </div>

    <div class="space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-12 gap-x-8 items-center">
        <div class="md:col-span-3">
          <PartnersDropdown
            id="partner-id"
            label="العميل (الحساب)"
            v-model="form.partner_id"
            :required="true"
          />
          <p v-if="errors.partner_id" class="text-rose-500 text-[10px] font-bold mt-1 mr-1">
            مطلوب *
          </p>
        </div>

        <div class="md:col-span-6">
          <AppInput
            id="walk-in-name"
            label="اسم العميل المباشر (نقدي)"
            v-model="form.walk_in_customer_name"
            placeholder="للمبيعات النقدية السريعة..."
          />
        </div>

        <div class="md:col-span-3">
          <AppInput
            id="trx-date"
            label="تاريخ الفاتورة"
            type="date"
            v-model="form.trx_date"
            :required="true"
          />
          <p v-if="errors.trx_date" class="text-rose-500 text-[10px] font-bold mt-1 mr-1">
            مطلوب *
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-12 gap-x-8 items-center">
        <div class="md:col-span-3">
          <WarehousesDropdown
            id="warehouse-id"
            label="مركز الصرف (المخزن)"
            v-model="form.warehouse_id"
            :required="true"
          />
          <p v-if="errors.warehouse_id" class="text-rose-500 text-[10px] font-bold mt-1 mr-1">
            مطلوب *
          </p>
        </div>

        <div class="md:col-span-6">
          <AppInput
            id="shipping-dest"
            label="عنوان / وجهة الشحن"
            v-model="form.shipping_destination"
            placeholder="أدخل عنوان التسليم بالتفصيل..."
          />
        </div>

        <div class="md:col-span-3 space-y-2">
          <label class="text-xs font-bold text-gray-500 dark:text-gray-400 block mr-1 mb-1">
            حالة الفاتورة
          </label>
          <div
            class="flex h-[42px] items-center gap-1 bg-gray-50 dark:bg-gray-800/80 p-1 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <label
              class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 text-xs font-bold"
              :class="[
                form.status === 'draft'
                  ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-gray-400',
                form.paid_amount > 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
              ]"
            >
              <input
                type="radio"
                v-model="form.status"
                value="draft"
                class="hidden"
                :disabled="form.paid_amount > 0"
              />
              <span>مبدئية</span>
            </label>

            <label
              class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg transition-all duration-300 cursor-pointer text-xs font-bold"
              :class="
                form.status === 'confirmed'
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 shadow-sm'
                  : 'text-gray-400'
              "
            >
              <input type="radio" v-model="form.status" value="confirmed" class="hidden" />
              <span>نهائية</span>
            </label>
          </div>
        </div>
      </div>

      <div class="pt-4 border-t border-gray-50 dark:border-gray-800">
        <div class="relative group">
          <div
            class="absolute right-3 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none"
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
            placeholder="اكتب أي تعليمات تظهر في المطبوع..."
            class="pr-10"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppInput from '@/components/ui/AppInput.vue'
import PartnersDropdown from '@/components/forms/PartnersDropdown.vue'
import WarehousesDropdown from '@/components/forms/WarehousesDropdown.vue'
import DesignersDropdown from '@/components/forms/DesignersDropdown.vue'
// تم إزالة استيراد TreasuriesDropdown لأنه لم يعد مستخدماً هنا

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

/* تنسيق الأبعاد للعناصر المضافة */
.sale-header-container {
  /* ... */
}

.flex-item-date {
  width: 150px;
}

.flex-item-partner {
  width: 250px;
}

.flex-item-walk-in {
  flex-grow: 1;
}

.flex-item-warehouse {
  width: 200px;
}

.flex-item-status {
  width: 180px;
}

.flex-item-shipping {
  flex-grow: 1;
}

.flex-item-notes {
  width: 100%;
}
</style>
