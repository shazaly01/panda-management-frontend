<template>
  <div class="print-container font-sans text-slate-800" dir="rtl">
    <div class="a4-sheet bg-white relative overflow-hidden flex flex-col">
      <div class="absolute top-0 left-0 right-0 h-1 bg-orange-600"></div>

      <div class="p-8 flex-1 flex flex-col">
        <div class="flex justify-between items-center mb-8 border-b border-slate-100 pb-6">
          <div class="flex items-center gap-6">
            <img src="/MainLogo2.png" alt="Logo" class="w-24 h-24 object-contain" />

            <div>
              <h1 class="text-3xl font-black text-slate-900 mb-1">فيوتشر</h1>
              <p class="text-orange-600 font-bold text-sm tracking-wide">
                للطباعة والتصميم والإعلان
              </p>
              <div class="text-slate-500 text-xs mt-2 space-y-0.5 font-medium">
                <p>شارع الإبداع، المدينة</p>
                <p class="font-sans">09XXXXXXXX | info@panda.com</p>
              </div>
            </div>
          </div>

          <div class="text-left py-2 px-4 border-r-2 border-orange-500">
            <table class="text-xs w-full text-right">
              <tbody>
                <tr>
                  <td class="text-slate-400 py-1 pl-4 font-bold uppercase">رقم الفاتورة:</td>
                  <td class="font-black text-slate-900 text-sm">#{{ invoice.trx_no }}</td>
                </tr>
                <tr>
                  <td class="text-slate-400 py-1 pl-4 font-bold">التاريخ:</td>
                  <td class="font-bold text-slate-700">{{ formatDate(invoice.invoice_date) }}</td>
                </tr>
                <tr>
                  <td class="text-slate-400 py-1 pl-4 font-bold">المسؤول:</td>
                  <td class="font-bold text-slate-700">{{ invoice.created_by }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="flex gap-4 mb-6">
          <div class="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100 relative">
            <div class="absolute right-0 top-0 bottom-0 w-1 bg-orange-600 rounded-r-xl"></div>
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">فاتورة إلى</p>
            <h3 class="text-xl font-black text-slate-800 leading-none">
              {{ invoice.partner_name || invoice.walk_in_customer_name || 'عميل نقدي' }}
            </h3>
            <p class="text-slate-500 text-xs mt-2">
              جهة الشحن: {{ invoice.shipping_destination || 'استلام من المقر' }}
            </p>
          </div>

          <div
            class="w-1/4 bg-white rounded-xl p-4 border border-slate-100 flex flex-col justify-center items-center text-center"
          >
            <p class="text-[10px] font-bold text-slate-400 uppercase mb-1">المصمم المسؤول</p>
            <p class="text-sm font-black text-slate-700 border-t border-slate-50 pt-1 w-full">
              {{ invoice.designer_name || '---' }}
            </p>
          </div>
        </div>

        <div class="flex-grow">
          <div class="rounded-xl overflow-hidden border border-slate-200">
            <table class="w-full text-right text-xs">
              <thead class="bg-slate-900 text-white">
                <tr>
                  <th class="py-3 px-3 font-bold text-center w-10 text-orange-500">#</th>
                  <th class="py-3 px-3 font-bold w-2/5">البيان / الخدمة</th>
                  <th class="py-3 px-3 font-bold text-center">المقاس</th>
                  <th class="py-3 px-3 font-bold text-center">الأمتار</th>
                  <th class="py-3 px-3 font-bold text-center">الكمية</th>
                  <th class="py-3 px-3 font-bold text-center">السعر</th>
                  <th class="py-3 px-3 font-bold text-center bg-orange-600">الإجمالي</th>
                </tr>
              </thead>
              <tbody class="text-slate-700">
                <tr
                  v-for="(item, index) in invoice.details"
                  :key="item.id"
                  class="border-b border-slate-100 last:border-0"
                  :class="index % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'"
                >
                  <td class="py-3 px-3 text-center text-slate-400 font-bold">{{ index + 1 }}</td>
                  <td class="py-3 px-3">
                    <div class="font-black text-slate-800 text-sm">{{ item.item_name }}</div>
                    <div class="text-[10px] text-slate-500 mt-0.5" v-if="item.description">
                      {{ item.description }}
                    </div>
                  </td>
                  <td class="py-3 px-3 text-center font-medium" dir="ltr">
                    {{ item.length && item.width ? `${item.length}x${item.width}` : '---' }}
                  </td>
                  <td class="py-3 px-3 text-center font-bold text-slate-600">
                    {{ item.area ? Number(item.area).toFixed(2) : '---' }}
                  </td>
                  <td class="py-3 px-3 text-center font-bold">
                    <span class="bg-slate-100 py-1 px-2 rounded"
                      >{{ Number(item.qty) }} {{ item.unit_name }}</span
                    >
                  </td>
                  <td class="py-3 px-3 text-center font-bold">{{ formatCurrency(item.price) }}</td>
                  <td class="py-3 px-3 text-center font-black text-orange-700 bg-orange-50/30">
                    {{ formatCurrency(item.total_row) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100">
          <div class="flex justify-between items-start gap-10">
            <div class="w-1/2">
              <div
                v-if="invoice.notes"
                class="bg-amber-50 rounded-lg p-3 border border-amber-100 text-xs"
              >
                <p class="font-bold text-amber-800 mb-1">ملاحظات:</p>
                <p class="text-amber-900">{{ invoice.notes }}</p>
              </div>
            </div>

            <div class="w-1/2 space-y-1">
              <div class="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <div
                  class="flex justify-between items-center py-1 text-xs text-slate-500 font-bold"
                >
                  <span>الإجمالي الفرعي:</span>
                  <span>{{ formatCurrency(invoice.total_amount) }}</span>
                </div>
                <div
                  v-if="invoice.discount_amount > 0"
                  class="flex justify-between items-center py-1 text-xs text-rose-500 font-bold border-b border-slate-200 pb-2 mb-2"
                >
                  <span>الخصم:</span>
                  <span>- {{ formatCurrency(invoice.discount_amount) }}</span>
                </div>

                <div class="space-y-3">
                  <div class="flex justify-between items-center text-slate-900">
                    <span class="text-sm font-black">الصافي المطلوب:</span>
                    <span
                      class="text-lg font-black underline decoration-orange-500 decoration-2 underline-offset-4"
                      >{{ formatCurrency(invoice.net_amount) }}</span
                    >
                  </div>

                  <div class="flex justify-between items-center text-green-700">
                    <span class="text-sm font-black text-slate-600">المبلغ المدفوع:</span>
                    <span class="text-lg font-black">{{
                      formatCurrency(invoice.paid_amount)
                    }}</span>
                  </div>

                  <div
                    class="flex justify-between items-center text-rose-700 border-t border-slate-100 pt-2"
                  >
                    <span class="text-sm font-black text-slate-600">المبلغ المتبقي:</span>
                    <span class="text-lg font-black font-sans tracking-wide">{{
                      formatCurrency(invoice.remaining_amount)
                    }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-3 gap-4 text-center text-xs mt-10 mb-4">
            <div>
              <p class="font-bold text-slate-400 mb-8 uppercase tracking-widest">توقيع المبيعات</p>
              <div class="border-b border-dashed border-slate-200 mx-6"></div>
            </div>
            <div class="flex items-center justify-center">
              <div
                class="w-16 h-16 rounded-full border border-dashed border-orange-200 flex items-center justify-center text-[8px] text-slate-200 font-black rotate-12"
              >
                الختم الرسمي
              </div>
            </div>
            <div>
              <p class="font-bold text-slate-400 mb-8 uppercase tracking-widest">توقيع المستلم</p>
              <div class="border-b border-dashed border-slate-200 mx-6"></div>
            </div>
          </div>

          <div class="text-center text-[10px] text-slate-400 border-t border-slate-100 pt-4">
            <p class="text-orange-600 font-black text-xs mb-1">شكراً لثقتكم باختياركم فيوتشر!</p>
            <p>
              تخضع هذه الفاتورة للشروط والأحكام. البضاعة المباعة لا ترد ولا تستبدل إلا وفق السياسة
              المعتمدة.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  invoice: { type: Object, required: true },
})

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatCurrency = (value) => {
  const num = Number(value) || 0
  return num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}
</script>

<style scoped>
.print-container {
  display: none;
}

@media print {
  body * {
    visibility: hidden !important;
  }
  .print-container,
  .print-container * {
    visibility: visible !important;
  }
  .print-container {
    display: block !important;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: white !important;
    z-index: 9999;
  }
  .a4-sheet {
    width: 210mm;
    height: 296mm;
    margin: 0 auto;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  @page {
    size: A4 portrait;
    margin: 0;
  }
}
</style>
