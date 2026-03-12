import { defineStore } from 'pinia'
import { ref } from 'vue'
import transferService from '@/services/transferService'

export const useTransferStore = defineStore('transfer', () => {
  // --- State ---
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  // دالة لإنشاء تحويل جديد
  async function createTransfer(payload) {
    loading.value = true
    error.value = null
    try {
      await transferService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create transfer.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    loading,
    error,
    createTransfer,
  }
})
