<template>
  <div class="relative h-[350px] w-full">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-[#0f172a]/50 backdrop-blur-sm z-10 rounded-2xl"
    >
      <div class="flex flex-col items-center gap-3">
        <div
          class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"
        ></div>
        <span class="text-xs font-bold text-indigo-400 animate-pulse">جاري تحليل البيانات...</span>
      </div>
    </div>

    <Line v-if="chartData && !isLoading" :data="formattedData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
)

const props = defineProps({
  chartData: { type: Object, required: true },
  isLoading: { type: Boolean, default: false },
})

// --- 🌟 سحر التدرجات والنيون ---
const formattedData = computed(() => {
  if (!props.chartData || !props.chartData.datasets) return { labels: [], datasets: [] }

  return {
    labels: props.chartData.labels,
    datasets: props.chartData.datasets.map((ds) => {
      const isSales = ds.label === 'المبيعات'

      return {
        ...ds,
        // إعدادات الخط (النيون)
        borderColor: isSales ? '#6366f1' : '#10b981',
        borderWidth: 3,
        tension: 0.45, // انسيابية عالية
        fill: true,

        // التدرج اللوني تحت الخط (Gradient Fill)
        backgroundColor: (context) => {
          const bgColor = isSales
            ? ['rgba(99, 102, 241, 0.2)', 'rgba(99, 102, 241, 0)']
            : ['rgba(16, 185, 129, 0.2)', 'rgba(16, 185, 129, 0)']

          const chart = context.chart
          const { ctx, chartArea } = chart
          if (!chartArea) return null

          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom)
          gradient.addColorStop(0, bgColor[0])
          gradient.addColorStop(1, bgColor[1])
          return gradient
        },

        // إعدادات النقاط
        pointBackgroundColor: isSales ? '#6366f1' : '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 0, // مخفية افتراضياً وتظهر عند الـ Hover
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderWidth: 4,
      }
    }),
  }
})

// --- 🌟 إعدادات العرض الاحترافية ---
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        color: '#94a3b8',
        usePointStyle: true,
        pointStyle: 'circle',
        padding: 20,
        font: { family: 'Tajawal', size: 11, weight: 'bold' },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(15, 23, 42, 0.9)', // خلفية داكنة جداً للـ Tooltip
      titleColor: '#fff',
      bodyColor: '#cbd5e1',
      padding: 15,
      cornerRadius: 12,
      displayColors: true,
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      bodyFont: { family: 'Tajawal' },
      titleFont: { family: 'Tajawal', size: 14, weight: 'bold' },
      callbacks: {
        label: (context) => ` ${context.dataset.label}: ${context.parsed.y.toLocaleString()} د.ل`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(255, 255, 255, 0.03)', // شبكة خافتة جداً
        drawBorder: false,
      },
      ticks: {
        color: '#64748b',
        font: { family: 'Tajawal', size: 10 },
        callback: (value) => (value >= 1000 ? value / 1000 + 'k' : value),
      },
    },
    x: {
      grid: { display: false },
      ticks: {
        color: '#64748b',
        font: { family: 'Tajawal', size: 10 },
      },
    },
  },
}
</script>

<style scoped>
/* إضافة تأثير التوهج للرسم البياني */
canvas {
  filter: drop-shadow(0px 10px 10px rgba(0, 0, 0, 0.2));
}
</style>
