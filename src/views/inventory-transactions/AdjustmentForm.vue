<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <AdjustmentFormHeader v-model:form="form" :errors="errors" />

    <AdjustmentFormItems v-model="items" :errors="errors" />

    <AdjustmentFormActions :is-saving="isSaving" @cancel="handleCancel" />
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'

// استيراد المكونات الفرعية المحدثة
import AdjustmentFormHeader from './components/AdjustmentFormHeader.vue'
import AdjustmentFormItems from './components/AdjustmentFormItems.vue'
import AdjustmentFormActions from './components/AdjustmentFormActions.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user || {})

// --- [تطوير]: دالة إنشاء سطر جديد تدعم الحقول النصية للبحث ---
const createEmptyRow = (item = null) => ({
  item_id: item ? item.id : '',
  item_name: item ? item.name : '',
  item_code: item ? item.code || item.barcode || '' : '',
  unit_id: item && item.units?.main ? item.units.main.id : '',
  qty: 1,
  unit_factor: item && item.units?.main ? item.units.main.factor : 1,
})

// --- State (حالة البيانات) ---
const form = reactive({
  id: null,
  trx_date: new Date().toISOString().split('T')[0],
  warehouse_id: currentUser.value.warehouse_id || '',
  trx_type: 'adjustment_in',
  notes: '',
})

const items = ref([createEmptyRow()])

const errors = reactive({
  trx_date: false,
  warehouse_id: false,
  trx_type: false,
  items_empty: false,
})

// --- [تطوير]: استخدام watch بدلاً من onMounted لضمان تحديث البيانات عند التغيير ---
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      // وضع التعديل (Edit Mode)
      const dateString = newData.trx_date || ''
      const formattedDate = dateString ? dateString.split(/[ T]/)[0] : ''

      Object.assign(form, {
        id: newData.id,
        trx_date: formattedDate || new Date().toISOString().split('T')[0],
        warehouse_id: newData.from_warehouse_id || '',
        trx_type: newData.trx_type || 'adjustment_in',
        notes: newData.notes || '',
      })

      // تعبئة تفاصيل الأصناف مع جلب الأسماء والأكواد للعرض الثابت
      const sourceItems = newData.items || []
      if (sourceItems.length > 0) {
        items.value = sourceItems.map((item) => ({
          item_id: item.item_id || '',
          item_name: item.item?.name || 'صنف غير معروف', // تأكد أن الـ API يرسل علاقة الـ item
          item_code: item.item?.code || item.item?.barcode || '',
          unit_id: item.unit_id || '',
          qty: Number(item.qty) || 1,
          unit_factor: Number(item.unit_factor) || 1,
        }))
      } else {
        items.value = [createEmptyRow()]
      }
    } else {
      // وضع الإنشاء (Create Mode)
      Object.assign(form, {
        id: null,
        trx_date: new Date().toISOString().split('T')[0],
        warehouse_id: currentUser.value?.warehouse_id || '',
        trx_type: 'adjustment_in',
        notes: '',
      })
      items.value = [createEmptyRow()]
    }
  },
  { immediate: true, deep: true },
)

// --- Actions (العمليات) ---
const handleSubmit = () => {
  // تصفير الأخطاء
  errors.trx_date = false
  errors.warehouse_id = false
  errors.trx_type = false
  errors.items_empty = false

  Object.keys(errors).forEach((key) => {
    if (key.includes('_')) delete errors[key]
  })

  let hasError = false

  // التحقق من الحقول الأساسية
  if (!form.trx_date) {
    errors.trx_date = true
    hasError = true
  }
  if (!form.warehouse_id) {
    errors.warehouse_id = true
    hasError = true
  }
  if (!form.trx_type) {
    errors.trx_type = true
    hasError = true
  }

  // فلترة الأسطر الصالحة (التي تحتوي على صنف أو كمية معدلة)
  const validItems = items.value.filter((row) => row.item_id)

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
      if (row.qty === null || row.qty === undefined) {
        errors[`qty_${originalIndex}`] = true
        hasError = true
      }
    })
  }

  if (hasError) return

  // تجهيز البيانات للإرسال (Payload)
  const payload = {
    id: form.id,
    trx_date: form.trx_date,
    trx_type: form.trx_type,
    notes: form.notes,
    from_warehouse_id: form.warehouse_id, // الحفاظ على المسمى المطلوب للباك إند
    items: validItems.map((row) => ({
      item_id: row.item_id,
      unit_id: row.unit_id,
      qty: Number(row.qty),
      unit_factor: Number(row.unit_factor || 1),
    })),
  }

  emit('submit', payload)
}

const handleCancel = () => {
  emit('cancel')
}
</script>
