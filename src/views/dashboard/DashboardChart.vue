<template>
  <div class="relative h-[300px] w-full">
    <div
      v-if="isLoading"
      class="absolute inset-0 flex items-center justify-center bg-surface-section/50 z-10"
    >
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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

// تسجيل مكونات Chart.js
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

// تنسيق البيانات لتناسب Chart.js
const formattedData = computed(() => ({
  labels: props.chartData.labels,
  datasets: props.chartData.datasets.map((ds) => ({
    ...ds,
    tension: 0.4, // لجعل الخطوط انسيابية (Curved)
    fill: true,
    pointRadius: 4,
    pointHoverRadius: 6,
  })),
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      align: 'end',
      labels: {
        usePointStyle: true,
        boxWidth: 6,
        font: { family: 'Tajawal, sans-serif', size: 12 },
      },
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      bodyFont: { family: 'Tajawal' },
      titleFont: { family: 'Tajawal', weight: 'bold' },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { borderDash: [5, 5], drawBorder: false },
      ticks: { font: { family: 'Tajawal' } },
    },
    x: {
      grid: { display: false },
      ticks: { font: { family: 'Tajawal' } },
    },
  },
}
</script>
