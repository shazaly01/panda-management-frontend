<template>
  <div
    class="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 mb-6 transition-all duration-300"
  >
    <div class="flex flex-col md:flex-row gap-4 items-center justify-between">
      <div class="flex-1 flex gap-3 w-full">
        <div class="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            v-model="filters.search"
            @keyup.enter="applyFilters"
            type="text"
            placeholder="ابحث برقم الفاتورة أو اسم العميل..."
            class="w-full pr-10 pl-4 py-2.5 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none font-medium text-sm"
          />
        </div>

        <select
          v-model="filters.status"
          @change="applyFilters"
          class="w-44 rounded-xl border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500/20 outline-none px-3 text-sm font-bold text-gray-600 dark:text-gray-300"
        >
          <option value="">كل الحالات</option>
          <option value="draft">مسودة</option>
          <option value="confirmed">معتمدة</option>
          <option value="cancelled">ملغاة</option>
        </select>
      </div>

      <div class="flex gap-2 w-full md:w-auto">
        <button
          @click="toggleAdvanced"
          type="button"
          class="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors w-full md:w-auto justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 transition-transform duration-300"
            :class="{ 'rotate-180': showAdvanced }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          تصفية متقدمة
        </button>

        <button
          @click="applyFilters"
          class="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black rounded-xl transition-colors shadow-md active:scale-95"
        >
          تطبيق
        </button>
      </div>
    </div>

    <transition name="expand">
      <div
        v-show="showAdvanced"
        class="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 overflow-hidden"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="space-y-1.5">
            <label class="text-[11px] font-black text-gray-400 uppercase tracking-wider mr-1"
              >حالة التحصيل</label
            >
            <select
              v-model="filters.payment_status"
              class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-blue-500 transition-colors"
            >
              <option value="">الكل</option>
              <option value="paid">مدفوعة بالكامل ✅</option>
              <option value="partial">مدفوعة جزئياً ⏳</option>
              <option value="unpaid">آجل (غير مدفوعة) ❌</option>
            </select>
          </div>

          <div class="space-y-1.5">
            <label class="text-[11px] font-black text-gray-400 uppercase tracking-wider mr-1"
              >من تاريخ</label
            >
            <input
              v-model="filters.date_from"
              type="date"
              class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-[11px] font-black text-gray-400 uppercase tracking-wider mr-1"
              >إلى تاريخ</label
            >
            <input
              v-model="filters.date_to"
              type="date"
              class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
            />
          </div>

          <div class="space-y-1.5">
            <label class="text-[11px] font-black text-gray-400 uppercase tracking-wider mr-1"
              >كلمة دالة في الملاحظات</label
            >
            <input
              v-model="filters.notes"
              type="text"
              placeholder="مثلاً: مستعجل، خصم خاص..."
              class="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div class="flex items-center justify-between mt-6">
          <div class="text-[10px] text-gray-400 font-medium">
            * يمكنك البحث برقم الفاتورة أو اسم العميل بشكل مباشر في الحقل العلوي.
          </div>
          <div class="flex gap-2">
            <button
              @click="resetFilters"
              class="px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors flex items-center gap-2"
            >
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              تصفير الكل
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['filter'])

const showAdvanced = ref(false)

// كائن الفلاتر يطابق المتغيرات التي يستقبلها الـ Backend المحدث
const filters = reactive({
  search: '', // الحقل الشامل (رقم فاتورة أو اسم عميل)
  status: '', // draft, confirmed, cancelled
  payment_status: '', // paid, partial, unpaid
  date_from: '',
  date_to: '',
  notes: '',
})

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

// إرسال الفلاتر للـ SalesList
const applyFilters = () => {
  // تنظيف القيم الفارغة قبل الإرسال لتقليل حجم الـ Request
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null && v !== ''),
  )
  emit('filter', cleanFilters)
}

// إعادة تعيين كل الحقول
const resetFilters = () => {
  Object.keys(filters).forEach((key) => (filters[key] = ''))
  emit('filter', {}) // إرسال كائن فارغ لجلب كل البيانات مجدداً
}
</script>

<style scoped>
/* انيميشن فتح وإغلاق البحث المتقدم بسلاسة */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 400px;
}
.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}
</style>
