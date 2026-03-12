import { defineStore } from 'pinia'
import { ref } from 'vue'
import partnerService from '@/services/partnerService'

export const usePartnerStore = defineStore('partner', () => {
  // --- State ---
  const partners = ref([])
  const pagination = ref({})
  const currentPartner = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchPartners(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await partnerService.get(page, search)
      partners.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch partners.'
      console.error(err)
      partners.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchPartner(id) {
    loading.value = true
    error.value = null
    currentPartner.value = null
    try {
      const response = await partnerService.find(id)
      currentPartner.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch partner.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  // 1. إضافة شريك جديد (عميل/مورد)
  async function createPartner(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await partnerService.create(payload)

      // التحديث المحلي: إضافة الشريك الجديد في أعلى القائمة
      // تأكد أن اسم المصفوفة هو partners.value
      if (response.data && response.data.data) {
        partners.value.unshift(response.data.data)
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create partner.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 2. تعديل بيانات شريك
  async function updatePartner(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await partnerService.update(id, payload)

      // البحث والتحديث المحلي في المصفوفة
      const index = partners.value.findIndex((p) => p.id === id)
      if (index !== -1) {
        // دمج البيانات للتأكد من تحديث الـ Code والبيانات الأخرى
        partners.value[index] = { ...partners.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update partner.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 3. حذف شريك
  async function deletePartner(id) {
    loading.value = true
    error.value = null
    try {
      await partnerService.delete(id)

      // تصفية المصفوفة لإخفاء الشريك المحذوف فوراً من الجدول
      partners.value = partners.value.filter((p) => p.id !== id)

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete partner.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }
  // --- Return public API ---
  return {
    partners,
    pagination,
    currentPartner,
    loading,
    error,
    fetchPartners,
    fetchPartner,
    createPartner,
    updatePartner,
    deletePartner,
  }
})
