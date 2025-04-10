<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <!-- 왼쪽: 도넛 차트 -->
      <div class="col-12 col-md-5 mb-3 mb-md-0">
        <div class="card shadow-sm p-3 h-100 hover-lift">
          <h5 class="card-title text-center fw-bold">카테고리별 지출 비율</h5>
          <!-- 비율 차트 표시 영역 -->
          <div class="ratio ratio-1x1" style="max-width: 100%; height: 20rem">
            <Doughnut
              v-if="expenseChartData"
              :data="expenseChartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>

      <!-- 오른쪽: 지출 통계 요약 -->
      <div class="col-12 col-md-7">
        <div class="card shadow-sm p-3 h-100 hover-lift">
          <h5 class="text-center mb-3 fw-bold">지출 분석</h5>
          <!-- 요약 정보 출력 -->
          <ul class="m-3" v-if="Object.keys(expenseCategorySummary).length">
            <li class="fw-bold">
              총지출액 : {{ totalExpense.toLocaleString() }} 원
            </li>
            <li class="fw-bold">
              건별 평균 : {{ averageExpense.toLocaleString() }} 원
            </li>
            <li class="fw-bold">결제 건수 : {{ transactionCount }} 건</li>
            <br />
            <!-- 카테고리별 금액 -->
            <li
              v-for="(amount, category) in expenseCategorySummary"
              :key="category"
            >
              {{ category }} : {{ amount.toLocaleString() }} 원
            </li>
          </ul>
          <!-- 데이터 없을 경우 안내 메시지 -->
          <p class="text-center text-muted" v-else>지출 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue 기능 및 Chart.js 설정 가져오기
import { computed, onMounted, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Pinia 스토어 임포트
import { useChartStore } from '@/stores/chartStore';
import { useAssetStore } from '@/stores/assetStore';
import { useAuthStore } from '@/stores/auth';

// Chart.js 구성요소 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement);

// 부모 컴포넌트로부터 받은 연도/월 정보
const props = defineProps({
  year: Number,
  month: Number,
});

// 스토어 인스턴스 생성
const chartStore = useChartStore();
const assetStore = useAssetStore();
const authStore = useAuthStore();

// 현재 로그인한 사용자 ID 및 사용자 정보
const userId = computed(() => authStore.user?.id);
const user = computed(
  () => assetStore.users.find((u) => u.id === userId.value) || null
);

// 차트 및 통계 데이터 가져오기
const expenseChartData = computed(() => chartStore.expenseChartData);
const expenseCategorySummary = computed(
  () => chartStore.expenseCategorySummary
);
const totalExpense = computed(() => chartStore.totalExpense);
const averageExpense = computed(() => chartStore.averageExpense);
const transactionCount = computed(() => chartStore.transactionCount);

// 차트 옵션 정의
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom', // 범례 위치 하단
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

// 지출 데이터 불러오기 함수
const loadExpenseData = async () => {
  if (assetStore.users.length === 0) {
    await assetStore.fetchUsers(); // 사용자 데이터가 없으면 불러오기
  }
  if (user.value) {
    await chartStore.fetchExpenseData(props.year, props.month); // 지출 데이터 가져오기
  }
};

// 마운트 시 지출 데이터 로드
onMounted(loadExpenseData);

// 연도/월/사용자 변경 감지 시 재로드
watch(
  () => [props.year, props.month, user.value],
  async ([_, __, currentUser]) => {
    if (currentUser) {
      await chartStore.fetchExpenseData(props.year, props.month);
    }
  }
);
</script>

<style scoped>
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
</style>
