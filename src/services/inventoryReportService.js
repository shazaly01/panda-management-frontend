import apiClient from './apiClient'

const resource = '/reports'

export default {
  // جلب بيانات بطاقة الصنف مع تمرير معاملات البحث (الفلاتر)
  getStockCard(params) {
    // الـ params قد تحتوي على: item_id, warehouse_id, from_date, to_date
    return apiClient.get(`${resource}/stock-card`, { params })
  },
}
