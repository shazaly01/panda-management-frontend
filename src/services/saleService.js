import apiClient from './apiClient'

const resource = '/sales'

export default {
  // 1. تعديل الاستقبال ليكون كائن (Object) يحتوي على كل الفلاتر
  get(params) {
    return apiClient.get(resource, {
      params: params, // لارافيل و Axios سيتعاملان مع هذا الكائن ويحولانه إلى Query Parameters تلقائياً
    })
  },

  find(id) {
    // سيتم تمرير المعرف (الذي قد يكون رقم تسلسلي طويل TranceNo) كما هو
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

  // 2. إضافة مسار تغيير الحالة السريع
  changeStatus(id, status) {
    // نستخدم PATCH لأنه تعديل جزئي على مورد موجود
    return apiClient.patch(`${resource}/${id}/change-status`, { status })
  },
}
