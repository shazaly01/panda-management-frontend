//src\services\warehouseService.js
import apiClient from './apiClient'

const resource = '/warehouses'

export default {
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search,
      },
    })
  },

  find(id) {
    return apiClient.get(`${resource}/${id}`)
  },

  create(payload) {
    return apiClient.post(resource, payload)
  },

  update(id, payload) {
    return apiClient.put(`${resource}/${id}`, payload)
  },

  delete(id) {
    return apiClient.delete(`${resource}/${id}`)
  },

  // مسار مخصص لإسناد المخزن لمستخدم
  assignUser(payload) {
    // نتوقع أن يحتوي الـ payload على warehouse_id و user_id
    return apiClient.post(`${resource}/assign-user`, payload)
  },
}
