<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
  >
    <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 text-emerald-500"
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
      بيانات فاتورة المشتريات
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div>
        <AppInput
          id="trx-date"
          label="تاريخ الفاتورة"
          type="date"
          v-model="form.trx_date"
          :required="true"
        />
        <p v-if="errors.trx_date" class="text-rose-500 text-xs mt-1 font-bold">التاريخ مطلوب</p>
      </div>

      <div>
        <PartnersDropdown
          id="partner-id"
          label="المورد"
          v-model="form.partner_id"
          :required="true"
        />
        <p v-if="errors.partner_id" class="text-rose-500 text-xs mt-1 font-bold">
          يجب تحديد المورد
        </p>
      </div>

      <div>
        <WarehousesDropdown
          id="warehouse-id"
          label="المخزن المستلم (دخول البضاعة)"
          v-model="form.warehouse_id"
          :required="true"
        />
        <p v-if="errors.warehouse_id" class="text-rose-500 text-xs mt-1 font-bold">
          يجب تحديد المخزن
        </p>
      </div>

      <div>
        <TreasuriesDropdown
          id="treasury-id"
          label="تُسدد من خزينة (اختياري)"
          v-model="form.treasury_id"
        />
      </div>
    </div>

    <div class="mt-4">
      <AppInput
        id="notes"
        label="ملاحظات الفاتورة (اختياري)"
        v-model="form.notes"
        placeholder="أدخل أي ملاحظات، مثلاً: رقم فاتورة المورد الورقية..."
      />
    </div>
  </div>
</template>

<script setup>
import AppInput from '@/components/ui/AppInput.vue'
import PartnersDropdown from '@/components/forms/PartnersDropdown.vue'
import WarehousesDropdown from '@/components/forms/WarehousesDropdown.vue'
import TreasuriesDropdown from '@/components/forms/TreasuriesDropdown.vue'

// ربط كائن form بالمكون الأب
const form = defineModel('form', { type: Object, required: true })

// استقبال الأخطاء لعرضها
defineProps({
  errors: { type: Object, required: true },
})
</script>
