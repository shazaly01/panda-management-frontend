//src\stores\unitStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import unitService from '@/services/unitService'

export const useUnitStore = defineStore('unit', () => {
  // --- State ---
  const units = ref([])
  const pagination = ref({})
  const currentUnit = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchUnits(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await unitService.get(page, search)
      units.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch units.'
      console.error(err)
      units.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchUnit(id) {
    loading.value = true
    error.value = null
    currentUnit.value = null
    try {
      const response = await unitService.find(id)
      currentUnit.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch unit.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function createUnit(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await unitService.create(payload)
      // تحديث القائمة فوراً بجلب الصفحة الأولى (حيث يظهر العنصر الجديد عادة)
      await fetchUnits(1)
      return response.data // إرجاع البيانات للـ View إذا لزم الأمر
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create unit.'
      throw err
    } finally {
      loading.value = false
    }
  }
  async function updateUnit(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await unitService.update(id, payload)
      // تحديث العنصر في المصفوفة محلياً دون الحاجة لطلب fetchUnits كامل
      const index = units.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        units.value[index] = { ...units.value[index], ...response.data.data }
      }
      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update unit.'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function deleteUnit(id) {
    loading.value = true
    error.value = null
    try {
      await unitService.delete(id)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete unit.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    units,
    pagination,
    currentUnit,
    loading,
    error,
    fetchUnits,
    fetchUnit,
    createUnit,
    updateUnit,
    deleteUnit,
  }
})
