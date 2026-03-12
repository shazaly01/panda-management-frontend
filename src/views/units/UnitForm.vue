<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="unit-name"
            label="اسم الوحدة"
            v-model="form.name"
            placeholder="مثال: قطعة، كرتونة..."
            :required="true"
          />
          <p v-if="errors.name" class="text-rose-500 text-xs mt-1 font-bold">
            يجب إدخال اسم الوحدة
          </p>
        </div>
      </div>

      <div class="mt-3 flex items-center">
        <input
          id="unit-is-active"
          type="checkbox"
          v-model="form.is_active"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label
          for="unit-is-active"
          class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200 select-none cursor-pointer"
        >
          الوحدة مفعلة ونشطة
        </label>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ الوحدة</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'

// استيراد مكونات UI الأساسية
import AppInput from '@/components/ui/AppInput.vue'
import AppButton from '@/components/ui/AppButton.vue'

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

// إدارة الأخطاء يدوياً
const errors = reactive({
  name: false,
  code: false,
})

const createFreshForm = () => ({
  id: null,
  name: '',
  code: '',
  is_active: true, // القيمة الافتراضية مفعل
})

const form = ref(createFreshForm())

watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      form.value = {
        id: newData.id,
        name: newData.name || '',
        is_active: newData.is_active !== undefined ? Boolean(newData.is_active) : true,
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

// دالة التحقق والإرسال
const handleSubmit = () => {
  // إعادة تعيين الأخطاء
  errors.name = false
  errors.code = false

  let hasError = false

  if (!form.value.name) {
    errors.name = true
    hasError = true
  }

  if (hasError) return

  emit('submit', { ...form.value })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
