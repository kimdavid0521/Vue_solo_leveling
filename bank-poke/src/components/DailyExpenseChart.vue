<template>
  <div class="container mt-4">
    <div class="row mb-4 align-items-stretch">
      <div class="col-12 col-md-7 mb-3 mb-md-0">
        <div class="card shadow-sm p-3 h-100">
          <h5 class="card-title text-center fw-bold">일별 누적 지출</h5>
          <Line v-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
      </div>
      <div class="col-12 col-md-5">
        <div class="card shadow-sm p-3 h-100">
          <div class="mb-5">
            <h5 class="text-center mb-3 fw-bold">일별 지출 분석</h5>
            <ul>
              <li>
                {{ props.month + 1 }}월 총지출액 :
                {{ totalExpense.toLocaleString() }} 원
              </li>
              <li>평균 결제액 : {{ averageExpense.toLocaleString() }} 원</li>
              <li>결제 건수 : {{ transactionCount }} 건</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { useChartStore } from '@/stores/chartStore';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

// props
const props = defineProps({
  year: Number,
  month: Number,
});

// Pinia store 사용
const chartStore = useChartStore();

// chart 상태 가져오기
const chartData = computed(() => chartStore.chartData);
const totalExpense = computed(() => chartStore.totalExpense);
const averageExpense = computed(() => chartStore.averageExpense);
const transactionCount = computed(() => chartStore.transactionCount);

// chart 옵션
const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `${context.parsed.y.toLocaleString()}원`,
      },
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value.toLocaleString()}원`,
      },
    },
  },
};

// 데이터 로드
onMounted(() => {
  chartStore.fetchDailyExpenseData(props.year, props.month);
});
watch(
  () => [props.year, props.month],
  () => {
    chartStore.fetchDailyExpenseData(props.year, props.month);
  }
);
</script>
