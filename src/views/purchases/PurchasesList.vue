<template>
  <div class="p-6 space-y-6">
    <div v-if="!showForm">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            فواتير المشتريات
          </h1>
          <p class="text-text-muted text-sm font-medium">
            إدارة فواتير الشراء من الموردين ومتابعة دخول البضاعة
          </p>
        </div>

        <AppButton
          v-if="can('purchase.create')"
          @click="openCreateForm"
          variant="primary"
          class="bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500"
        >
          <span class="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            فاتورة شراء جديدة
          </span>
        </AppButton>
      </div>

      <div
        v-if="purchaseStore.error"
        class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100 mb-4"
      >
        {{ purchaseStore.error }}
      </div>

      <PurchasesTable
        :purchases="purchaseStore.purchases"
        :is-loading="purchaseStore.loading"
        @edit="openEditForm"
        @view="navigateToView"
        @print="handlePrint"
        @delete="confirmDelete"
      />

      <div
        v-if="purchaseStore.pagination?.total > purchaseStore.pagination?.per_page"
        class="flex justify-center mt-6"
      >
        <AppPagination :meta="purchaseStore.pagination" @page-change="handlePageChange" />
      </div>
    </div>

    <div v-else class="animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ editingPurchase ? 'تعديل فاتورة مشتريات' : 'إنشاء فاتورة مشتريات جديدة' }}
          </h2>
          <p v-if="editingPurchase" class="text-sm text-gray-500 mt-1">
            جاري تعديل الفاتورة رقم:
            <span class="font-bold text-emerald-600">#{{ editingPurchase.id }}</span>
          </p>
        </div>

        <button
          @click="handleFormCancel"
          class="flex items-center gap-1 text-gray-500 hover:text-gray-800 dark:hover:text-gray-300 font-medium transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-4 py-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          العودة للقائمة
        </button>
      </div>

      <PurchaseForm
        :initial-data="editingPurchase"
        :is-saving="isSaving"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { usePurchaseStore } from '@/stores/purchaseStore'

import AppButton from '@/components/ui/AppButton.vue'
import PurchasesTable from './PurchasesTable.vue'
import PurchaseForm from './PurchaseForm.vue' // <-- استيراد شاشة الإدخال الجديدة

// --- المحركات ---
const router = useRouter()
const { can } = useAuthStore()
const purchaseStore = usePurchaseStore()

// --- متغيرات حالة الشاشة (الجديدة) ---
const showForm = ref(false) // للتحكم في التبديل بين الجدول والفورم
const editingPurchase = ref(null) // لتخزين بيانات الفاتورة المراد تعديلها
const isSaving = ref(false) // حالة زر الحفظ

// --- العمليات (Actions) ---

const loadData = async (page = 1) => {
  await purchaseStore.fetchPurchases(page)
}

const handlePageChange = (page) => {
  loadData(page)
}

// 1. فتح نموذج الإضافة
const openCreateForm = () => {
  editingPurchase.value = null
  showForm.value = true
}

// 2. فتح نموذج التعديل
// 2. فتح نموذج التعديل
const openEditForm = async (purchase) => {
  // 1. إظهار حالة تحميل (اختياري لكن يفضل)
  isSaving.value = true

  try {
    // 2. جلب تفاصيل الفاتورة كاملة من السيرفر (تحتوي على items)
    await purchaseStore.fetchPurchase(purchase.id)

    // 3. التحقق من وجود البيانات ثم تمريرها للفورم
    if (purchaseStore.currentPurchase) {
      editingPurchase.value = purchaseStore.currentPurchase
      showForm.value = true // فتح الفورم الآن
    }
  } catch (error) {
    console.error('فشل تحميل تفاصيل الفاتورة:', error)
  } finally {
    isSaving.value = false
  }
}

// 3. إغلاق النموذج والعودة للجدول
const handleFormCancel = () => {
  showForm.value = false
  editingPurchase.value = null
}

// 4. استقبال البيانات من الفورم وإرسالها لـ Store
const handleFormSubmit = async (payload) => {
  isSaving.value = true
  try {
    if (editingPurchase.value && editingPurchase.value.id) {
      // تعديل
      await purchaseStore.updatePurchase(editingPurchase.value.id, payload)
    } else {
      // إنشاء جديد
      await purchaseStore.createPurchase(payload)
    }

    // بعد النجاح: تحديث الجدول وإغلاق الفورم
    await loadData(purchaseStore.pagination?.current_page || 1)
    handleFormCancel()
  } catch (err) {
    console.error('خطأ أثناء حفظ الفاتورة:', err)
  } finally {
    isSaving.value = false
  }
}

// التنقل لصفحة العرض والطباعة والحذف (بقت كما هي)
const navigateToView = (purchase) => {
  router.push({ name: 'purchases.view', params: { id: purchase.id } })
}

const handlePrint = (purchase) => {
  window.open(`/api/purchases/${purchase.id}/print`, '_blank')
}

const confirmDelete = async (id) => {
  if (
    confirm('هل أنت متأكد من حذف فاتورة الشراء هذه؟ سيتم حذف الأصناف من المخازن وعكس القيد المالي.')
  ) {
    try {
      await purchaseStore.deletePurchase(id)
      await loadData(purchaseStore.pagination?.current_page || 1)
    } catch (err) {
      console.error('فشل عملية الحذف')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* تأثير الظهور المتدرج عند فتح الفورم */
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
