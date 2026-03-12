<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-text-primary">تصنيفات الأصناف</h1>
        <p class="text-text-muted text-sm">تنظيم الأصناف في شجرة تصنيفات واضحة</p>
      </div>

      <AppButton v-if="can('category.create')" @click="openCreateModal" variant="primary">
        إضافة تصنيف جديد
      </AppButton>
    </div>

    <div
      v-if="categoryStore.error"
      class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100"
    >
      {{ categoryStore.error }}
    </div>

    <CategoriesTable
      :categories="categoryStore.categories"
      :is-loading="categoryStore.loading"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <div
      v-if="categoryStore.pagination?.total > categoryStore.pagination?.per_page"
      class="flex justify-center mt-6"
    >
      <AppPagination :meta="categoryStore.pagination" @page-change="handlePageChange" />
    </div>

    <CategoryModal
      v-model="isModalOpen"
      :category="selectedCategory"
      :is-saving="categoryStore.loading"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia' // أضفنا هذا لضمان تحديث الواجهة فوراً
import { useAuthStore } from '@/stores/authStore'
import { useCategoryStore } from '@/stores/categoryStore'

import AppButton from '@/components/ui/AppButton.vue'
import CategoriesTable from './CategoriesTable.vue'
import CategoryModal from './CategoryModal.vue'
import AppPagination from '@/components/ui/AppPagination.vue'

// --- المحركات (Stores) ---
const { can } = useAuthStore()
const categoryStore = useCategoryStore()

// فك تغليف البيانات من الـ Store لضمان استجابة الجدول لحظياً
const { pagination, loading, error } = storeToRefs(categoryStore)

// --- الحالة المحلية (Local State) ---
const isModalOpen = ref(false)
const selectedCategory = ref(null)

// --- الدوال (Logic) ---

// جلب البيانات مع دعم الترقيم
const loadData = async (page = 1) => {
  await categoryStore.fetchCategories(page)
}

const handlePageChange = (page) => {
  loadData(page)
}

const openCreateModal = () => {
  selectedCategory.value = null
  isModalOpen.value = true
}

const openEditModal = (category) => {
  selectedCategory.value = { ...category }
  isModalOpen.value = true
}

// حفظ البيانات (إضافة أو تعديل)
const handleSave = async (formData) => {
  try {
    if (formData.id) {
      await categoryStore.updateCategory(formData.id, formData)
    } else {
      await categoryStore.createCategory(formData)
    }

    // إغلاق المودال بعد النجاح
    isModalOpen.value = false

    // إعادة تحميل الصفحة الحالية لضمان تزامن البيانات والأكواد الجديدة
    await loadData(pagination.value?.current_page || 1)
  } catch (err) {
    // الأخطاء تدار وتُعرض تلقائياً عبر كائن error في الـ Store
  }
}

// حذف تصنيف
const confirmDelete = async (id) => {
  if (confirm('هل أنت متأكد من حذف هذا التصنيف؟ سيتم فك ارتباط الأصناف التابعة له.')) {
    try {
      await categoryStore.deleteCategory(id)
      // التحديث بعد الحذف
      await loadData(pagination.value?.current_page || 1)
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }
}

onMounted(() => {
  loadData()
})
</script>
