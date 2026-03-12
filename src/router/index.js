import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

// --- استيراد التخطيطات الرئيسية (Layouts) ---
import AppLayout from '@/components/layout/AppLayout.vue'
import AuthLayout from '@/components/layout/AuthLayout.vue'

// --- استيراد الصفحات الأساسية ---
import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/dashboard/DashboardView.vue'

// --- استيراد صفحات إدارة النظام الأساسية (الموجودة مسبقاً) ---
const UsersList = () => import('@/views/users/UsersList.vue')
const RolesList = () => import('@/views/roles/RolesList.vue')
const BackupsList = () => import('@/views/settings/BackupsList.vue')

// --- استيراد صفحات البيانات الأساسية (Master Data) ---
const UnitsList = () => import('@/views/units/UnitsList.vue')
const CategoriesList = () => import('@/views/categories/CategoriesList.vue')
const ItemsList = () => import('@/views/items/ItemsList.vue')

// --- استيراد صفحات الكيانات (Entities) ---
const WarehousesList = () => import('@/views/warehouses/WarehousesList.vue')
const PartnersList = () => import('@/views/partners/PartnersList.vue')
const TreasuriesList = () => import('@/views/treasuries/TreasuriesList.vue')

// --- استيراد صفحات العمليات والحركات (Transactions) ---
const SalesList = () => import('@/views/sales/SalesList.vue')
const PurchasesList = () => import('@/views/purchases/PurchasesList.vue')
const TransfersList = () => import('@/views/inventory-transactions/TransfersList.vue')
const AdjustmentsList = () => import('@/views/inventory-transactions/AdjustmentsList.vue')

// --- استيراد صفحات التقارير (Reports) ---
const InventoryReport = () => import('@/views/reports/InventoryReport.vue')
const ItemMovementReport = () => import('@/views/reports/ItemMovementReport.vue')
const PartnerBalanceReport = () => import('@/views/reports/PartnerBalanceReport.vue')
const AccountStatement = () => import('@/views/reports/AccountStatement.vue')
const DesignersReport = () => import('@/views/reports/DesignersReport.vue')
//const PrintInventory = () => import('@/views/reports/PrintInventory.vue') // مكون الطباعة الجديد

const routes = [
  // --- المسارات العامة (لا تتطلب مصادقة) ---
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: 'login', name: 'Login', component: LoginView },
      // إعادة توجيه المسار الجذري إلى صفحة تسجيل الدخول
      { path: '', redirect: '/login' },
    ],
  },

  // {
  //   path: '/print-inventory',
  //   name: 'PrintInventory',
  //   component: PrintInventory,
  //   meta: { requiresAuth: true }, // يمكن تركها محمية حتى لا يصلها زائر غير مسجل
  // },

  // --- المسارات المحمية (تتطلب مصادقة) ---
  {
    path: '/app',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { permission: 'dashboard.view' },
      },

      // ==========================================
      // 1. إدارة النظام
      // ==========================================
      {
        path: 'users',
        name: 'UsersList',
        component: UsersList,
        meta: { permission: 'user.view' },
      },
      {
        path: 'roles',
        name: 'RolesList',
        component: RolesList,
        meta: { permission: 'role.view' },
      },
      {
        path: 'settings/backups',
        name: 'BackupsList',
        component: BackupsList,
        // افترضنا الصلاحية بناءً على النسق العام، إذا كانت مختلفة في السانكتوم يمكنك تعديلها
        meta: { permission: 'backup.view' },
      },

      // ==========================================
      // 2. البيانات الأساسية (Catalog)
      // ==========================================
      {
        path: 'units',
        name: 'UnitsList',
        component: UnitsList,
        meta: { permission: 'unit.view' },
      },
      {
        path: 'categories',
        name: 'CategoriesList',
        component: CategoriesList,
        meta: { permission: 'category.view' },
      },
      {
        path: 'items',
        name: 'ItemsList',
        component: ItemsList,
        meta: { permission: 'item.view' },
      },

      // ==========================================
      // 3. الكيانات الإدارية (Entities)
      // ==========================================
      {
        path: 'warehouses',
        name: 'WarehousesList',
        component: WarehousesList,
        meta: { permission: 'warehouse.view' },
      },
      {
        path: 'partners',
        name: 'PartnersList',
        component: PartnersList,
        meta: { permission: 'partner.view' },
      },
      {
        path: 'treasuries',
        name: 'TreasuriesList',
        component: TreasuriesList,
        meta: { permission: 'treasury.view' },
      },

      // ==========================================
      // 4. العمليات والحركات (Transactions)
      // ==========================================
      {
        path: 'sales',
        name: 'SalesList',
        component: SalesList,
        meta: { permission: 'sales.view' }, // من ملف الـ Seeder
      },
      {
        path: 'purchases',
        name: 'PurchasesList',
        component: PurchasesList,
        meta: { permission: 'purchase.view' }, // من ملف الـ Seeder
      },
      {
        path: '/inventory/transfers',
        name: 'transfers.index',
        component: TransfersList,
      },
      {
        path: '/inventory/adjustments',
        name: 'adjustments.index',
        component: AdjustmentsList,
      },

      // ==========================================
      // 5. التقارير
      // ==========================================
      // --- [تعديل] إضافة مسار تقرير المخزون الجديد ---
      {
        path: 'reports/inventory',
        name: 'InventoryReport',
        component: InventoryReport,
        // meta: { permission: 'reports.inventory' }, // فعل هذا إذا كان لديك صلاحية محددة
      },

      {
        path: 'reports/item-movement',
        name: 'ItemMovementReport',
        component: ItemMovementReport,
        //meta: { permission: 'reports.inventory' },
      },

      {
        path: 'reports/partner-balances',
        name: 'PartnerBalanceReport',
        component: PartnerBalanceReport,
        meta: { permission: 'report.view' },
      },
      {
        path: 'reports/account-statement',
        name: 'AccountStatement',
        component: AccountStatement,
        meta: { permission: 'report.view' },
      },

      {
        path: 'reports/designers',
        name: 'DesignersReport',
        component: DesignersReport,
        meta: { permission: 'report.view' },
      },

      // إعادة توجيه المسار الرئيسي للتطبيق إلى لوحة التحكم
      { path: '', redirect: '/app/dashboard' },
    ],
  },

  // مسار للتعامل مع الصفحات غير الموجودة (404)
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// --- حارس التنقل العام (Global Navigation Guard) ---
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const { isAuthenticated, can } = authStore

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      authStore.returnUrl = to.fullPath
      next({ name: 'Login' })
    } else {
      const requiredPermission = to.meta.permission
      if (requiredPermission && !can(requiredPermission)) {
        console.warn(
          `Access denied: route "${String(to.name)}" requires permission "${requiredPermission}"`,
        )
        // توجيه المستخدم لصفحة لوحة التحكم عند محاولة الوصول لمسار لا يملك صلاحيته
        next({ name: 'Dashboard' })
      } else {
        next()
      }
    }
  } else {
    next()
  }
})

export default router
