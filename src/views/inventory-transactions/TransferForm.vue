<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <h2 class="text-xl font-bold text-gray-800 dark:text-white mb-5 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
          />
        </svg>
        بيانات التحويل المخزني
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <AppInput
            id="trx-date"
            label="تاريخ التحويل"
            type="date"
            v-model="form.trx_date"
            :required="true"
          />
          <p v-if="errors.trx_date" class="text-rose-500 text-xs mt-1 font-bold">التاريخ مطلوب</p>
        </div>

        <div>
          <WarehousesDropdown
            id="from-warehouse-id"
            label="من مخزن (المُرسِل)"
            v-model="form.from_warehouse_id"
            :required="true"
          />
          <p v-if="errors.from_warehouse_id" class="text-rose-500 text-xs mt-1 font-bold">
            يجب تحديد المخزن المُرسل
          </p>
        </div>

        <div>
          <WarehousesDropdown
            id="to-warehouse-id"
            label="إلى مخزن (المُستلِم)"
            v-model="form.to_warehouse_id"
            :required="true"
          />
          <p v-if="errors.to_warehouse_id" class="text-rose-500 text-xs mt-1 font-bold">
            {{ sameWarehouseError ? 'لا يمكن التحويل لنفس المخزن' : 'يجب تحديد المخزن المُستلم' }}
          </p>
        </div>
      </div>

      <div class="mt-4">
        <AppInput
          id="notes"
          label="سبب التحويل / ملاحظات (اختياري)"
          v-model="form.notes"
          placeholder="أدخل أي ملاحظات حول سبب التحويل..."
        />
      </div>
    </div>

    <div
      class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
    >
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-bold text-gray-800 dark:text-white">الأصناف المراد تحويلها</h3>
        <button
          type="button"
          @click="addRow"
          class="flex items-center gap-1 bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-semibold"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
              clip-rule="evenodd"
            />
          </svg>
          إضافة صنف
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-sm text-right">
          <thead
            class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
          >
            <tr>
              <th scope="col" class="px-3 py-3 w-1/3">الصنف</th>
              <th scope="col" class="px-3 py-3 w-1/4">الوحدة</th>
              <th scope="col" class="px-3 py-3 w-1/4">الكمية المحولة</th>
              <th scope="col" class="px-3 py-3 w-16 text-center">إجراء</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(row, index) in items"
              :key="index"
              class="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
            >
              <td class="p-2">
                <ItemsDropdown :id="`item-${index}`" v-model="row.item_id" />
                <p v-if="errors[`item_${index}`]" class="text-rose-500 text-xs mt-1">مطلوب</p>
              </td>

              <td class="p-2">
                <UnitsDropdown :id="`unit-${index}`" v-model="row.unit_id" />
                <p v-if="errors[`unit_${index}`]" class="text-rose-500 text-xs mt-1">مطلوب</p>
              </td>

              <td class="p-2">
                <input
                  type="number"
                  step="0.01"
                  min="0.0001"
                  v-model.number="row.qty"
                  class="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <p v-if="errors[`qty_${index}`]" class="text-rose-500 text-xs mt-1">
                  كمية غير صالحة
                </p>
              </td>

              <td class="p-2 text-center">
                <button
                  type="button"
                  @click="removeRow(index)"
                  class="text-rose-500 hover:text-rose-700 transition-colors p-1"
                  title="حذف السطر"
                  :disabled="items.length === 1"
                  :class="{ 'opacity-50 cursor-not-allowed': items.length === 1 }"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <p v-if="errors.items_empty" class="text-rose-500 text-sm mt-3 font-bold text-center">
          يجب إضافة صنف واحد على الأقل لعملية التحويل.
        </p>
      </div>
    </div>

    <div
      class="flex justify-end items-center bg-gray-50 dark:bg-gray-800/80 p-6 rounded-xl border border-gray-200 dark:border-gray-700"
    >
      <div class="flex gap-3">
        <AppButton type="button" variant="secondary" @click="handleCancel" class="px-6"
          >إلغاء</AppButton
        >
        <AppButton
          type="submit"
          :disabled="isSaving"
          class="px-8 shadow-md bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
        >
          <span v-if="isSaving">جاري الحفظ...</span>
          <span v-else>تنفيذ التحويل</span>
        </AppButton>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import WarehousesDropdown from '@/components/forms/WarehousesDropdown.vue'
import ItemsDropdown from '@/components/forms/ItemsDropdown.vue'
import UnitsDropdown from '@/components/forms/UnitsDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const form = reactive({
  id: null,
  trx_date: new Date().toISOString().split('T')[0],
  from_warehouse_id: '',
  to_warehouse_id: '',
  notes: '',
})

const items = ref([])

const createEmptyRow = () => ({
  item_id: '',
  unit_id: '',
  qty: 1,
})

items.value.push(createEmptyRow())

const errors = reactive({
  trx_date: false,
  from_warehouse_id: false,
  to_warehouse_id: false,
  items_empty: false,
})

// متغير لتتبع خطأ تشابه المخازن
const sameWarehouseError = ref(false)

const addRow = () => {
  items.value.push(createEmptyRow())
}

const removeRow = (index) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  }
}

const handleSubmit = () => {
  // تصفير الأخطاء
  errors.trx_date = false
  errors.from_warehouse_id = false
  errors.to_warehouse_id = false
  errors.items_empty = false
  sameWarehouseError.value = false

  Object.keys(errors).forEach((key) => {
    if (
      key.includes('_') &&
      !['from_warehouse_id', 'to_warehouse_id', 'trx_date', 'items_empty'].includes(key)
    ) {
      errors[key] = false
    }
  })

  let hasError = false

  // التحقق من الترويسة
  if (!form.trx_date) {
    errors.trx_date = true
    hasError = true
  }
  if (!form.from_warehouse_id) {
    errors.from_warehouse_id = true
    hasError = true
  }
  if (!form.to_warehouse_id) {
    errors.to_warehouse_id = true
    hasError = true
  }

  // التحقق من أن المخازن غير متشابهة
  if (
    form.from_warehouse_id &&
    form.to_warehouse_id &&
    form.from_warehouse_id === form.to_warehouse_id
  ) {
    errors.to_warehouse_id = true
    sameWarehouseError.value = true
    hasError = true
  }

  // فلترة الأسطر الصالحة
  const validItems = items.value.filter((row) => row.item_id || row.unit_id || row.qty > 1)

  if (validItems.length === 0) {
    errors.items_empty = true
    hasError = true
  } else {
    validItems.forEach((row, index) => {
      const originalIndex = items.value.indexOf(row)

      if (!row.item_id) {
        errors[`item_${originalIndex}`] = true
        hasError = true
      }
      if (!row.unit_id) {
        errors[`unit_${originalIndex}`] = true
        hasError = true
      }
      if (!row.qty || row.qty < 0.0001) {
        errors[`qty_${originalIndex}`] = true
        hasError = true
      }
    })
  }

  if (hasError) return

  // تجهيز البيانات للإرسال
  const payload = {
    ...form,
    items: validItems.map((row) => ({
      item_id: row.item_id,
      unit_id: row.unit_id,
      qty: Number(row.qty),
    })),
  }

  emit('submit', payload)
}

const handleCancel = () => {
  emit('cancel')
}
</script>
