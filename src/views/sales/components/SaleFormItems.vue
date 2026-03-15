<!--src\views\sales\components\SaleFormItems.vue-->
<template>
  <div
    class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
  >
    <div
      class="mb-8 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800/80 rounded-xl border border-blue-100/50 dark:border-gray-700 shadow-inner"
    >
      <label class="flex items-center text-sm font-bold text-indigo-900 dark:text-indigo-300 mb-3">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 ml-2 text-indigo-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
          />
        </svg>
        إضافة صنف سريع (ابحث بالاسم أو مرر الباركود)
      </label>

      <div class="w-full md:w-3/4 relative z-50">
        <SmartSearchGrid
          :data="availableItems"
          :columns="searchColumns"
          :search-keys="['name', 'code', 'barcode']"
          placeholder="ابحث هنا لإضافة الصنف فوراً للفاتورة..."
          @select="handleItemSelected"
        />
      </div>
    </div>

    <div class="flex justify-between items-center mb-4 px-1">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 ml-2 text-emerald-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
          />
        </svg>
        تفاصيل الفاتورة
      </h3>
    </div>

    <div class="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
      <table class="w-full text-sm text-right bg-white dark:bg-gray-800">
        <thead
          class="text-xs text-gray-600 uppercase bg-gray-50/80 dark:bg-gray-700/50 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
        >
          <tr>
            <th scope="col" class="px-4 py-4 font-bold w-1/4">الصنف</th>
            <th scope="col" class="px-2 py-4 font-bold w-24">الوحدة</th>
            <th scope="col" class="px-2 py-4 font-bold w-32">البيان</th>
            <th scope="col" class="px-2 py-4 font-bold w-20 text-center">الطول</th>
            <th scope="col" class="px-2 py-4 font-bold w-20 text-center">العرض</th>
            <th scope="col" class="px-2 py-4 font-bold w-24 text-center">الأمتار</th>
            <th scope="col" class="px-2 py-4 font-bold w-24 text-center">الكمية</th>
            <th scope="col" class="px-2 py-4 font-bold w-28 text-center">السعر</th>
            <th scope="col" class="px-4 py-4 font-bold w-32 text-center">الإجمالي</th>
            <th scope="col" class="px-2 py-4 font-bold w-12 text-center">إجراء</th>
          </tr>
        </thead>

        <TransitionGroup
          tag="tbody"
          name="list"
          class="divide-y divide-gray-100 dark:divide-gray-700"
        >
          <tr
            v-for="(row, index) in items"
            :key="row.item_id ? `item-${row.item_id}-${index}` : `empty-${index}`"
            class="hover:bg-indigo-50/30 dark:hover:bg-gray-700/30 transition-all duration-200 group"
          >
            <td class="px-4 py-3 align-middle">
              <div v-if="row.item_id" class="flex flex-col">
                <span class="font-bold text-gray-900 dark:text-white text-sm">
                  {{ resolveItemName(row.item_id) }}
                </span>
                <span class="text-xs text-indigo-400 font-mono mt-0.5">
                  ID: {{ row.item_id }}
                </span>
              </div>
              <div v-else class="text-gray-400 text-xs text-right py-2 italic flex items-center">
                <span class="w-2 h-2 rounded-full bg-gray-300 ml-2 animate-pulse"></span>
                في انتظار إضافة صنف...
              </div>
            </td>
            <td class="px-2 py-2 align-middle">
              <div class="relative">
                <UnitsDropdown
                  :id="`unit-${index}`"
                  v-model="row.unit_id"
                  :show-label="false"
                  class="w-full bg-transparent border-0 border-b border-transparent hover:border-gray-300 focus:ring-0 focus:border-indigo-500 p-1 text-sm transition-colors"
                />
              </div>
              <p v-if="errors[`items.${index}.unit_id`]" class="text-rose-500 text-xs mt-1">
                مطلوب
              </p>
            </td>

            <td class="px-2 py-2 align-middle">
              <input
                type="text"
                v-model="row.description"
                placeholder="ملاحظات..."
                class="w-full p-2 bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-lg transition-all text-sm dark:text-white"
              />
            </td>

            <td class="px-2 py-2 align-middle">
              <input
                type="number"
                step="0.01"
                min="0"
                v-model.number="row.length"
                placeholder="-"
                class="w-full p-2 text-center bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-lg transition-all text-sm font-medium dark:text-white"
              />
            </td>

            <td class="px-2 py-2 align-middle">
              <input
                type="number"
                step="0.01"
                min="0"
                v-model.number="row.width"
                placeholder="-"
                class="w-full p-2 text-center bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-lg transition-all text-sm font-medium dark:text-white"
              />
            </td>

            <td class="px-2 py-2 align-middle">
              <input
                type="number"
                v-model.number="row.area"
                readonly
                disabled
                placeholder="-"
                class="w-full p-2 text-center bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg text-sm font-bold text-indigo-600 dark:text-indigo-400 cursor-not-allowed"
                title="يتم حسابه تلقائياً (الطول × العرض × الكمية)"
              />
            </td>

            <td class="px-2 py-2 align-middle">
              <input
                type="number"
                step="any"
                min="0.0001"
                v-model.number="row.qty"
                class="w-full p-2 text-center font-bold text-gray-900 dark:text-white bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              />
              <p v-if="errors[`items.${index}.qty`]" class="text-rose-500 text-xs mt-1 text-center">
                خطأ
              </p>
            </td>

            <td class="px-2 py-2 align-middle">
              <input
                type="number"
                step="0.01"
                min="0"
                v-model.number="row.price"
                class="w-full p-2 text-left font-bold text-gray-900 dark:text-white bg-transparent border border-transparent hover:border-gray-200 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 rounded-lg transition-all"
                dir="ltr"
              />
              <p
                v-if="errors[`items.${index}.price`]"
                class="text-rose-500 text-xs mt-1 text-center"
              >
                خطأ
              </p>
            </td>

            <td class="px-4 py-3 align-middle text-center">
              <div
                class="inline-block w-full py-1.5 px-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-black text-base rounded-md border border-emerald-100 dark:border-emerald-800/30"
                dir="ltr"
              >
                {{ calculateRowTotal(row).toFixed(2) }}
              </div>
            </td>

            <td class="px-2 py-2 align-middle text-center">
              <button
                type="button"
                @click="removeRow(index)"
                class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="إزالة الصنف"
                :disabled="items.length === 1 && !row.item_id"
                :class="{ invisible: items.length === 1 && !row.item_id }"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5 mx-auto"
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
        </TransitionGroup>
      </table>
    </div>

    <p
      v-if="errors && errors.items_empty"
      class="text-rose-500 text-sm mt-4 font-bold flex items-center justify-center"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-5 w-5 ml-1"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
          clip-rule="evenodd"
        />
      </svg>
      يجب إضافة صنف واحد على الأقل للفاتورة لتتمكن من الحفظ.
    </p>
  </div>
</template>

<script setup>
import { onMounted, watch } from 'vue'
import { useItemStore } from '@/stores/ItemStore'
import { storeToRefs } from 'pinia'
import { useToast } from 'vue-toastification'

import SmartSearchGrid from '@/components/ui/SmartSearchGrid.vue'
import UnitsDropdown from '@/components/forms/UnitsDropdown.vue'

const items = defineModel({ type: Array, required: true })

defineProps({
  errors: { type: Object, required: true },
})

const itemStore = useItemStore()
const { items: availableItems } = storeToRefs(itemStore)
const toast = useToast()

onMounted(async () => {
  if (availableItems.value.length === 0) {
    try {
      await itemStore.fetchItems()
    } catch (err) {
      console.error('فشل تحميل قائمة الأصناف:', err)
    }
  }
})

// 🌟 قراءة السعر من المسار المتداخل الذي يوفره ItemResource
const searchColumns = [
  { key: 'code', label: 'الكود / الباركود', widthClass: 'w-32 text-right text-gray-500 font-mono' },
  { key: 'name', label: 'اسم الصنف', widthClass: 'w-full text-right font-bold' },
  {
    key: 'units.main.price',
    label: 'السعر',
    widthClass: 'w-24 text-right font-black text-emerald-600',
  },
]

// 🌟 قراءة السعر والوحدة من units.main كما يأتي من الباك إند
const createEmptyRow = (item = null) => ({
  item_id: item ? item.id : '',
  item_name: item ? item.name : '',
  item_code: item ? item.code || item.barcode || '' : '',

  // قراءة الوحدة الأساسية بأمان
  unit_id: item && item.units && item.units.main ? item.units.main.id : '',

  description: '',
  length: null,
  width: null,
  area: null,
  qty: 1,

  // قراءة السعر الأساسي بأمان
  price: item && item.units && item.units.main ? parseFloat(item.units.main.price) || 0 : 0,
})

const handleItemSelected = (selectedItem) => {
  if (!selectedItem || !selectedItem.id) return

  const firstRow = items.value[0]

  if (items.value.length === 1 && !firstRow.item_id && !firstRow.description) {
    items.value[0] = createEmptyRow(selectedItem)
  } else {
    items.value.push(createEmptyRow(selectedItem))
  }
}

const removeRow = (index) => {
  if (items.value.length > 1) {
    items.value.splice(index, 1)
  } else {
    items.value[0] = createEmptyRow()
  }
}

const calculateRowTotal = (row) => {
  const qty = parseFloat(row.qty) || 0
  const price = parseFloat(row.price) || 0
  const length = parseFloat(row.length)
  const width = parseFloat(row.width)

  if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
    return length * width * qty * price
  }
  return qty * price
}

const resolveItemName = (id) => {
  if (!id) return ''
  const product = availableItems.value.find((i) => i.id === id)
  return product ? product.name : 'جاري التحميل...'
}

// 🌟 مراقب لحساب عدد الأمتار (المساحة) تلقائياً
watch(
  () => items.value,
  (newItems) => {
    newItems.forEach((row) => {
      const length = parseFloat(row.length) || 0
      const width = parseFloat(row.width) || 0
      const qty = parseFloat(row.qty) || 0

      // إذا كان هناك طول وعرض، قم بضرب (الطول × العرض × الكمية)
      if (length > 0 && width > 0) {
        row.area = parseFloat((length * width * qty).toFixed(4))
      } else {
        row.area = null
      }
    })
  },
  { deep: true },
)
</script>

<style scoped>
/* حركات ظهور واختفاء الأسطر بنعومة */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
