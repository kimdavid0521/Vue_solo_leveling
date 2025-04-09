<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col">
        <div class="card shadow-sm p-3">
          <h5 class="mb-3 text-center fs-4 fw-bold">예산 사용률</h5>
          <div class="position-relative mx-auto" style="max-width: 400px">
            <Doughnut :data="chartData" :options="chartOptions" />
            <div
              class="position-absolute top-50 start-50 translate-middle text-center"
              style="transform: translate(-50%, -40%)"
            >
              <div class="fs-4 mt-5 pt-5">{{ chartStore.usedPercent }}%</div>
              <div class="mt-1">
                <small
                  >전체 예산:
                  {{ formatCurrency(chartStore.totalBudget) }}</small
                ><br />
                <small
                  >남은 예산: {{ formatCurrency(chartStore.remaining) }}</small
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, ArcElement, Legend } from 'chart.js';
import { useChartStore } from '@/stores/chartStore';

ChartJS.register(Title, Tooltip, ArcElement, Legend);

const props = defineProps({
  year: Number,
  month: Number,
});

const chartStore = useChartStore();

const chartData = computed(() => ({
  labels: ['사용', '남음'],
  datasets: [
    {
      data: [chartStore.usedPercent, 100 - chartStore.usedPercent],
      backgroundColor: ['#36a2eb', '#d3d3d3'],
      borderWidth: 0,
    },
  ],
}));

const chartOptions = {
  rotation: -90,
  circumference: 180,
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.label}: ${context.parsed}%`,
      },
    },
  },
};

function formatCurrency(amount) {
  return amount.toLocaleString() + '원';
}

onMounted(() => chartStore.fetchBudgetData(props.year, props.month));
watch(
  () => [props.year, props.month],
  () => {
    chartStore.fetchBudgetData(props.year, props.month);
  }
);
</script>
