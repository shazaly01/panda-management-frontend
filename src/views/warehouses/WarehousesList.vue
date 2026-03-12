<!--src\views\warehouses\WarehousesList.vue-->
<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">إدارة المخازن</h1>
        <p class="text-text-muted text-sm">إضافة وتعديل بيانات المخازن ومواقعها</p>
      </div>

      <AppButton v-if="can('warehouse.create')" @click="openCreateModal" variant="primary">
        إضافة مخزن جديد
      </AppButton>
    </div>

    <div
      v-if="warehouseStore.error"
      class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100"
    >
      {{ warehouseStore.error }}
    </div>

    <WarehousesTable
      :warehouses="warehouseStore.warehouses"
      :is-loading="warehouseStore.loading"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <div
      v-if="warehouseStore.pagination?.total > warehouseStore.pagination?.per_page"
      class="flex justify-center mt-6"
    >
      <AppPagination :meta="warehouseStore.pagination" @page-change="handlePageChange" />
    </div>

    <WarehouseModal
      v-model="isModalOpen"
      :warehouse="selectedWarehouse"
      :is-saving="warehouseStore.loading"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useWarehouseStore } from '@/stores/warehouseStore'

import AppButton from '@/components/ui/AppButton.vue'
import WarehousesTable from './WarehousesTable.vue'
import WarehouseModal from './WarehouseModal.vue'
// import AppPagination from '@/components/ui/AppPagination.vue'

const { can } = useAuthStore()
const warehouseStore = useWarehouseStore()

const isModalOpen = ref(false)
const selectedWarehouse = ref(null)

const loadData = async (page = 1) => {
  await warehouseStore.fetchWarehouses(page)
}

const handlePageChange = (page) => {
  loadData(page)
}

const openCreateModal = () => {
  selectedWarehouse.value = null
  isModalOpen.value = true
}

const openEditModal = (warehouse) => {
  selectedWarehouse.value = { ...warehouse }
  isModalOpen.value = true
}

const handleSave = async (formData) => {
  try {
    if (formData.id) {
      await warehouseStore.updateWarehouse(formData.id, formData)
    } else {
      await warehouseStore.createWarehouse(formData)
    }
    isModalOpen.value = false
    loadData(warehouseStore.pagination.current_page || 1)
  } catch (err) {
    // الخطأ يدار في الـ Store
  }
}

const confirmDelete = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا المخزن؟ قد يؤثر ذلك على الحركات المرتبطة به.')) {
    try {
      await warehouseStore.deleteWarehouse(id)
      loadData(warehouseStore.pagination.current_page || 1)
    } catch (err) {
      console.error('Delete failed')
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
