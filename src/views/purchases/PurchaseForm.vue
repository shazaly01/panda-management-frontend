<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <PurchaseFormHeader v-model:form="form" :errors="errors" />

    <PurchaseFormItems v-model="items" :errors="errors" />

    <PurchaseFormActions
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

// استيراد المكونات الفرعية المحدثة
import PurchaseFormHeader from './components/PurchaseFormHeader.vue'
import PurchaseFormItems from './components/PurchaseFormItems.vue'
import PurchaseFormActions from './components/PurchaseFormActions.vue'

const props = defineProps({
  initialData: { type: Object, default: null },
  isSaving: { type: Boolean, default: false },
})

const emit = defineEmits(['submit', 'cancel'])

// جلب بيانات المستخدم لتعيين المخزن والخزينة الافتراضية
const authStore = useAuthStore()
const currentUser = computed(() => authStore.user || {})

// --- State (حالة البيانات) ---
const form = reactive({
  id: null,
  trx_date: new Date().toISOString().split('T')[0],
  partner_id: '',
  warehouse_id: currentUser.value.warehouse_id || '',
  treasury_id: currentUser.value.bank_id || currentUser.value.treasury_id || '',
  notes: '',
  paid_amount: 0, // 🌟 [جديد] المبلغ المدفوع للمورد
  status: 'draft', // 🌟 [جديد] حالة العملية (draft = طلب شراء، confirmed = إدخال فعلي)
})

const createEmptyRow = () => ({
  item_id: '',
  unit_id: '',
  qty: 1,
  price: 0,
})

const items = ref([createEmptyRow()])

const errors = reactive({
  trx_date: false,
  partner_id: false,
  warehouse_id: false,
  treasury_id: false, // 🌟 [جديد] للتحقق من الخزينة عند الدفع
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
  // 1. إعادة تعيين الأخطاء
  errors.trx_date = false
  errors.partner_id = false
  errors.warehouse_id = false
  errors.treasury_id = false
  errors.items_empty = false

  Object.keys(errors).forEach((key) => {
    if (key.includes('_')) delete errors[key] // حذف أخطاء الأصناف الديناميكية
  })

  let hasError = false

  // 2. التحقق من البيانات الأساسية
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

  // 🌟 [جديد] التحقق من الخزينة: إذا دفع مبلغاً، يجب تحديد الخزينة التي تم الصرف منها
  if (form.paid_amount > 0 && !form.treasury_id) {
    errors.treasury_id = true
    hasError = true
  }

  // 3. فلترة الأصناف الصالحة والتحقق منها
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

  // 4. تجهيز البيانات للإرسال (Payload)
  const payload = {
    ...form,
    net_amount: grandTotal.value, // 🌟 إرسال الصافي للباك إند
    items: validItems.map((row) => ({
      item_id: row.item_id,
      unit_id: row.unit_id,
      qty: Number(row.qty),
      price: Number(row.price),
    })),
  }

  emit('submit', payload)
}

// --- مراقبة البيانات (تعبئة النموذج عند التعديل) ---
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      // وضع التعديل (Edit Mode)
      const dateString = newData.invoice_date || newData.trx_date || ''
      const formattedDate = dateString ? dateString.split(/[ T]/)[0] : ''

      Object.assign(form, {
        id: newData.id,
        trx_date: formattedDate || new Date().toISOString().split('T')[0],
        partner_id: newData.partner_id || '',
        warehouse_id: newData.warehouse_id || '',
        treasury_id: newData.treasury_id || '',
        notes: newData.notes || '',
        paid_amount: Number(newData.paid_amount) || 0, // 🌟 استرجاع الدفعة
        status: newData.status || 'draft', // 🌟 استرجاع الحالة
      })

      // تعبئة تفاصيل الأصناف
      const sourceItems = newData.details || newData.items || []
      if (sourceItems.length > 0) {
        items.value = sourceItems.map((item) => ({
          item_id: item.item_id || '',
          unit_id: item.unit_id || '',
          qty: Number(item.qty) || 1,
          price: Number(item.price) || 0,
        }))
      } else {
        items.value = [createEmptyRow()]
      }
    } else {
      // وضع الإنشاء (Create Mode) - تصفير الحقول
      Object.assign(form, {
        id: null,
        trx_date: new Date().toISOString().split('T')[0],
        partner_id: '',
        warehouse_id: currentUser.value?.warehouse_id || '',
        treasury_id: currentUser.value?.bank_id || currentUser.value?.treasury_id || '',
        notes: '',
        paid_amount: 0,
        status: 'draft',
      })
      items.value = [createEmptyRow()]
    }
  },
  { immediate: true, deep: true },
)

// 🌟 مراقبة المبلغ المدفوع: إذا قام بالدفع، حوّل الحالة إجبارياً إلى "إدخال فعلي"
watch(
  () => form.paid_amount,
  (newAmount) => {
    if (newAmount > 0 && form.status === 'draft') {
      form.status = 'confirmed'
    }
  },
)

const handleCancel = () => {
  emit('cancel')
}
</script>
