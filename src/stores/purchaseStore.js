import { defineStore } from 'pinia'
import { ref } from 'vue'
import purchaseService from '@/services/purchaseService'

export const usePurchaseStore = defineStore('purchase', () => {
  // --- State ---
  const purchases = ref([])
  const pagination = ref({})
  const currentPurchase = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchPurchases(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseService.get(page, search)
      purchases.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch purchases.'
      console.error(err)
      purchases.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchPurchase(id) {
    loading.value = true
    error.value = null
    currentPurchase.value = null
    try {
      const response = await purchaseService.find(id)
      currentPurchase.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch purchase.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  // 1. إضافة فاتورة مشتريات جديدة
  async function createPurchase(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseService.create(payload)

      // التحديث المحلي: إضافة الفاتورة الجديدة في بداية القائمة (unshift)
      // لكي يظهر رقم الفاتورة (ID) والكود المولّد تلقائياً فوراً
      if (response.data && response.data.data) {
        purchases.value.unshift(response.data.data)
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create purchase.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 2. تعديل فاتورة مشتريات
  async function updatePurchase(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await purchaseService.update(id, payload)

      // البحث والتحديث المحلي في المصفوفة
      const index = purchases.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        // دمج البيانات للتأكد من تحديث القيم المالية والتواريخ والكود
        purchases.value[index] = { ...purchases.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update purchase.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 3. حذف فاتورة مشتريات
  async function deletePurchase(id) {
    loading.value = true
    error.value = null
    try {
      await purchaseService.delete(id)

      // إخفاء الفاتورة من الجدول فوراً
      purchases.value = purchases.value.filter((p) => p.id !== id)

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete purchase.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    purchases,
    pagination,
    currentPurchase,
    loading,
    error,
    fetchPurchases,
    fetchPurchase,
    createPurchase,
    updatePurchase,
    deletePurchase,
  }
})
