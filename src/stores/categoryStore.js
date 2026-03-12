//src\stores\useCategoryStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import categoryService from '@/services/categoryService'

export const useCategoryStore = defineStore('category', () => {
  // --- State ---
  const categories = ref([])
  const categoryList = ref([]) // حالة مخصصة للقائمة المسطحة
  const pagination = ref({})
  const currentCategory = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchCategories(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await categoryService.get(page, search)
      categories.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch categories.'
      console.error(err)
      categories.value = []
    } finally {
      loading.value = false
    }
  }

  // دالة مخصصة لجلب القائمة المسطحة
  async function fetchCategoryList() {
    loading.value = true
    error.value = null
    try {
      const response = await categoryService.getList()
      // نفترض أن الـ API يرجع البيانات مباشرة في response.data أو response.data.data
      categoryList.value = response.data.data || response.data
    } catch (err) {
      error.value = 'Failed to fetch category list.'
      console.error(err)
      categoryList.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchCategory(id) {
    loading.value = true
    error.value = null
    currentCategory.value = null
    try {
      const response = await categoryService.find(id)
      currentCategory.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch category.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createCategory(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await categoryService.create(payload)
      // تحديث القائمة فوراً بجلب الصفحة الأولى
      await fetchCategories(1)
      return response.data // مهم جداً لإرجاع النتيجة للـ View
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create category.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function updateCategory(id, payload) {
    loading.value = true
    error.value = null
    try {
      // تم التصحيح هنا من updateCategoryService إلى categoryService
      const response = await categoryService.update(id, payload)

      // البحث عن التصنيف في المصفوفة المحلية وتحديث بياناته
      const index = categories.value.findIndex((cat) => cat.id === id)
      if (index !== -1) {
        // ندمج البيانات القديمة مع البيانات الجديدة العائدة من السيرفر
        categories.value[index] = { ...categories.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      // بما أن الخطأ ReferenceError، فإن err.response غير موجود
      // لذا يظهر لك النص الافتراضي 'Failed to update category.'
      error.value = err.response?.data?.message || 'Failed to update category.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteCategory(id) {
    loading.value = true
    error.value = null
    try {
      await categoryService.delete(id)

      // التحديث المحلي: حذف العنصر من المصفوفة فوراً
      // هذا السطر يجعل السجل يختفي من الجدول في أجزاء من الثانية
      categories.value = categories.value.filter((cat) => cat.id !== id)

      return true // لإعلام الـ View بنجاح العملية إذا لزم الأمر
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete category.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    categories,
    categoryList,
    pagination,
    currentCategory,
    loading,
    error,
    fetchCategories,
    fetchCategoryList,
    fetchCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})
