<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <AdjustmentFormHeader v-model:form="form" :errors="errors" />

    <AdjustmentFormItems v-model="items" :errors="errors" />

    <AdjustmentFormActions :isSaving="isSaving" @cancel="handleCancel" />
  </form>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

// استيراد المكونات الفرعية
import AdjustmentFormHeader from './components/AdjustmentFormHeader.vue'
import AdjustmentFormItems from './components/AdjustmentFormItems.vue'
import AdjustmentFormActions from './components/AdjustmentFormActions.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// --- State (حالة البيانات) ---
const form = reactive({
  id: null,
  trx_date: new Date().toISOString().split('T')[0],
  warehouse_id: '',
  trx_type: 'adjustment_in', // قيمة افتراضية (زيادة)
  notes: '',
})

const items = ref([
  {
    item_id: '',
    unit_id: '',
    qty: 1,
    unit_factor: 1, // <-- تمت الإضافة
  },
])

const errors = reactive({
  trx_date: false,
  warehouse_id: false,
  trx_type: false,
  items_empty: false,
})

// --- دورة حياة المكون (تعبئة البيانات في حالة التعديل) ---
onMounted(() => {
  if (props.initialData) {
    // 1. تعبئة البيانات الأساسية
    form.id = props.initialData.id
    form.trx_date = props.initialData.trx_date || new Date().toISOString().split('T')[0]
    // نستخدم from_warehouse_id بناءً على ما يأتينا من الـ Resource
    form.warehouse_id = props.initialData.from_warehouse_id || ''
    form.trx_type = props.initialData.trx_type || 'adjustment_in'
    form.notes = props.initialData.notes || ''

    // 2. تعبئة تفاصيل الأصناف
    if (props.initialData.items && props.initialData.items.length > 0) {
      items.value = props.initialData.items.map((row) => ({
        item_id: row.item_id || '',
        unit_id: row.unit_id || '',
        qty: Number(row.qty) || 1,
        unit_factor: Number(row.unit_factor) || 1, // <-- تمت الإضافة ليقرأها من الـ Resource
      }))
    }
  }
})

// --- Actions (العمليات) ---
const handleSubmit = () => {
  // تصفير الأخطاء
  errors.trx_date = false
  errors.warehouse_id = false
  errors.trx_type = false
  errors.items_empty = false

  Object.keys(errors).forEach((key) => {
    if (
      key.includes('_') &&
      !['warehouse_id', 'trx_type', 'trx_date', 'items_empty'].includes(key)
    ) {
      errors[key] = false
    }
  })

  let hasError = false

  // التحقق من الترويسة
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

  // فلترة الأسطر الصالحة
  const validItems = items.value.filter((row) => row.item_id || row.unit_id || row.qty > 1)

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
      if (!row.qty || row.qty < 0.0001) {
        errors[`qty_${originalIndex}`] = true
        hasError = true
      }
    })
  }

  if (hasError) return

  // تجهيز البيانات للإرسال
  // تجهيز البيانات للإرسال
  const payload = {
    id: form.id,
    trx_date: form.trx_date,
    trx_type: form.trx_type,
    notes: form.notes,

    // السر هنا: نرسل قيمة المخزن تحت المسمى الذي يتوقعه الباك إند
    from_warehouse_id: form.warehouse_id,

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
