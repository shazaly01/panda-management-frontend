<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">دليل الأصناف</h1>
        <p class="text-text-muted text-sm">إدارة السلع، الخدمات، الأسعار، ووحدات القياس</p>
      </div>

      <AppButton v-if="can('item.create')" @click="openCreateModal" variant="primary">
        إضافة صنف جديد
      </AppButton>
    </div>

    <div
      v-if="itemStore.error"
      class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100"
    >
      {{ itemStore.error }}
    </div>

    <ItemsTable
      :items="itemStore.items"
      :is-loading="itemStore.loading"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <div
      v-if="itemStore.pagination?.total > itemStore.pagination?.per_page"
      class="flex justify-center mt-6"
    >
      <AppPagination :meta="itemStore.pagination" @page-change="handlePageChange" />
    </div>

    <ItemModal
      v-model="isModalOpen"
      :item="selectedItem"
      :is-saving="itemStore.loading"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useItemStore } from '@/stores/ItemStore.js'

import AppButton from '@/components/ui/AppButton.vue'
import ItemsTable from './ItemsTable.vue'
import ItemModal from './ItemModal.vue'
// import AppPagination from '@/components/ui/AppPagination.vue'

const { can } = useAuthStore()
const itemStore = useItemStore()

const isModalOpen = ref(false)
const selectedItem = ref(null)

// دالة جلب البيانات
const loadData = async (page = 1) => {
  await itemStore.fetchItems(page)
}

// تغيير الصفحة في الترقيم
const handlePageChange = (page) => {
  loadData(page)
}

// فتح المودال للإضافة
const openCreateModal = () => {
  selectedItem.value = null
  isModalOpen.value = true
}

// فتح المودال للتعديل (تحميل بيانات الصنف المختار)
const openEditModal = (item) => {
  selectedItem.value = { ...item }
  isModalOpen.value = true
}

// معالجة الحفظ (إرسال البيانات للـ Store)
const handleSave = async (formData) => {
  try {
    if (formData.id) {
      // تحديث صنف موجود
      await itemStore.updateItem(formData.id, formData)
    } else {
      // إنشاء صنف جديد
      await itemStore.createItem(formData)
    }
    isModalOpen.value = false
    // إعادة تحميل الصفحة الحالية لتحديث البيانات في الجدول
    loadData(itemStore.pagination.current_page || 1)
  } catch (err) {
    // الأخطاء يتم رصدها وعرضها عبر الـ Store في التنبيه أعلاه
    console.error('Save operation failed')
  }
}

// معالجة الحذف
const confirmDelete = async (id) => {
  if (
    confirm('تحذير: هل أنت متأكد من حذف هذا الصنف؟ الحذف قد يؤثر على تقارير المخزون التاريخية.')
  ) {
    try {
      await itemStore.deleteItem(id)
      loadData(itemStore.pagination.current_page || 1)
    } catch (err) {
      console.error('Delete operation failed')
    }
  }
}

// جلب البيانات عند تشغيل المكون
onMounted(() => {
  loadData()
})
</script>
