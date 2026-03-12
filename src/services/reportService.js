import apiClient from './apiClient'

export const getInventoryReport = (warehouseId = null) => {
  const params = warehouseId ? { warehouse_id: warehouseId } : {}
  return apiClient.get('/reports/inventory', { params })
}

export const getItemMovementReport = (filters) => {
  return apiClient.get('/reports/item-movement', { params: filters })
}

export const getPartnerBalancesReport = (filters) => {
  return apiClient.get('/reports/partner-balances', { params: filters })
}

// +++ [جديد] كشف الحساب التفصيلي +++
export const getAccountStatementReport = (params) => {
  return apiClient.get('/reports/account-statement', { params })
}

/**
 * جلب تقرير عمولات وإنتاجية المصممين
 * @param {Object} params - { date_from, date_to }
 */
export const getDesignersReport = (params) => {
  return apiClient.get('/reports/designers', { params })
}
