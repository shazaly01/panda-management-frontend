<!---->
<template>
  <div class="p-6 space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold text-indigo-600 dark:text-indigo-400">التحويلات المخزنية</h1>
        <p class="text-text-muted text-sm font-medium">
          متابعة حركة نقل الأصناف بين فروع ومخازن المؤسسة
        </p>
      </div>

      <AppButton
        v-if="can('inventory-trx.create')"
        @click="navigateToCreate"
        variant="primary"
        class="bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
      >
        <span class="flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          عملية تحويل جديدة
        </span>
      </AppButton>
    </div>

    <div
      v-if="trxStore.error"
      class="bg-rose-50 text-rose-600 p-4 rounded-lg text-sm font-bold border border-rose-100"
    >
      {{ trxStore.error }}
    </div>

    <TransfersTable
      :transfers="trxStore.transactions"
      :is-loading="trxStore.loading"
      @edit="navigateToEdit"
      @view="navigateToView"
      @print="handlePrint"
      @delete="confirmDelete"
    />

    <div
      v-if="trxStore.pagination?.total > trxStore.pagination?.per_page"
      class="flex justify-center mt-6"
    >
      <AppPagination :meta="trxStore.pagination" @page-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useInventoryTransactionStore } from '@/stores/inventoryTransactionStore'

import AppButton from '@/components/ui/AppButton.vue'
import TransfersTable from './TransfersTable.vue'
// import AppPagination from '@/components/ui/AppPagination.vue'

const router = useRouter()
const { can } = useAuthStore()
const trxStore = useInventoryTransactionStore()

// جلب البيانات (ملاحظة: غالباً ستحتاج لتمرير نوع الحركة 'transfer' إذا كان الباك إند يوحد الجدول)
const loadData = async (page = 1) => {
  await trxStore.fetchTransactions(page, 'transfer')
}

const handlePageChange = (page) => loadData(page)

const navigateToCreate = () => router.push({ name: 'transfers.create' })
const navigateToEdit = (item) => router.push({ name: 'transfers.edit', params: { id: item.id } })
const navigateToView = (item) => router.push({ name: 'transfers.view', params: { id: item.id } })

const handlePrint = (item) => {
  window.open(`/api/inventory-transactions/${item.id}/print`, '_blank')
}

const confirmDelete = async (id) => {
  if (confirm('هل أنت متأكد من حذف عملية التحويل؟ سيتم إرجاع الكميات للمخازن الأصلية.')) {
    try {
      await trxStore.deleteTransaction(id)
      await loadData(trxStore.pagination.current_page || 1)
    } catch (err) {
      console.error(err)
    }
  }
}

onMounted(() => loadData())
</script>
