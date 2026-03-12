<template>
  <form @submit.prevent="handleSubmit">
    <div class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="partner-name"
            label="اسم الشريك (العميل / المورد)"
            v-model="form.name"
            placeholder="ادخل الاسم كاملًا"
            :required="true"
          />
          <p v-if="errors.name" class="text-rose-500 text-xs mt-1 font-bold">
            يجب إدخال اسم الشريك
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppDropdown
            id="partner-type"
            label="نوع الشريك"
            v-model="form.type"
            :options="partnerTypes"
            option-label="name"
            option-value="id"
            :required="true"
          />
          <p v-if="errors.type" class="text-rose-500 text-xs mt-1 font-bold">
            يجب اختيار نوع الشريك
          </p>
        </div>

        <div>
          <AppInput
            id="partner-tax-number"
            label="الرقم الضريبي (اختياري)"
            v-model="form.tax_number"
            placeholder="ادخل الرقم الضريبي إن وجد"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AppInput
            id="partner-phone"
            label="رقم الهاتف (اختياري)"
            v-model="form.phone"
            placeholder="مثال: 0912345678"
          />
        </div>

        <div>
          <AppInput
            id="partner-email"
            type="email"
            label="البريد الإلكتروني (اختياري)"
            v-model="form.email"
            placeholder="example@domain.com"
          />
        </div>
      </div>

      <div class="grid grid-cols-1 gap-5">
        <AppTextarea
          id="partner-address"
          label="العنوان (اختياري)"
          v-model="form.address"
          placeholder="ادخل عنوان الشريك بالتفصيل"
          rows="2"
        />
      </div>

      <div class="mt-3 flex items-center">
        <input
          id="partner-is-active"
          type="checkbox"
          v-model="form.is_active"
          class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        />
        <label
          for="partner-is-active"
          class="mr-2 text-sm font-medium text-gray-700 dark:text-gray-200 select-none cursor-pointer"
        >
          الشريك مفعل ونشط
        </label>
      </div>
    </div>

    <div
      class="mt-8 flex justify-end space-x-3 space-x-reverse border-t pt-5 border-gray-200 dark:border-gray-700"
    >
      <AppButton type="button" variant="secondary" @click="handleCancel">إلغاء</AppButton>
      <AppButton type="submit" :disabled="isSaving">
        <span v-if="isSaving">جاري الحفظ...</span>
        <span v-else>حفظ الشريك</span>
      </AppButton>
    </div>
  </form>
</template>

<script setup>
import { ref, watch, reactive } from 'vue'
import AppInput from '@/components/ui/AppInput.vue'
import AppTextarea from '@/components/ui/AppTextarea.vue'
import AppDropdown from '@/components/ui/AppDropdown.vue'
import AppButton from '@/components/ui/AppButton.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// القيم يجب أن تتطابق مع قيم الـ Enum في الباك إند (App\Enums\PartnerType)
// افترضت هنا أن القيم هي 'customer' و 'supplier'، يمكنك تعديلها إذا كانت أرقاماً 1 و 2
const partnerTypes = ref([
  { id: 1, name: 'عميل' }, // مطابق لـ PartnerType::CUSTOMER
  { id: 2, name: 'مورد' }, // مطابق لـ PartnerType::SUPPLIER
  { id: 3, name: 'عميل ومورد' }, // مطابق لـ PartnerType::BOTH
])

const errors = reactive({
  name: false,
  code: false,
  type: false,
})

const createFreshForm = () => ({
  id: null,
  name: '',
  type: 1, // تم التغيير من 'customer' إلى 1
  phone: '',
  email: '',
  tax_number: '',
  address: '',
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
        type: newData.type || 'customer',
        phone: newData.phone || '',
        email: newData.email || '',
        tax_number: newData.tax_number || '',
        address: newData.address || '',
        is_active: newData.is_active !== undefined ? Boolean(newData.is_active) : true,
      }
    } else {
      form.value = createFreshForm()
    }
  },
  { immediate: true, deep: true },
)

const handleSubmit = () => {
  // تصفير الأخطاء
  errors.name = false
  errors.code = false
  errors.type = false

  let hasError = false

  if (!form.value.name) {
    errors.name = true
    hasError = true
  }

  if (!form.value.type) {
    errors.type = true
    hasError = true
  }

  if (hasError) return

  emit('submit', { ...form.value })
}

const handleCancel = () => {
  emit('cancel')
}
</script>
