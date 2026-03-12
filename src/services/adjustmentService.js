import apiClient from './apiClient'

const resource = '/adjustments'

export default {
  // حالياً، المسار المتاح هو فقط لإنشاء تسوية جردية جديدة
  create(payload) {
    return apiClient.post(resource, payload)
  },
}
