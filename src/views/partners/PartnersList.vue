<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">إدارة الشركاء</h1>
        <p class="text-text-muted text-sm">
          قاعدة بيانات العملاء والموردين، الحسابات وبيانات التواصل
        </p>
      </div>

      <AppButton v-if="can('partner.create')" @click="openCreateModal" variant="primary">
        إضافة شريك جديد
      </AppButton>
    </div>

    <div
      v-if="partnerStore.error"
      class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100"
    >
      {{ partnerStore.error }}
    </div>

    <PartnersTable
      :partners="partnerStore.partners"
      :is-loading="partnerStore.loading"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <div
      v-if="partnerStore.pagination?.total > partnerStore.pagination?.per_page"
      class="flex justify-center mt-6"
    >
      <AppPagination :meta="partnerStore.pagination" @page-change="handlePageChange" />
    </div>

    <PartnerModal
      v-model="isModalOpen"
      :partner="selectedPartner"
      :is-saving="partnerStore.loading"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { usePartnerStore } from '@/stores/partnerStore'

import AppButton from '@/components/ui/AppButton.vue'
import PartnersTable from './PartnersTable.vue'
import PartnerModal from './PartnerModal.vue'
// import AppPagination from '@/components/ui/AppPagination.vue'

// --- المحركات (Stores) ---
const { can } = useAuthStore()
const partnerStore = usePartnerStore()

// --- الحالة المحلية ---
const isModalOpen = ref(false)
const selectedPartner = ref(null)

// --- العمليات (Actions) ---

// جلب البيانات مع دعم الترقيم والبحث
const loadData = async (page = 1) => {
  await partnerStore.fetchPartners(page)
}

// معالجة تغيير الصفحة
const handlePageChange = (page) => {
  loadData(page)
}

// فتح نافذة الإضافة
const openCreateModal = () => {
  selectedPartner.value = null
  isModalOpen.value = true
}

// فتح نافذة التعديل
const openEditModal = (partner) => {
  selectedPartner.value = { ...partner }
  isModalOpen.value = true
}

// تنفيذ عملية الحفظ (إضافة/تعديل)
const handleSave = async (formData) => {
  try {
    if (formData.id) {
      // استدعاء الأكشن الخاص بالتحديث من الـ Store
      await partnerStore.updatePartner(formData.id, formData)
    } else {
      // استدعاء الأكشن الخاص بالإنشاء من الـ Store
      await partnerStore.createPartner(formData)
    }
    isModalOpen.value = false
    // تحديث الجدول في الصفحة الحالية
    loadData(partnerStore.pagination.current_page || 1)
  } catch (err) {
    // الأخطاء تدار وتُعرض تلقائياً عبر حالة error في الـ Store
  }
}

// تأكيد الحذف
const confirmDelete = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا الشريك؟ سيؤدي ذلك لحذف بيانات التواصل المرتبطة به.')) {
    try {
      await partnerStore.deletePartner(id) //
      loadData(partnerStore.pagination.current_page || 1)
    } catch (err) {
      console.error('فشلت عملية الحذف')
    }
  }
}

// جلب البيانات عند تحميل المكون
onMounted(() => {
  loadData()
})
</script>
