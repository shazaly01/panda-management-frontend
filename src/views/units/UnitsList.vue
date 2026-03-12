<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">وحدات القياس</h1>
        <p class="text-text-muted text-sm">إدارة وحدات قياس الأصناف وتعديل بياناتها</p>
      </div>

      <AppButton v-if="can('unit.create')" @click="openCreateModal" variant="primary">
        إضافة وحدة جديدة
      </AppButton>
    </div>

    <div
      v-if="unitStore.error"
      class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100"
    >
      {{ unitStore.error }}
    </div>

    <UnitsTable
      :units="unitStore.units"
      :is-loading="unitStore.loading"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <div
      v-if="unitStore.pagination?.total > unitStore.pagination?.per_page"
      class="flex justify-center mt-6"
    >
      <AppPagination :meta="unitStore.pagination" @page-change="handlePageChange" />
    </div>

    <UnitModal
      v-model="isModalOpen"
      :unit="selectedUnit"
      :is-saving="unitStore.loading"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/authStore'
import { useUnitStore } from '@/stores/unitStore'

import AppButton from '@/components/ui/AppButton.vue'
import UnitsTable from './UnitsTable.vue'
import UnitModal from './UnitModal.vue'
// import AppPagination from '@/components/ui/AppPagination.vue'

// --- المحركات (Stores) ---
const { can } = useAuthStore()
const unitStore = useUnitStore()
const { units, loading, pagination, error } = storeToRefs(unitStore)

// --- الحالة المحلية (Local State) ---
const isModalOpen = ref(false)
const selectedUnit = ref(null)

// --- الدوال (Logic) ---

// جلب البيانات من السيرفر
const loadUnits = async (page = 1) => {
  await unitStore.fetchUnits(page)
}

// التعامل مع تغيير الصفحة
const handlePageChange = (page) => {
  loadUnits(page)
}

// فتح مودال الإضافة
const openCreateModal = () => {
  selectedUnit.value = null
  isModalOpen.value = true
}

// فتح مودال التعديل
const openEditModal = (unit) => {
  selectedUnit.value = { ...unit }
  isModalOpen.value = true
}

// حفظ البيانات (إضافة أو تعديل) عبر الـ Store
const handleSave = async (formData) => {
  try {
    if (formData.id) {
      await unitStore.updateUnit(formData.id, formData)
    } else {
      await unitStore.createUnit(formData)
    }

    // إغلاق المودال أولاً
    isModalOpen.value = false

    // إعادة التحميل مع استخدام pagination المفكك (أكثر استقراراً)
    await loadUnits(pagination.value.current_page || 1)
  } catch (err) {
    // الخطأ الآن سيظهر تلقائياً في الواجهة لأنه مربوط بـ error المفكك
    console.error('Save failed:', err)
  }
}

// تأكيد الحذف
const confirmDelete = async (id) => {
  if (confirm('هل أنت متأكد من رغبتك في حذف هذه الوحدة؟')) {
    try {
      await unitStore.deleteUnit(id)
      await loadUnits(unitStore.pagination.current_page || 1)
    } catch (error) {
      console.error('فشل عملية الحذف')
    }
  }
}

onMounted(() => {
  loadUnits()
})
</script>
