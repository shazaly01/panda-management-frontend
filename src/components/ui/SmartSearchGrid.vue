<template>
  <div class="relative w-full" ref="containerRef">
    <div class="relative">
      <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg
          aria-hidden="true"
          class="w-5 h-5 text-gray-500 dark:text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          ></path>
        </svg>
      </div>
      <input
        ref="inputRef"
        type="text"
        v-model="searchQuery"
        @input="handleInput"
        @keydown="handleKeydown"
        @focus="openDropdown"
        :placeholder="placeholder"
        class="block w-full p-3 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-all shadow-sm"
        autocomplete="off"
      />
    </div>

    <div
      v-if="isOpen && filteredData.length > 0"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto"
    >
      <table class="w-full text-sm text-right">
        <thead
          class="text-xs text-gray-700 uppercase bg-gray-100 dark:bg-gray-900 dark:text-gray-300 sticky top-0 z-10 shadow-sm"
        >
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              scope="col"
              class="px-4 py-3"
              :class="col.widthClass || ''"
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in filteredData"
            :key="index"
            @click="selectItem(item)"
            @mouseover="highlightedIndex = index"
            :class="[
              'cursor-pointer border-b dark:border-gray-700 transition-colors',
              highlightedIndex === index
                ? 'bg-blue-100 dark:bg-blue-900/40'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50',
            ]"
          >
            <td
              v-for="col in columns"
              :key="col.key"
              class="px-4 py-2 font-medium text-gray-800 dark:text-gray-200"
            >
              {{ getNestedValue(item, col.key) || '---' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div
      v-if="isOpen && searchQuery && filteredData.length === 0"
      class="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl p-4 text-center text-gray-500 dark:text-gray-400"
    >
      لا توجد نتائج مطابقة لـ "<span class="font-bold">{{ searchQuery }}</span
      >"
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  data: { type: Array, required: true }, // المصفوفة التي سنبحث بداخلها
  columns: { type: Array, required: true }, // إعدادات الأعمدة مثل: [{ key: 'name', label: 'الاسم' }, { key: 'code', label: 'الباركود' }]
  searchKeys: { type: Array, required: true }, // الحقول التي سيتم البحث فيها مثل: ['name', 'code']
  placeholder: { type: String, default: 'ابحث بالاسم أو الباركود...' },
})

const emit = defineEmits(['select'])

const inputRef = ref(null)
const containerRef = ref(null)
const searchQuery = ref('')
const isOpen = ref(false)
const highlightedIndex = ref(0)

// 1. فلترة البيانات محلياً (أداء صاروخي للبيانات < 2000)
const filteredData = computed(() => {
  if (!searchQuery.value.trim()) return []

  const query = searchQuery.value.toLowerCase().trim()

  return props.data
    .filter((item) => {
      return props.searchKeys.some((key) => {
        const val = getNestedValue(item, key)
        return val ? String(val).toLowerCase().includes(query) : false
      })
    })
    .slice(0, 50) // حد أقصى للسرعة وتجنب تجميد المتصفح
})

// 2. معالجة الإدخال
const handleInput = () => {
  isOpen.value = true
  highlightedIndex.value = 0 // دائماً اجعل التركيز على أول نتيجة عند الكتابة
}

const openDropdown = () => {
  if (searchQuery.value.trim()) isOpen.value = true
}

// 3. دعم أسهم الكيبورد وقارئ الباركود (Enter)
const handleKeydown = (e) => {
  if (!isOpen.value && e.key !== 'Enter') return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    if (highlightedIndex.value < filteredData.value.length - 1) highlightedIndex.value++
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    if (highlightedIndex.value > 0) highlightedIndex.value--
  } else if (e.key === 'Enter') {
    e.preventDefault()

    if (filteredData.value.length > 0) {
      // 🌟 سحر الباركود: التحقق إذا كان البحث يطابق قيمة أحد المفاتيح تماماً (مثل الباركود)
      const exactMatch = filteredData.value.find((item) =>
        props.searchKeys.some((key) => {
          const val = getNestedValue(item, key)
          return String(val).toLowerCase() === searchQuery.value.toLowerCase().trim()
        }),
      )

      if (exactMatch) {
        selectItem(exactMatch)
      } else {
        // إذا لم يكن تطابقاً تاماً (بحث بالاسم)، اختر العنصر المظلل حالياً
        selectItem(filteredData.value[highlightedIndex.value])
      }
    }
  } else if (e.key === 'Escape') {
    isOpen.value = false
  }
}

// 4. اختيار الصنف وإرساله للأب
const selectItem = (item) => {
  if (!item) return

  emit('select', item) // إرسال الكائن للأب

  // إعادة تعيين الحقل للتحضير للصنف التالي
  searchQuery.value = ''
  isOpen.value = false
  highlightedIndex.value = 0

  // 🌟 سحر الكاشير: إبقاء التركيز في الحقل بعد الإضافة مباشرة لقراءة الباركود التالي فوراً
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// دالة مساعدة لجلب البيانات (تدعم item.category.name مثلاً)
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj)
}

// إغلاق القائمة عند النقر خارجها
const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside)
})
</script>
