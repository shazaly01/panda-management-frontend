import apiClient from './apiClient'

const resource = '/dashboard'

export default {
  // جلب إحصائيات لوحة التحكم
  getStats() {
    return apiClient.get(resource)
  },
}
