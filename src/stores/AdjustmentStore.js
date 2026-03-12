import { defineStore } from 'pinia'
import { ref } from 'vue'
import adjustmentService from '@/services/adjustmentService'

export const useAdjustmentStore = defineStore('adjustment', () => {
  // --- State ---
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  // دالة لإنشاء تسوية جردية جديدة
  async function createAdjustment(payload) {
    loading.value = true
    error.value = null
    try {
      await adjustmentService.create(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create adjustment.'
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
    createAdjustment,
  }
})
