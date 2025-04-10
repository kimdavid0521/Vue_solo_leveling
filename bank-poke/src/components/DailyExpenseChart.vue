<template>
  <div class="container mt-4">
    <div class="row mb-4 align-items-stretch">
      <!-- 왼쪽: 라인 차트 (일별 누적 지출) -->
      <div class="col-12 col-md-7 mb-3 mb-md-0">
        <div class="card shadow-sm p-3 h-100">
          <h5 class="card-title text-center fw-bold">일별 누적 지출</h5>
          <!-- 일별 지출 라인 차트 -->
          <Line v-if="chartData" :data="chartData" :options="chartOptions" />
        </div>
      </div>

      <!-- 오른쪽: 지출 요약 정보 -->
      <div class="col-12 col-md-5">
        <div class="card shadow-sm p-3 h-100">
          <div class="mb-5">
            <h5 class="text-center mb-3 fw-bold">일별 지출 분석</h5>
            <!-- 지출 통계 정보 -->
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
// Vue 및 Chart.js 관련 기능 import
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

// Pinia 스토어 import
import { useChartStore } from '@/stores/chartStore';
import { useAssetStore } from '@/stores/assetStore';
import { useAuthStore } from '@/stores/auth';

// Chart.js 컴포넌트 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

// 부모로부터 받은 연도 및 월
const props = defineProps({
  year: Number,
  month: Number,
});

// Pinia 스토어 초기화
const chartStore = useChartStore();
const assetStore = useAssetStore();
const authStore = useAuthStore();

// 로그인된 사용자 정보
const userId = computed(() => authStore.user?.id);
const user = computed(
  () => assetStore.users.find((u) => u.id === userId.value) || null
);

// 컴포넌트 마운트 시 사용자와 지출 데이터 로딩
onMounted(async () => {
  if (!assetStore.users.length) {
    await assetStore.fetchUsers();
  }

  if (user.value) {
    chartStore.fetchDailyExpenseData(props.year, props.month);
  }
});

// 사용자/연도/월 변경 시 지출 데이터 갱신
watch(
  () => [user.value, props.year, props.month],
  async ([currentUser, year, month]) => {
    if (currentUser) {
      await chartStore.fetchDailyExpenseData(year, month);
    }
  }
);

// Chart 및 지출 요약 데이터
const chartData = computed(() => chartStore.chartData); // 라인 차트 데이터
const totalExpense = computed(() => chartStore.totalExpense); // 총지출액
const averageExpense = computed(() => chartStore.averageExpense); // 평균지출액
const transactionCount = computed(() => chartStore.transactionCount); // 결제 건수

// 라인 차트 옵션 설정
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
</script>
