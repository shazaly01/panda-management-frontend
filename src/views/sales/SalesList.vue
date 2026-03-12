<template>
  <div class="p-6 space-y-6">
    <div v-if="!showForm">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-text-primary text-blue-600">قائمة المبيعات</h1>
          <p class="text-text-muted text-sm font-medium">
            متابعة فواتير البيع وحالات الاعتماد والتحصيل
          </p>
        </div>

        <AppButton
          v-if="can('sale.create')"
          @click="openCreateForm"
          variant="primary"
          class="bg-blue-600 hover:bg-blue-700"
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
            فاتورة بيع جديدة
          </span>
        </AppButton>
      </div>

      <SalesFilters @filter="handleApplyFilters" />

      <div
        v-if="saleStore.error"
        class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100 mb-4"
      >
        {{ saleStore.error }}
      </div>

      <SalesTable
        :sales="saleStore.sales"
        :is-loading="saleStore.loading"
        @edit="openEditForm"
        @view="navigateToView"
        @print="handlePrint"
        @delete="confirmDelete"
      />

      <div
        v-if="saleStore.pagination?.total > saleStore.pagination?.per_page"
        class="flex justify-center mt-6"
      >
        <AppPagination :meta="saleStore.pagination" @page-change="handlePageChange" />
      </div>
    </div>

    <div v-else class="animate-fade-in no-print">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ editingSale ? 'تعديل فاتورة مبيعات' : 'إنشاء فاتورة مبيعات جديدة' }}
          </h2>
          <p v-if="editingSale" class="text-sm text-gray-500 mt-1">
            جاري تعديل الفاتورة رقم:
            <span class="font-bold text-blue-600">#{{ editingSale.trx_no }}</span>
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

      <SaleForm
        :initial-data="editingSale"
        :is-saving="isSaving"
        @submit="handleFormSubmit"
        @cancel="handleFormCancel"
      />
    </div>

    <PrintInvoice v-if="invoiceToPrint" :invoice="invoiceToPrint" />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useSaleStore } from '@/stores/saleStore'

// مكونات الواجهة
import AppButton from '@/components/ui/AppButton.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

// مكونات المبيعات
import SalesTable from './SalesTable.vue'
import SaleForm from './SaleForm.vue'
import PrintInvoice from './components/PrintInvoice.vue'
import SalesFilters from './SalesFilters.vue'

// --- المحركات (Stores & Router) ---
const router = useRouter()
const { can } = useAuthStore()
const saleStore = useSaleStore()

// --- متغيرات حالة الشاشة ---
const showForm = ref(false)
const editingSale = ref(null)
const isSaving = ref(false)
const invoiceToPrint = ref(null)

// حفظ حالة الفلاتر النشطة
const activeFilters = ref({})

// --- العمليات (Actions) ---

// جلب البيانات مع دمج رقم الصفحة والفلاتر النشطة
const loadData = async (page = 1) => {
  await saleStore.fetchSales({ page, ...activeFilters.value })
}

// استقبال الفلاتر الجديدة وإعادة التحميل من الصفحة الأولى
const handleApplyFilters = (filters) => {
  activeFilters.value = filters
  loadData(1)
}

// تغيير الصفحة من شريط الترقيم
const handlePageChange = (page) => {
  loadData(page)
}

// فتح شاشة الإضافة
const openCreateForm = () => {
  editingSale.value = null
  showForm.value = true
}

// فتح شاشة التعديل
const openEditForm = (sale) => {
  editingSale.value = sale
  showForm.value = true
}

// إلغاء الإضافة/التعديل والعودة للقائمة
const handleFormCancel = () => {
  showForm.value = false
  editingSale.value = null
}

// إرسال البيانات للحفظ (إضافة أو تعديل)
const handleFormSubmit = async (payload) => {
  isSaving.value = true
  try {
    if (editingSale.value && editingSale.value.id) {
      await saleStore.updateSale(editingSale.value.id, payload)
    } else {
      await saleStore.createSale(payload)
    }

    // إعادة تحميل البيانات للصفحة الحالية بعد الحفظ بنجاح
    await loadData(saleStore.pagination?.current_page || 1)
    handleFormCancel()
  } catch (err) {
    console.error('خطأ أثناء حفظ الفاتورة:', err)
  } finally {
    isSaving.value = false
  }
}

// الانتقال لصفحة عرض التفاصيل (View)
const navigateToView = (sale) => {
  router.push({ name: 'sales.view', params: { id: sale.id } })
}

// معالجة الطباعة السريعة
const handlePrint = async (sale) => {
  console.log('جاري تجهيز الطباعة للفاتورة رقم:', sale.trx_no)
  invoiceToPrint.value = sale
  // انتظار رسم مكون الطباعة في الخلفية
  await nextTick()
  // فتح نافذة طباعة المتصفح
  window.print()
}

// تأكيد الحذف
const confirmDelete = async (id) => {
  if (confirm('تحذير: هل أنت متأكد من حذف هذه الفاتورة؟ سيتم عكس التأثيرات المخزنية والمالية.')) {
    try {
      await saleStore.deleteSale(id)
      await loadData(saleStore.pagination?.current_page || 1)
    } catch (err) {
      // الأخطاء تتم معالجتها وعرضها داخل الـ Store
    }
  }
}

// تحميل البيانات عند فتح الصفحة
onMounted(() => {
  loadData()
})
</script>

<style scoped>
/* تأثير ظهور الشاشات بسلاسة */
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

/* تنسيقات الطباعة المخفية: إخفاء واجهة المستخدم وعرض الفاتورة فقط */
@media print {
  :deep(body *) {
    visibility: hidden;
  }
  .no-print {
    display: none !important;
  }
}
</style>
