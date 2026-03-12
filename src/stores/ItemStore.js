import { defineStore } from 'pinia'
import { ref } from 'vue'
import itemService from '@/services/itemService'

export const useItemStore = defineStore('item', () => {
  // --- State ---
  const items = ref([])
  const pagination = ref({})
  const currentItem = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchItems(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await itemService.get(page, search)
      items.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch items.'
      console.error(err)
      items.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchItem(id) {
    loading.value = true
    error.value = null
    currentItem.value = null
    try {
      const response = await itemService.find(id)
      currentItem.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch item.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  // 1. إضافة صنف جديد: نضعه في أعلى القائمة ليظهر الرقم (ID) الجديد فوراً
  async function createItem(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await itemService.create(payload)

      // التحديث المحلي: إضافة الصنف الجديد في بداية المصفوفة
      if (response.data && response.data.data) {
        items.value.unshift(response.data.data)
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create item.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 2. تعديل صنف: نبحث عنه في المصفوفة ونحدث بياناته (بما فيها الكود)
  async function updateItem(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await itemService.update(id, payload)

      // البحث والتحديث المحلي في المصفوفة
      const index = items.value.findIndex((i) => i.id === id)
      if (index !== -1) {
        // دمج البيانات القديمة مع الاستجابة الجديدة من السيرفر
        items.value[index] = { ...items.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update item.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // 3. حذف صنف: إزالته من المصفوفة فور نجاح طلب الحذف
  async function deleteItem(id) {
    loading.value = true
    error.value = null
    try {
      await itemService.delete(id)

      // التصفية المحلية لحذف الصف من الجدول فوراً
      items.value = items.value.filter((i) => i.id !== id)

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete item.'
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    items,
    pagination,
    currentItem,
    loading,
    error,
    fetchItems,
    fetchItem,
    createItem,
    updateItem,
    deleteItem,
  }
})
