<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <PurchaseFormHeader v-model:form="form" :errors="errors" />

    <PurchaseFormItems v-model="items" :errors="errors" />

    <PurchaseFormActions :grandTotal="grandTotal" :isSaving="isSaving" @cancel="handleCancel" />
  </form>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// استيراد المكونات الفرعية التي أنشأناها
import PurchaseFormHeader from './components/PurchaseFormHeader.vue'
import PurchaseFormItems from './components/PurchaseFormItems.vue'
import PurchaseFormActions from './components/PurchaseFormActions.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// --- State (حالة البيانات) ---
const form = reactive({
  id: null,
  trx_date: new Date().toISOString().split('T')[0],
  partner_id: '',
  warehouse_id: '',
  treasury_id: '',
  notes: '',
})

const items = ref([
  {
    item_id: '',
    unit_id: '',
    qty: 1,
    price: 0,
  },
])

const errors = reactive({
  trx_date: false,
  partner_id: false,
  warehouse_id: false,
  items_empty: false,
})

// --- Computed (الحسابات) ---
const grandTotal = computed(() => {
  return items.value.reduce((sum, row) => {
    const qty = parseFloat(row.qty) || 0
    const price = parseFloat(row.price) || 0
    return sum + qty * price
  }, 0)
})

// --- Actions (العمليات) ---
const handleSubmit = () => {
  // إعادة تعيين الأخطاء
  errors.trx_date = false
  errors.partner_id = false
  errors.warehouse_id = false
  errors.items_empty = false

  Object.keys(errors).forEach((key) => {
    if (key.includes('_')) errors[key] = false
  })

  let hasError = false

  // التحقق من البيانات الأساسية
  if (!form.trx_date) {
    errors.trx_date = true
    hasError = true
  }
  if (!form.partner_id) {
    errors.partner_id = true
    hasError = true
  }
  if (!form.warehouse_id) {
    errors.warehouse_id = true
    hasError = true
  }

  // فلترة الأصناف الصالحة
  const validItems = items.value.filter(
    (row) => row.item_id || row.unit_id || row.qty > 1 || row.price > 0,
  )

  // التحقق من الأصناف
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
      if (row.price === '' || row.price < 0) {
        errors[`price_${originalIndex}`] = true
        hasError = true
      }
    })
  }

  if (hasError) return

  // تجهيز البيانات للإرسال
  const payload = {
    ...form,
    items: validItems.map((row) => ({
      item_id: row.item_id,
      unit_id: row.unit_id,
      qty: Number(row.qty),
      price: Number(row.price),
    })),
  }

  emit('submit', payload)
}

// --- دورة حياة المكون (Lifecycle) ---
onMounted(() => {
  if (props.initialData) {
    // 1. تعبئة البيانات الأساسية
    form.id = props.initialData.id
    form.trx_date = props.initialData.trx_date || new Date().toISOString().split('T')[0]
    form.partner_id = props.initialData.partner_id || ''
    form.warehouse_id = props.initialData.warehouse_id || ''
    form.treasury_id = props.initialData.treasury_id || ''
    form.notes = props.initialData.notes || ''

    // 2. تعبئة تفاصيل الأصناف
    if (props.initialData.items && props.initialData.items.length > 0) {
      items.value = props.initialData.items.map((row) => ({
        item_id: row.item_id || '',
        unit_id: row.unit_id || '',
        qty: Number(row.qty) || 1,
        price: Number(row.price) || 0,
      }))
    }
  }
})

const handleCancel = () => {
  emit('cancel')
}
</script>
