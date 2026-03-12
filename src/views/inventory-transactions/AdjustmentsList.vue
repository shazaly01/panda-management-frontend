<template>
  <div class="p-6 space-y-6">
    <div v-if="!showForm">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-2xl font-bold text-amber-600 dark:text-amber-400">التسويات الجردية</h1>
          <p class="text-text-muted text-sm font-medium">
            معالجة فروقات الجرد (عجز / زيادة) لتصحيح الأرصدة المخزنية
          </p>
        </div>

        <AppButton
          v-if="can('adjustment.create')"
          @click="openCreateForm"
          variant="primary"
          class="bg-amber-500 hover:bg-amber-600 focus:ring-amber-500"
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            إجراء تسوية جديدة
          </span>
        </AppButton>
      </div>

      <div
        v-if="trxStore.error"
        class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100"
      >
        {{ trxStore.error }}
      </div>

      <AdjustmentsTable
        :adjustments="trxStore.transactions"
        :is-loading="trxStore.loading"
        @edit="openEditForm"
        @view="navigateToView"
        @delete="confirmDelete"
      />

      <div
        v-if="trxStore.pagination?.total > trxStore.pagination?.per_page"
        class="flex justify-center mt-6"
      >
        <AppPagination :meta="trxStore.pagination" @page-change="handlePageChange" />
      </div>
    </div>

    <div v-else class="animate-fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-white">
            {{ editingAdjustment ? 'تعديل تسوية جردية' : 'إجراء تسوية جردية جديدة' }}
          </h2>
          <p v-if="editingAdjustment" class="text-sm text-gray-500 mt-1">
            جاري تعديل التسوية رقم:
            <span class="font-bold text-amber-600">#{{ editingAdjustment.code }}</span>
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

      <AdjustmentForm
        :initial-data="editingAdjustment"
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
import { useInventoryTransactionStore } from '@/stores/inventoryTransactionStore'

import AppButton from '@/components/ui/AppButton.vue'
import AdjustmentsTable from './AdjustmentsTable.vue'
import AdjustmentForm from './AdjustmentForm.vue' // <-- استيراد الفورم

const router = useRouter()
const { can } = useAuthStore()
const trxStore = useInventoryTransactionStore()

// --- حالة الشاشة ---
const showForm = ref(false)
const editingAdjustment = ref(null)
const isSaving = ref(false)

// --- العمليات ---
const loadData = async (page = 1) => {
  await trxStore.fetchTransactions(page, 'adjustment')
}

const handlePageChange = (page) => loadData(page)

// 1. فتح فورم الإنشاء
const openCreateForm = () => {
  editingAdjustment.value = null
  showForm.value = true
}

// 2. فتح فورم التعديل (مع جلب التفاصيل الكاملة لتجنب فراغ الحقول)
const openEditForm = async (item) => {
  isSaving.value = true
  try {
    // افترضنا أن الـ store يحتوي على دالة fetchTransaction لجلب الحركة بتفاصيلها
    await trxStore.fetchTransaction(item.id)
    if (trxStore.currentTransaction) {
      editingAdjustment.value = trxStore.currentTransaction
      showForm.value = true
    }
  } catch (err) {
    console.error('فشل تحميل تفاصيل التسوية:', err)
  } finally {
    isSaving.value = false
  }
}

// 3. الإلغاء
const handleFormCancel = () => {
  showForm.value = false
  editingAdjustment.value = null
}

// 4. معالجة الحفظ
const handleFormSubmit = async (payload) => {
  isSaving.value = true
  try {
    if (editingAdjustment.value && editingAdjustment.value.id) {
      await trxStore.updateTransaction(editingAdjustment.value.id, payload)
    } else {
      await trxStore.createTransaction(payload)
    }
    await loadData(trxStore.pagination?.current_page || 1)
    handleFormCancel()
  } catch (err) {
    console.error('خطأ أثناء الحفظ:', err)
  } finally {
    isSaving.value = false
  }
}

const navigateToView = (item) => {
  router.push({ name: 'adjustments.view', params: { id: item.id } })
}

const confirmDelete = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذه التسوية؟ سيتم عكس التعديلات التي تمت على رصيد المخزن.')) {
    try {
      await trxStore.deleteTransaction(id)
      await loadData(trxStore.pagination?.current_page || 1)
    } catch (err) {
      console.error(err)
    }
  }
}

onMounted(() => loadData())
</script>

<style scoped>
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
