<template>
  <div class="mt-10 space-y-6">
    <div class="bg-slate-950 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
      <div
        class="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-slate-800"
      >
        <div class="p-8 text-center bg-indigo-500/5">
          <p class="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">
            إجمالي القيمة
          </p>
          <div class="flex flex-col items-center">
            <span class="text-4xl font-black text-white tracking-tight">
              {{ formatSudaneseCurrency(grandTotal) }}
            </span>
            <span class="text-[10px] font-bold text-indigo-500 mt-2">جنيه سوداني</span>
          </div>
        </div>

        <div class="p-8 flex flex-col justify-center items-center bg-slate-900/40">
          <p class="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] mb-4">
            المستلم نقداً
          </p>
          <div class="w-full max-w-[220px] relative">
            <input
              type="text"
              :value="displayPaidAmount"
              @input="handlePaidAmountInput"
              class="w-full text-center text-3xl font-black text-emerald-400 bg-transparent border-none focus:ring-0 outline-none p-0"
              placeholder="0.00"
            />
            <div
              class="absolute -bottom-1 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent"
            ></div>
          </div>
        </div>

        <div class="p-8 text-center bg-rose-500/5">
          <p class="text-[10px] font-black text-rose-400 uppercase tracking-[0.2em] mb-3">
            المتبقي طرف العميل
          </p>
          <div class="flex flex-col items-center">
            <span
              class="text-4xl font-black tracking-tight transition-all duration-500"
              :class="
                remainingBalance > 0
                  ? 'text-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.4)]'
                  : 'text-emerald-500'
              "
            >
              {{ formatSudaneseCurrency(remainingBalance) }}
            </span>
            <span class="text-[10px] font-bold text-rose-500/50 mt-2">جنيه سوداني</span>
          </div>
        </div>
      </div>

      <div class="px-8 py-6 bg-slate-900/80 border-t border-slate-800">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div class="lg:col-span-7 flex flex-wrap md:flex-nowrap items-end gap-5">
            <div class="w-full md:w-1/2">
              <DesignersDropdown
                id="designer-id"
                label="المصمم المسؤول"
                v-model="form.designer_id"
              />
            </div>

            <div class="w-1/2 md:w-1/4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-500 uppercase mr-1"
                  >عدد الامتار الكلى</label
                >
                <div
                  class="h-[46px] flex items-center justify-center bg-slate-950 border border-slate-800 rounded-xl text-orange-500 font-black shadow-inner"
                >
                  {{ formatSudaneseCurrency(form.total_area || 0) }}
                </div>
              </div>
            </div>

            <div class="w-1/2 md:w-1/4">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-slate-500 uppercase mr-1"
                  >العمولة (ج.س)</label
                >
                <div class="relative group">
                  <input
                    type="text"
                    :value="displayCommission"
                    @input="handleCommissionInput"
                    class="w-full h-[46px] text-center font-black text-orange-400 bg-slate-950 border border-slate-800 rounded-xl focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-5 border-r border-slate-800 pr-8">
            <transition name="scale">
              <div v-if="form.paid_amount > 0">
                <TreasuriesDropdown
                  id="treasury-id"
                  label="الخزينة المستلمة"
                  v-model="form.treasury_id"
                  :required="true"
                />
              </div>
              <div
                v-else
                class="h-[60px] flex items-center justify-center text-slate-700 text-[10px] font-bold border border-dashed border-slate-800 rounded-2xl tracking-[0.2em] uppercase"
              >
                بانتظار التحصيل...
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col md:flex-row justify-between items-center gap-6 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="text-[11px] font-black text-slate-500 hover:text-rose-500 transition-all flex items-center gap-3 group tracking-widest uppercase"
      >
        <span
          class="w-10 h-10 rounded-full border border-slate-800 flex items-center justify-center group-hover:bg-rose-500/10 group-hover:border-rose-500/50 transition-all"
          >✕</span
        >
        إلغاء العملية
      </button>

      <AppButton
        type="submit"
        :disabled="isSaving"
        class="w-full md:w-auto px-20 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all transform hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-4"
      >
        <span v-if="isSaving" class="animate-spin text-xl">◌</span>
        <span class="font-black text-sm tracking-widest">{{
          isSaving ? 'جاري المعالجة...' : 'اعتماد وحفظ الفاتورة'
        }}</span>
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import AppButton from '@/components/ui/AppButton.vue'
import AppInput from '@/components/ui/AppInput.vue'
import TreasuriesDropdown from '@/components/forms/TreasuriesDropdown.vue'
import DesignersDropdown from '@/components/forms/DesignersDropdown.vue'

const form = defineModel('form', { type: Object, required: true })
const props = defineProps({
  errors: { type: Object, default: () => ({}) },
  grandTotal: { type: Number, required: true },
  isSaving: { type: Boolean, default: false },
})
defineEmits(['cancel'])

// --- وظائف التنسيق المتقدمة ---

// تنسيق الرقم للعرض (مع فواصل)
const formatSudaneseCurrency = (value) => {
  if (value === null || value === undefined || value === '') return '0.00'
  return new Number(value).toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

// القيمة المعروضة للمبلغ المدفوع (Formatted)
const displayPaidAmount = computed(() => {
  return form.value.paid_amount > 0 ? form.value.paid_amount.toLocaleString('en-US') : ''
})

// القيمة المعروضة للعمولة (Formatted)
const displayCommission = computed(() => {
  return form.value.design_commission > 0
    ? form.value.design_commission.toLocaleString('en-US')
    : ''
})

// معالجة المدخلات للمبلغ المدفوع (تنظيف الفواصل وتحديث الرقم الحقيقي)
const handlePaidAmountInput = (e) => {
  const val = e.target.value.replace(/,/g, '') // حذف الفواصل
  if (!isNaN(val)) {
    form.value.paid_amount = val === '' ? 0 : parseFloat(val)
  }
}

// معالجة المدخلات للعمولة
const handleCommissionInput = (e) => {
  const val = e.target.value.replace(/,/g, '')
  if (!isNaN(val)) {
    form.value.design_commission = val === '' ? 0 : parseFloat(val)
  }
}

const remainingBalance = computed(() => {
  const total = Number(props.grandTotal) || 0
  const paid = Number(form.value.paid_amount) || 0
  return Math.max(0, total - paid)
})
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

/* إخفاء سهم زيادة الرقم الافتراضي في المتصفحات */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

:deep(.app-input-label) {
  @apply text-[10px] font-black text-slate-500 uppercase mb-2 block mr-1 tracking-[0.1em];
}
</style>
