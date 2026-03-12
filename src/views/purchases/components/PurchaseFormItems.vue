<template>
  <div
    class="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
  >
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-800 dark:text-white">تفاصيل الأصناف المشتراة</h3>
      <button
        type="button"
        @click="addRow"
        class="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-3 py-2 rounded-lg hover:bg-emerald-100 transition-colors text-sm font-semibold"
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
            <th scope="col" class="px-3 py-3 w-1/4">الصنف</th>
            <th scope="col" class="px-3 py-3 w-1/6">الوحدة</th>
            <th scope="col" class="px-3 py-3 w-32">الكمية</th>
            <th scope="col" class="px-3 py-3 w-32">سعر الشراء</th>
            <th scope="col" class="px-3 py-3 w-32">الإجمالي</th>
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
                step="any"
                v-model.number="row.qty"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="errors[`qty_${index}`]" class="text-rose-500 text-xs mt-1">كمية غير صالحة</p>
            </td>

            <td class="p-2">
              <input
                type="number"
                step="0.01"
                min="0"
                v-model.number="row.price"
                class="w-full p-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
              <p v-if="errors[`price_${index}`]" class="text-rose-500 text-xs mt-1">سعر غير صالح</p>
            </td>

            <td class="p-2 font-bold text-gray-800 dark:text-white">
              {{ calculateRowTotal(row).toFixed(2) }}
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
        يجب إضافة صنف واحد على الأقل لفاتورة المشتريات.
      </p>
    </div>
  </div>
</template>

<script setup>
import ItemsDropdown from '@/components/forms/ItemsDropdown.vue'
import UnitsDropdown from '@/components/forms/UnitsDropdown.vue'

// ربط مصفوفة الأصناف بالمكون الأب
const items = defineModel({ type: Array, required: true })

// استقبال الأخطاء لعرضها
defineProps({
  errors: { type: Object, required: true },
})

const createEmptyRow = () => ({
  item_id: '',
  unit_id: '',
  qty: 1,
  price: 0,
})

const addRow = () => {
  items.value.push(createEmptyRow())
}

const removeRow = (index) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  }
}

// دالة حساب إجمالي السطر الواحد (الكمية × السعر)
const calculateRowTotal = (row) => {
  const qty = parseFloat(row.qty) || 0
  const price = parseFloat(row.price) || 0
  return qty * price
}
</script>
