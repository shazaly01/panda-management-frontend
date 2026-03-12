<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-8">
      <div
        class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700"
      >
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">البيانات الأساسية</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <AppInput
              id="item-name"
              label="اسم الصنف"
              v-model="form.name"
              placeholder="ادخل اسم الصنف"
              :required="true"
            />
            <p v-if="errors.name" class="text-rose-500 text-xs mt-1 font-bold">
              يجب إدخال اسم الصنف
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <AppInput
            id="item-barcode"
            label="الباركود (اختياري)"
            v-model="form.barcode"
            placeholder="امسح الباركود"
          />

          <div>
            <CategoriesDropdown
              id="item-category"
              label="تصنيف الصنف"
              v-model="form.category_id"
              :required="true"
            />
            <p v-if="errors.category_id" class="text-rose-500 text-xs mt-1 font-bold">
              يجب اختيار التصنيف
            </p>
          </div>

          <div>
            <AppDropdown
              id="item-type"
              label="نوع الصنف"
              v-model="form.type"
              :options="itemTypes"
              option-label="name"
              option-value="id"
              :required="true"
            />
            <p v-if="errors.type" class="text-rose-500 text-xs mt-1 font-bold">
              يجب اختيار نوع الصنف
            </p>
          </div>
        </div>
      </div>

      <div
        class="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-lg border border-blue-100 dark:border-blue-900"
      >
        <h3 class="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">الوحدات والتسعير</h3>

        <div
          class="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow-sm border-l-4 border-blue-500"
        >
          <h4 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            الوحدة الأساسية (الصغرى)
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <UnitsDropdown
                id="unit1-id"
                label="الوحدة"
                v-model="form.unit1_id"
                :required="true"
              />
              <p v-if="errors.unit1_id" class="text-rose-500 text-xs mt-1 font-bold">
                الوحدة الأساسية مطلوبة
              </p>
            </div>
            <div>
              <AppCurrencyInput
                id="price1"
                label="سعر البيع"
                v-model="form.price1"
                :required="true"
              />
              <p v-if="errors.price1" class="text-rose-500 text-xs mt-1 font-bold">
                سعر البيع الأساسي مطلوب
              </p>
            </div>
          </div>
        </div>

        <div
          class="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow-sm border-l-4 border-green-500"
        >
          <h4 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            الوحدة المتوسطة (اختيارية)
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <UnitsDropdown id="unit2-id" label="الوحدة" v-model="form.unit2_id" />
            <div>
              <AppInput
                id="factor2"
                label="معامل التحويل (كم تحوي من الوحدة الأساسية؟)"
                v-model="form.factor2"
                type="number"
                step="any"
                :disabled="!form.unit2_id"
              />
              <p v-if="errors.factor2" class="text-rose-500 text-xs mt-1 font-bold">
                المعامل مطلوب ويجب أن يكون أكبر من 1
              </p>
            </div>
            <AppCurrencyInput
              id="price2"
              label="سعر البيع"
              v-model="form.price2"
              :disabled="!form.unit2_id"
            />
          </div>
        </div>

        <div class="p-4 bg-white dark:bg-gray-800 rounded shadow-sm border-l-4 border-purple-500">
          <h4 class="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
            الوحدة الكبرى (اختيارية)
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
            <UnitsDropdown id="unit3-id" label="الوحدة" v-model="form.unit3_id" />
            <div>
              <AppInput
                id="factor3"
                label="معامل التحويل (كم تحوي من الوحدة الأساسية؟)"
                v-model="form.factor3"
                type="number"
                step="any"
                :disabled="!form.unit3_id"
              />
              <p v-if="errors.factor3" class="text-rose-500 text-xs mt-1 font-bold">
                المعامل مطلوب ويجب أن يكون أكبر من معامل الوحدة المتوسطة
              </p>
            </div>
            <AppCurrencyInput
              id="price3"
              label="سعر البيع"
              v-model="form.price3"
              :disabled="!form.unit3_id"
            />
          </div>
        </div>
      </div>

      <div
        class="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-lg border border-gray-100 dark:border-gray-700"
      >
        <h3 class="text-lg font-bold text-gray-800 dark:text-white mb-4">
          التكلفة والإعدادات الإضافية
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <AppCurrencyInput
            id="base-cost"
            label="التكلفة الأساسية المتوقعة (اختياري)"
            v-model="form.base_cost"
          />
        </div>

        <div class="flex flex-col space-y-3 mt-4">
          <div class="flex items-center">
            <input
              id="item-has-expiry"
              type="checkbox"
              v-model="form.has_expiry"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              for="item-has-expiry"
              class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
              >الصنف له تاريخ صلاحية (انتهاء)</label
            >
          </div>
          <div class="flex items-center">
            <input
              id="item-is-active"
              type="checkbox"
              v-model="form.is_active"
              class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
            />
            <label
              for="item-is-active"
              class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
              >الصنف مفعل ونشط</label
            >
          </div>
        </div>
      </div>
    </div>

    <div
      class="mt-8 flex justify-end space-x-3 space-x-reverse border-t pt-5 border-gray-200 dark:border-gray-700"
    >
      <AppButton type="button" variant="secondary" @click="handleCancel">إلغاء</AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ الصنف</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppCurrencyInput from '@/components/ui/AppCurrencyInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import CategoriesDropdown from '@/components/forms/CategoriesDropdown.vue'
import UnitsDropdown from '@/components/forms/UnitsDropdown.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// قائمة أنواع الصنف (يمكن تعديلها لتشمل قيم الـ Enum الفعلية لديك)
const itemTypes = ref([
  { id: 1, name: 'صنف مخزني (قياسي)' }, // 1 يطابق ItemType::STORE
  { id: 2, name: 'خدمة (بدون رصيد)' }, // 2 يطابق ItemType::SERVICE
])

const errors = reactive({
  name: false,
  code: false,
  category_id: false,
  type: false,
  unit1_id: false,
  price1: false,
  factor2: false,
  factor3: false,
})

const createFreshForm = () => ({
  id: null,
  category_id: '',
  name: '',
  code: '',
  barcode: '',
  type: 'standard', // القيمة الافتراضية
  unit1_id: '',
  price1: '',
  unit2_id: '',
  factor2: '',
  price2: '',
  unit3_id: '',
  factor3: '',
  price3: '',
  base_cost: '',
  has_expiry: false,
  is_active: true,
})

const form = ref(createFreshForm())

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        id: newData.id,
        category_id: newData.category_id || (newData.category ? newData.category.id : ''),
        name: newData.name || '',
        barcode: newData.barcode || '',
        type: newData.type || 'standard',
        unit1_id: newData.unit1_id || newData.units?.main?.id || '',
        price1: newData.price1 || newData.units?.main?.price || '',
        unit2_id: newData.unit2_id || newData.units?.medium?.id || '',
        factor2: newData.factor2 || newData.units?.medium?.factor || '',
        price2: newData.price2 || newData.units?.medium?.price || '',
        unit3_id: newData.unit3_id || newData.units?.small?.id || '',
        factor3: newData.factor3 || newData.units?.small?.factor || '',
        price3: newData.price3 || newData.units?.small?.price || '',
        base_cost: newData.base_cost || '',
        has_expiry: Boolean(newData.has_expiry),
        is_active: newData.is_active !== undefined ? Boolean(newData.is_active) : true,
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

// تفريغ بيانات الوحدة 2 إذا تم إزالتها
watch(
  () => form.value.unit2_id,
  (newVal) => {
    if (!newVal) {
      form.value.factor2 = ''
      form.value.price2 = ''
      errors.factor2 = false
    }
  },
)

// تفريغ بيانات الوحدة 3 إذا تم إزالتها
watch(
  () => form.value.unit3_id,
  (newVal) => {
    if (!newVal) {
      form.value.factor3 = ''
      form.value.price3 = ''
      errors.factor3 = false
    }
  },
)

const handleSubmit = () => {
  // 1. إعادة ضبط مصفوفة الأخطاء قبل البدء
  Object.keys(errors).forEach((key) => (errors[key] = false))
  let hasError = false

  // 2. التحقق من الحقول الأساسية
  if (!form.value.name) {
    errors.name = true
    hasError = true
  }

  if (!form.value.category_id) {
    errors.category_id = true
    hasError = true
  }
  if (!form.value.type) {
    errors.type = true
    hasError = true
  }

  // 3. التحقق من الوحدة الأساسية
  if (!form.value.unit1_id) {
    errors.unit1_id = true
    hasError = true
  }
  if (form.value.price1 === '' || form.value.price1 < 0) {
    errors.price1 = true
    hasError = true
  }

  // 4. التحقق من منطق الوحدة الثانية (إذا وجدت)
  if (form.value.unit2_id) {
    const f2 = Number(form.value.factor2)
    if (!form.value.factor2 || f2 <= 1) {
      errors.factor2 = true
      hasError = true
    }
  }

  // 5. التحقق من منطق الوحدة الثالثة (إذا وجدت)
  if (form.value.unit3_id) {
    const f2 = Number(form.value.factor2) || 1
    const f3 = Number(form.value.factor3)
    if (!form.value.factor3 || f3 <= f2) {
      errors.factor3 = true
      hasError = true
    }
  }

  // إذا وجد خطأ، توقف هنا ولا ترسل البيانات
  if (hasError) return

  // 6. تجهيز "الحمولة" (Payload) وتطهيرها للـ Backend
  // نأخذ نسخة من البيانات حتى لا نؤثر على واجهة الاستمارة أثناء الكتابة
  const payload = { ...form.value }

  // أ. تحويل النوع (Type) إلى رقم ليتوافق مع Enum: int
  payload.type = Number(payload.type)

  // ب. معالجة الحقول الرقمية الاختيارية
  // Laravel يرفض السلسلة النصية الفارغة "" في قواعد 'numeric'
  const numericFields = ['factor2', 'price2', 'factor3', 'price3', 'base_cost', 'price1']
  numericFields.forEach((field) => {
    if (payload[field] === '' || payload[field] === null || payload[field] === undefined) {
      payload[field] = null // إرسالها كـ null حقيقي
    } else {
      payload[field] = Number(payload[field]) // التأكد أنها رقم
    }
  })

  // ج. معالجة معرفات الوحدات الاختيارية والباركود
  if (!payload.unit2_id) payload.unit2_id = null
  if (!payload.unit3_id) payload.unit3_id = null
  if (!payload.barcode) payload.barcode = null

  // إرسال البيانات النهائية النظيفة
  emit('submit', payload)
}

const handleCancel = () => {
  emit('cancel')
}
</script>
