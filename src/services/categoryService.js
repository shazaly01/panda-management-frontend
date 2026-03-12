//src\services\categoryService.js
import apiClient from './apiClient'

const resource = '/categories'

export default {
  // جلب البيانات مع الترقيم والبحث (للجداول)
  get(page = 1, search = '') {
    return apiClient.get(resource, {
      params: {
        page: page,
        search: search,
      },
    })
  },

  // جلب قائمة مسطحة بدون ترقيم (للقوائم المنسدلة Dropdowns)
  getList() {
    return apiClient.get(`${resource}/list`)
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
}
