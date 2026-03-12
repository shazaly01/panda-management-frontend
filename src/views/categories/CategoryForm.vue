<!--src\views\categories\CategoryForm.vue-->
<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="category-name"
            label="اسم التصنيف"
            v-model="form.name"
            placeholder="مثال: إلكترونيات، مواد غذائية..."
            :required="true"
          />
          <p v-if="errors.name" class="text-rose-500 text-xs mt-1 font-bold">
            يجب إدخال اسم التصنيف
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5">
        <CategoriesDropdown
          id="category-parent"
          label="التصنيف الأب (اختياري)"
          v-model="form.parent_id"
        />
      </div>

      <div class="mt-3 flex items-center">
        <input
          id="category-is-active"
          type="checkbox"
          v-model="form.is_active"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label
          for="category-is-active"
          class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200 select-none cursor-pointer"
        >
          التصنيف مفعل ونشط
        </label>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ التصنيف</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

// استيراد مكونات UI الأساسية
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'
import CategoriesDropdown from '@/components/forms/CategoriesDropdown.vue'

const props = defineProps({
  initialData: {
    type: Object,
    default: null,
  },
  isSaving: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

// 1. تنظيف الأخطاء: حذفنا code
const errors = reactive({
  name: false,
})

// 2. تنظيف النموذج الابتدائي: حذفنا code تماماً من الحالة (State)
const createFreshForm = () => ({
  id: null,
  name: '',
  parent_id: '',
  is_active: true,
})

const form = ref(createFreshForm())

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        id: newData.id,
        name: newData.name || '',
        parent_id: newData.parent_id || '',
        is_active: newData.is_active !== undefined ? Boolean(newData.is_active) : true,
        // ملاحظة: لا نضع code هنا لأننا لا نريد إرساله أو تعديله من الواجهة
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

const handleSubmit = () => {
  errors.name = false

  let hasError = false

  if (!form.value.name) {
    errors.name = true
    hasError = true
  }

  if (hasError) return

  // نرسل فقط الحقول التي نحتاجها (id, name, parent_id, is_active)
  // الـ Backend سيتولى توليد الكود أو الحفاظ عليه
  emit('submit', { ...form.value })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
