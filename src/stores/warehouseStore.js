//src\stores\useWarehouseStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import warehouseService from '@/services/warehouseService'

export const useWarehouseStore = defineStore('warehouse', () => {
  // --- State ---
  const warehouses = ref([])
  const pagination = ref({})
  const currentWarehouse = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // --- Actions ---
  async function fetchWarehouses(page = 1, search = '') {
    loading.value = true
    error.value = null
    try {
      const response = await warehouseService.get(page, search)
      warehouses.value = response.data.data
      pagination.value = response.data.meta
    } catch (err) {
      error.value = 'Failed to fetch warehouses.'
      console.error(err)
      warehouses.value = []
    } finally {
      loading.value = false
    }
  }

  async function fetchWarehouse(id) {
    loading.value = true
    error.value = null
    currentWarehouse.value = null
    try {
      const response = await warehouseService.find(id)
      currentWarehouse.value = response.data.data
    } catch (err) {
      error.value = 'Failed to fetch warehouse.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }
  // 1. إضافة مستودع جديد
  async function createWarehouse(payload) {
    loading.value = true
    error.value = null
    try {
      const response = await warehouseService.create(payload)

      // التحديث المحلي: إضافة المستودع الجديد في بداية المصفوفة
      // نفترض أن اسم المصفوفة في الـ State هو warehouses.value
      if (response.data && response.data.data) {
        warehouses.value.unshift(response.data.data)
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to create warehouse.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 2. تعديل بيانات مستودع
  async function updateWarehouse(id, payload) {
    loading.value = true
    error.value = null
    try {
      const response = await warehouseService.update(id, payload)

      // البحث والتحديث المحلي في المصفوفة
      const index = warehouses.value.findIndex((w) => w.id === id)
      if (index !== -1) {
        // دمج البيانات للتأكد من تحديث الاسم، الموقع، والكود التلقائي
        warehouses.value[index] = { ...warehouses.value[index], ...response.data.data }
      }

      return response.data
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to update warehouse.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // 3. حذف مستودع
  async function deleteWarehouse(id) {
    loading.value = true
    error.value = null
    try {
      await warehouseService.delete(id)

      // إخفاء المستودع من الجدول فوراً دون انتظار إعادة تحميل الصفحة
      warehouses.value = warehouses.value.filter((w) => w.id !== id)

      return true
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to delete warehouse.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // دالة مخصصة لإسناد المخزن
  async function assignUserToWarehouse(payload) {
    loading.value = true
    error.value = null
    try {
      await warehouseService.assignUser(payload)
    } catch (err) {
      error.value = err.response?.data?.message || 'Failed to assign user to warehouse.'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // --- Return public API ---
  return {
    warehouses,
    pagination,
    currentWarehouse,
    loading,
    error,
    fetchWarehouses,
    fetchWarehouse,
    createWarehouse,
    updateWarehouse,
    deleteWarehouse,
    assignUserToWarehouse,
  }
})
