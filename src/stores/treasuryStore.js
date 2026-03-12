import { defineStore } from 'pinia'
import { ref } from 'vue'
import treasuryService from '@/services/treasuryService'

export const useTreasuryStore = defineStore('treasury', () => {
  // --- State ---
  const treasuries = ref([])
  const pagination = ref({})
  const currentTreasury = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchTreasuries(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await treasuryService.get(page, search)
      treasuries.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch treasuries.'
      console.error(err)
      treasuries.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchTreasury(id) {
    loading.value = true
    error.value = null
    currentTreasury.value = null
    try {
      const response = await treasuryService.find(id)
      currentTreasury.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch treasury.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  // 1. إضافة خزينة جديدة
  async function createTreasury(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await treasuryService.create(payload)

      // التحديث المحلي: إضافة الخزينة الجديدة في بداية القائمة
      // تأكد من أن اسم المصفوفة في الـ State هو treasuries.value
      if (response.data && response.data.data) {
        treasuries.value.unshift(response.data.data)
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create treasury.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 2. تعديل بيانات خزينة
  async function updateTreasury(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await treasuryService.update(id, payload)

      // البحث والتحديث المحلي في المصفوفة لضمان انعكاس الاسم أو الكود الجديد
      const index = treasuries.value.findIndex((t) => t.id === id)
      if (index !== -1) {
        treasuries.value[index] = { ...treasuries.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update treasury.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 3. حذف خزينة
  async function deleteTreasury(id) {
    loading.value = true
    error.value = null
    try {
      await treasuryService.delete(id)

      // إخفاء الخزينة من الجدول فوراً
      treasuries.value = treasuries.value.filter((t) => t.id !== id)

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete treasury.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // دالة مخصصة لإسناد الخزينة
  async function assignUserToTreasury(payload) {
    loading.value = true
    error.value = null
    try {
      await treasuryService.assignUser(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to assign user to treasury.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    treasuries,
    pagination,
    currentTreasury,
    loading,
    error,
    fetchTreasuries,
    fetchTreasury,
    createTreasury,
    updateTreasury,
    deleteTreasury,
    assignUserToTreasury,
  }
})
