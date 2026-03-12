import { defineStore } from 'pinia'
import { ref } from 'vue'
import inventoryReportService from '@/services/inventoryReportService'

export const useInventoryReportStore = defineStore('inventoryReport', () => {
  // --- State ---
  const stockCardData = ref([])
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  // دالة لجلب التقرير بناءً على الفلاتر المحددة
  async function fetchStockCard(params) {
    loading.value = true
    error.value = null
    try {
      const response = await inventoryReportService.getStockCard(params)
      // نعتمد على هيكل الاستجابة، قد تكون البيانات مباشرة في data أو داخل data.data
      stockCardData.value = response.data.data || response.data
    } catch (err) {
      error.value = 'Failed to fetch stock card report.'
      console.error(err)
      stockCardData.value = []
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    stockCardData,
    loading,
    error,
    fetchStockCard,
  }
})
