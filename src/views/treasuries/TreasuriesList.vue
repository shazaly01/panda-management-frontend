<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">الخزائن والحسابات البنكية</h1>
        <p class="text-text-muted text-sm font-medium">
          إدارة نقاط التحصيل، الخزائن النقدية، وحسابات البنوك
        </p>
      </div>

      <AppButton
        v-if="can('treasury.create')"
        @click="openCreateModal"
        variant="primary"
        class="bg-emerald-600 hover:bg-emerald-700"
      >
        إضافة خزينة / بنك
      </AppButton>
    </div>

    <div
      v-if="treasuryStore.error"
      class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100"
    >
      {{ treasuryStore.error }}
    </div>

    <TreasuriesTable
      :treasuries="treasuryStore.treasuries"
      :is-loading="treasuryStore.loading"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <AppPagination :meta="treasuryStore.pagination" @page-change="handlePageChange" />

    <TreasuryModal
      v-model="isModalOpen"
      :treasury="selectedTreasury"
      :is-saving="treasuryStore.loading"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useTreasuryStore } from '@/stores/treasuryStore'

import AppButton from '@/components/ui/AppButton.vue'
import TreasuriesTable from './TreasuriesTable.vue'
import TreasuryModal from './TreasuryModal.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

// --- المحركات (Stores) ---
const { can } = useAuthStore()
const treasuryStore = useTreasuryStore()

// --- الحالة المحلية ---
const isModalOpen = ref(false)
const selectedTreasury = ref(null)

// --- العمليات (Actions) ---

// جلب البيانات مع دعم الترقيم
const loadData = async (page = 1) => {
  await treasuryStore.fetchTreasuries(page)
}

// معالجة تغيير الصفحة عبر الترقيم
const handlePageChange = (page) => {
  loadData(page)
}

// فتح مودال الإضافة
const openCreateModal = () => {
  selectedTreasury.value = null
  isModalOpen.value = true
}

// فتح مودال التعديل
const openEditModal = (treasury) => {
  selectedTreasury.value = { ...treasury }
  isModalOpen.value = true
}

// تنفيذ الحفظ (إضافة أو تعديل)
const handleSave = async (formData) => {
  try {
    if (formData.id) {
      await treasuryStore.updateTreasury(formData.id, formData)
    } else {
      await treasuryStore.createTreasury(formData)
    }
    isModalOpen.value = false
    loadData(treasuryStore.pagination.current_page || 1)
  } catch (err) {
    // الخطأ يظهر تلقائياً عبر تنبيه الـ Store في الـ template
  }
}

// تأكيد الحذف
const confirmDelete = async (id) => {
  if (
    confirm(
      'تحذير: حذف الخزينة قد يؤدي لمشاكل في العمليات المالية المرتبطة بها. هل تريد الاستمرار؟',
    )
  ) {
    try {
      await treasuryStore.deleteTreasury(id)
      loadData(treasuryStore.pagination.current_page || 1)
    } catch (err) {
      console.error('فشلت عملية الحذف')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
