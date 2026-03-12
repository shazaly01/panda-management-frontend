// src/stores/reportStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as reportService from '@/services/reportService'

export const useReportStore = defineStore('report', () => {
  // --- 1. الحالة (State) ---

  // حالات التحميل والخطأ المشتركة
  const loading = ref(false)
  const error = ref(null)

  // بيانات تقرير المخزون الحالي (الأصناف والكميات)
  const inventoryReport = ref([])

  // بيانات تقرير حركة الصنف (كارت الصنف التراكمي)
  const itemMovement = ref([])
  const currentItemInfo = ref(null)

  // بيانات تقرير أرصدة الشركاء (العملاء والموردين)
  const partnerBalances = ref([])
  const partnerTotals = ref({ total_debit: 0, total_credit: 0 })

  // بيانات كشف الحساب التفصيلي (لجميع الحسابات)
  const accountStatement = ref(null)

  const designersReport = ref([])
  const designersTotals = ref({ grand_total_sales: 0, grand_commissions: 0 })

  // --- 2. العمليات (Actions) ---

  /**
   * جلب تقرير الأصناف والمخزون الحالي
   * @param {Number|String|null} warehouseId
   */
  async function fetchInventoryReport(warehouseId = null) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getInventoryReport(warehouseId)
      inventoryReport.value = response.data.data
    } catch (err) {
      error.value = 'فشل في جلب تقرير المخزون الحالي.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * جلب تقرير حركة صنف محدد
   * @param {Object} filters - { item_id, warehouse_id, date_from, date_to }
   */
  async function fetchItemMovement(filters) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getItemMovementReport(filters)
      itemMovement.value = response.data.data
      currentItemInfo.value = response.data.item
    } catch (err) {
      error.value = 'فشل في جلب تقرير حركة الصنف.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * جلب تقرير أرصدة العملاء والموردين
   * @param {Object} filters - { search, type, balance_status }
   */
  async function fetchPartnerBalances(filters = {}) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getPartnerBalancesReport(filters)
      partnerBalances.value = response.data.data
      partnerTotals.value = response.data.totals
    } catch (err) {
      error.value = 'فشل في جلب تقرير أرصدة الشركاء.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  /**
   * جلب كشف حساب تفصيلي (عميل، مورد، خزنة، بنك)
   * @param {Object} params - { account_type, account_id, date_from, date_to }
   */
  async function fetchAccountStatement(params) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getAccountStatementReport(params)
      accountStatement.value = response.data
    } catch (err) {
      error.value = 'فشل في جلب كشف الحساب التفصيلي.'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  async function fetchDesignersReport(filters) {
    loading.value = true
    error.value = null
    try {
      const response = await reportService.getDesignersReport(filters)
      designersReport.value = response.data.data
      designersTotals.value = response.data.totals
    } catch (err) {
      error.value = 'فشل في جلب تقرير المصممين'
    } finally {
      loading.value = false
    }
  }

  /**
   * تصفير الأخطاء والبيانات (اختياري عند مغادرة الصفحات)
   */
  function clearErrors() {
    error.value = null
  }

  // --- 3. تصدير البيانات والوظائف (Public API) ---
  return {
    // State
    loading,
    error,
    inventoryReport,
    itemMovement,
    currentItemInfo,
    partnerBalances,
    partnerTotals,
    accountStatement,
    designersReport,
    designersTotals,
    // Actions
    fetchInventoryReport,
    fetchItemMovement,
    fetchPartnerBalances,
    fetchAccountStatement,
    clearErrors,
    fetchDesignersReport,
  }
})
