import { defineStore } from 'pinia'
import { ref } from 'vue'
import saleService from '@/services/saleService'

export const useSaleStore = defineStore('sale', () => {
  // --- State ---
  const sales = ref([])
  const pagination = ref({})
  const currentSale = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchSales(params = { page: 1 }) {
    loading.value = true
    error.value = null
    try {
      // نمرر كائن الـ params بالكامل إلى دالة get
      const response = await saleService.get(params)
      sales.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch sales.'
      console.error(err)
      sales.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchSale(id) {
    loading.value = true
    error.value = null
    currentSale.value = null
    try {
      const response = await saleService.find(id)
      currentSale.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch sale.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  // 1. إضافة فاتورة مبيعات جديدة
  async function createSale(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await saleService.create(payload)

      // التحديث المحلي: إضافة الفاتورة الجديدة في أعلى القائمة فوراً
      // هذا يضمن ظهور رقم الفاتورة (ID) والكود الناتج في الجدول بلمح البصر
      if (response.data && response.data.data) {
        sales.value.unshift(response.data.data)
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create sale.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 2. تعديل فاتورة مبيعات
  async function updateSale(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await saleService.update(id, payload)

      // البحث والتحديث المحلي في المصفوفة
      const index = sales.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        // تحديث البيانات بالقيم الجديدة القادمة من السيرفر (إجمالي الفاتورة، الضرائب، إلخ)
        sales.value[index] = { ...sales.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update sale.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 3. حذف فاتورة مبيعات
  async function deleteSale(id) {
    loading.value = true
    error.value = null
    try {
      await saleService.delete(id)

      // إخفاء الفاتورة من الشاشة فوراً
      sales.value = sales.value.filter((s) => s.id !== id)

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete sale.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 4. تغيير حالة الفاتورة (الاعتماد السريع / الإرجاع لمسودة)
  async function changeSaleStatus(id, status) {
    loading.value = true
    error.value = null
    try {
      // نفترض أنك ستضيف دالة changeStatus في saleService
      const response = await saleService.changeStatus(id, status)

      // التحديث المحلي في المصفوفة لتتغير الحالة في الجدول فوراً بدون إعادة تحميل
      const index = sales.value.findIndex((s) => s.id === id)
      if (index !== -1) {
        sales.value[index] = { ...sales.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to change sale status.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }
  // --- Return public API ---
  return {
    sales,
    pagination,
    currentSale,
    loading,
    error,
    fetchSales,
    fetchSale,
    createSale,
    updateSale,
    deleteSale,
    changeSaleStatus,
  }
})
