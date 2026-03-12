<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-5">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="treasury-name"
            label="اسم الخزينة / البنك"
            v-model="form.name"
            placeholder="مثال: الخزينة الرئيسية، بنك..."
            :required="true"
          />
          <p v-if="errors.name" class="text-rose-500 text-xs mt-1 font-bold">
            يجب إدخال اسم الخزينة
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5 items-center">
        <div class="flex items-center mt-6">
          <input
            id="treasury-is-bank"
            type="checkbox"
            v-model="form.is_bank"
            class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <label
            for="treasury-is-bank"
            class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200 select-none cursor-pointer"
          >
            هذه الخزينة عبارة عن حساب بنكي
          </label>
        </div>

        <div v-if="form.is_bank">
          <AppInput
            id="treasury-bank-account"
            label="رقم الحساب البنكي"
            v-model="form.bank_account_no"
            placeholder="ادخل رقم الحساب"
            :required="true"
          />
          <p v-if="errors.bank_account_no" class="text-rose-500 text-xs mt-1 font-bold">
            يجب إدخال رقم الحساب البنكي
          </p>
        </div>
      </div>

      <div class="mt-3 flex items-center">
        <input
          id="treasury-is-active"
          type="checkbox"
          v-model="form.is_active"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label
          for="treasury-is-active"
          class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200 select-none cursor-pointer"
        >
          الخزينة مفعلة ونشطة
        </label>
      </div>
    </div>

    <div class="mt-8 flex justify-end space-x-3 space-x-reverse">
      <AppButton type="button" variant="secondary" @click="handleCancel"> إلغاء </AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ الخزينة</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
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

const errors = reactive({
  name: false,
  bank_account_no: false,
})

const createFreshForm = () => ({
  id: null,
  name: '',
  is_bank: false,
  bank_account_no: '',
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
        is_bank: Boolean(newData.is_bank),
        bank_account_no: newData.bank_account_no || '',
        is_active: newData.is_active !== undefined ? Boolean(newData.is_active) : true,
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

// مسح قيمة الحساب البنكي والخطأ الخاص به إذا تم إلغاء تحديد خيار البنك
watch(
  () => form.value.is_bank,
  (isBank) => {
    if (!isBank) {
      form.value.bank_account_no = ''
      errors.bank_account_no = false
    }
  },
)

const handleSubmit = () => {
  errors.name = false
  errors.bank_account_no = false

  let hasError = false

  if (!form.value.name) {
    errors.name = true
    hasError = true
  }

  // التحقق الإضافي لرقم الحساب البنكي
  if (form.value.is_bank && !form.value.bank_account_no) {
    errors.bank_account_no = true
    hasError = true
  }

  if (hasError) return

  emit('submit', { ...form.value })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
