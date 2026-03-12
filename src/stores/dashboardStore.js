import { defineStore } from 'pinia'
import { ref } from 'vue'
import dashboardService from '@/services/dashboardService'

export const useDashboardStore = defineStore('dashboard', () => {
  // --- State ---
  const stats = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchStats() {
    loading.value = true
    error.value = null
    try {
      const response = await dashboardService.getStats()
      // نأخذ البيانات من response.data.data بناءً على هيكلة الـ Controller
      stats.value = response.data.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to fetch dashboard stats.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    stats,
    loading,
    error,
    fetchStats,
  }
})
