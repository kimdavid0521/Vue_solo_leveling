<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col-12 col-md-5 mb-3 mb-md-0">
        <div class="card shadow-sm p-3 h-100">
          <h5 class="card-title text-center fw-bold">카테고리별 지출 비율</h5>
          <div class="ratio ratio-1x1" style="max-width: 100%; height: 20rem">
            <Doughnut
              v-if="expenseChartData"
              :data="expenseChartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-7">
        <div class="card shadow-sm p-3 h-100">
          <h5 class="text-center mb-3 fw-bold">지출 분석</h5>
          <ul class="m-3">
            <li class="fw-bold">
              총지출액 : {{ totalExpense.toLocaleString() }} 원
            </li>
            <li class="fw-bold">
              건별 평균 : {{ averageExpense.toLocaleString() }} 원
            </li>
            <li class="fw-bold">결제 건수 : {{ transactionCount }} 건</li>
            <br />
            <li
              v-for="(amount, category) in expenseCategorySummary"
              :key="category"
            >
              {{ category }} : {{ amount.toLocaleString() }} 원
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { useChartStore } from '@/stores/chartStore';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

// props
const props = defineProps({
  year: Number,
  month: Number,
});

const chartStore = useChartStore();

// 상태 가져오기
const expenseChartData = computed(() => chartStore.expenseChartData);
const expenseCategorySummary = computed(
  () => chartStore.expenseCategorySummary
);
const totalExpense = computed(() => chartStore.totalExpense);
const averageExpense = computed(() => chartStore.averageExpense);
const transactionCount = computed(() => chartStore.transactionCount);

// 차트 옵션
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: (context) => {
          const label = context.label || '';
          const value = context.parsed || 0;
          return `${label}: ${value.toLocaleString()}원`;
        },
      },
    },
  },
};

// 데이터 로드
onMounted(() => {
  chartStore.fetchExpenseData(props.year, props.month);
});
watch(
  () => [props.year, props.month],
  () => {
    chartStore.fetchExpenseData(props.year, props.month);
  }
);
</script>
