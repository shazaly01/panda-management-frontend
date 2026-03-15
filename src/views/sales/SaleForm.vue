<!--src\views\sales\SaleForm.vue-->
<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <SaleFormHeader v-model:form="form" :errors="errors" />

    <SaleFormItems v-model="items" :errors="errors" />

    <SaleFormActions
      v-model:form="form"
      :errors="errors"
      :grand-total="grandTotal"
      :is-saving="isSaving"
      @cancel="handleCancel"
    />
  </form>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore'

import SaleFormHeader from './components/SaleFormHeader.vue'
import SaleFormItems from './components/SaleFormItems.vue'
import SaleFormActions from './components/SaleFormActions.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

const authStore = useAuthStore()
const currentUser = computed(() => authStore.user || {})

// --- الحالة (State) ---
const form = reactive({
  id: null,
  trx_date: new Date().toISOString().split('T')[0],
  partner_id: '',
  warehouse_id: currentUser.value.warehouse_id || '',
  treasury_id: currentUser.value.bank_id || currentUser.value.treasury_id || '',
  notes: '',
  walk_in_customer_name: '',
  designer_id: '',
  design_commission: null,
  shipping_destination: '',
  paid_amount: 0, // --- [تمت الإضافة] ---
  status: 'draft',
})

const items = ref([])

const errors = reactive({
  trx_date: false,
  partner_id: false,
  warehouse_id: false,
  treasury_id: false, // --- [تمت الإضافة] ---
  items_empty: false,
})

const createEmptyRow = () => ({
  item_id: '',
  unit_id: '',
  description: '',
  length: null,
  width: null,
  area: null,
  qty: 1,
  price: 0,
})

items.value.push(createEmptyRow())

// --- الحسابات المركزية للإجمالي ---
const grandTotal = computed(() => {
  return items.value.reduce((sum, row) => {
    const qty = parseFloat(row.qty) || 0
    const price = parseFloat(row.price) || 0
    const length = parseFloat(row.length)
    const width = parseFloat(row.width)

    if (!isNaN(length) && !isNaN(width) && length > 0 && width > 0) {
      return sum + length * width * qty * price
    }
    return sum + qty * price
  }, 0)
})

// --- معالجة الإرسال (Submit Logic) ---
const handleSubmit = () => {
  errors.trx_date = false
  errors.partner_id = false
  errors.warehouse_id = false
  errors.treasury_id = false // --- [تمت الإضافة] ---
  errors.items_empty = false
  Object.keys(errors).forEach((key) => {
    if (key.includes('_')) delete errors[key]
  })

  let hasError = false

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

  // --- [تمت الإضافة]: التحقق من الخزينة ---
  if (form.paid_amount > 0 && !form.treasury_id) {
    errors.treasury_id = true
    hasError = true
  }

  const validItems = items.value.filter(
    (row) => row.item_id || row.unit_id || row.qty > 1 || row.price > 0,
  )

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

  const payload = {
    ...form,
    net_amount: grandTotal.value, // --- [تمت الإضافة]: إرسال الصافي للباك إند ---
    items: validItems.map((row) => ({
      item_id: row.item_id,
      unit_id: row.unit_id,
      description: row.description || null,
      length: row.length || null,
      width: row.width || null,
      area: row.area || null,
      qty: Number(row.qty),
      price: Number(row.price),
    })),
  }

  console.log('🚀 Payload before sending:', payload)
  emit('submit', payload)
}

// --- مراقبة البيانات (Edit Mode vs Create Mode) ---
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      const dateString = newData.invoice_date || newData.trx_date || ''
      const formattedDate = dateString ? dateString.split(/[ T]/)[0] : ''

      Object.assign(form, {
        id: newData.id,
        trx_date: formattedDate,
        partner_id: newData.partner_id || '',
        warehouse_id: newData.warehouse_id || '',
        treasury_id: newData.treasury_id || '',
        notes: newData.notes || '',
        walk_in_customer_name: newData.walk_in_customer_name || '',
        designer_id: newData.designer_id || '',
        design_commission: newData.design_commission !== null ? newData.design_commission : null,
        shipping_destination: newData.shipping_destination || '',
        paid_amount: Number(newData.paid_amount) || 0, // --- [تمت الإضافة]: جلب المبلغ للتعديل ---
        status: newData.status || 'draft',
      })

      const sourceItems = newData.details || newData.items || []
      if (sourceItems.length > 0) {
        items.value = sourceItems.map((item) => ({
          item_id: item.item_id || '',
          unit_id: item.unit_id || '',
          description: item.description || '',
          length: item.length !== null ? item.length : null,
          width: item.width !== null ? item.width : null,
          area: item.area !== null ? item.area : null,
          qty: item.qty || 1,
          price: item.price || 0,
        }))
      } else {
        items.value = [createEmptyRow()]
      }
    } else {
      Object.assign(form, {
        id: null,
        trx_date: new Date().toISOString().split('T')[0],
        partner_id: '',
        warehouse_id: currentUser.value?.warehouse_id || '',
        treasury_id: currentUser.value?.bank_id || currentUser.value?.treasury_id || '',
        notes: '',
        walk_in_customer_name: '',
        designer_id: '',
        design_commission: null,
        shipping_destination: '',
        paid_amount: 0, // --- [تمت الإضافة]: تصفير المدفوع ---
        status: 'draft',
      })
      items.value = [createEmptyRow()]
    }
  },
  { immediate: true, deep: true },
)

watch(
  () => form.paid_amount,
  (newAmount) => {
    // إذا كتب المستخدم أي مبلغ أكبر من صفر، وكانت الفاتورة مسودة، حولها فوراً لمعتمدة
    if (newAmount > 0 && form.status === 'draft') {
      form.status = 'confirmed'
    }
  },
)

const handleCancel = () => {
  emit('cancel')
}
</script>
