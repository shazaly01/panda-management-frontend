import apiClient from './apiClient'

const resource = '/transfers'

export default {
  // حالياً، المسار المتاح هو فقط لإنشاء تحويل جديد
  create(payload) {
    return apiClient.post(resource, payload)
  },
}
