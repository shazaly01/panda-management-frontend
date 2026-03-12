import { defineStore } from 'pinia'
import { ref } from 'vue'
import inventoryTransactionService from '@/services/inventoryTransactionService'

export const useInventoryTransactionStore = defineStore('inventoryTransaction', () => {
  // --- State ---
  const transactions = ref([])
  const pagination = ref({})
  const currentTransaction = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchTransactions(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await inventoryTransactionService.get(page, search)
      transactions.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch inventory transactions.'
      console.error(err)
      transactions.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchTransaction(id) {
    loading.value = true
    error.value = null
    currentTransaction.value = null
    try {
      const response = await inventoryTransactionService.find(id)
      currentTransaction.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch inventory transaction.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  // في الإضافة: نضع المعاملة الجديدة في أول القائمة
  async function createTransaction(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await inventoryTransactionService.create(payload)

      // التحديث المحلي الفوري: إضافة المعاملة الجديدة في بداية المصفوفة
      if (response.data && response.data.data) {
        transactions.value.unshift(response.data.data)
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create inventory transaction.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // في التعديل: نحدث بيانات المعاملة المحددة فقط
  async function updateTransaction(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await inventoryTransactionService.update(id, payload)

      // البحث والتحديث المحلي
      const index = transactions.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        // ندمج البيانات القديمة مع القادمة من السيرفر (التي تحتوي على الـ Code الصحيح)
        transactions.value[index] = { ...transactions.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update inventory transaction.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // في الحذف: نزيل المعاملة من الشاشة فوراً
  async function deleteTransaction(id) {
    loading.value = true
    error.value = null
    try {
      await inventoryTransactionService.delete(id)

      // التصفية المحلية للحذف الفوري
      transactions.value = transactions.value.filter((t) => t.id !== id)

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete inventory transaction.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    transactions,
    pagination,
    currentTransaction,
    loading,
    error,
    fetchTransactions,
    fetchTransaction,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  }
})
