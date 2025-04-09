<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <!-- 왼쪽: 도넛 차트 (수입 비율) -->
      <div class="col-12 col-md-5 mb-3 mb-md-0">
        <div class="card shadow-sm p-3 h-100">
          <h5 class="card-title text-center fw-bold">카테고리별 수입 비율</h5>
          <!-- 도넛 차트 영역 -->
          <div class="ratio ratio-1x1" style="max-width: 100%; height: 20rem">
            <Doughnut
              v-if="incomeChartData"
              :data="incomeChartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>

      <!-- 오른쪽: 수입 분석 요약 -->
      <div class="col-12 col-md-7">
        <div class="card shadow-sm p-3 h-100">
          <div class="mb-5">
            <h5 class="text-center mb-3 fw-bold">수입 분석</h5>
            <!-- 카테고리별 수입 목록 -->
            <ul class="m-3" v-if="Object.keys(incomeCategorySummary).length">
              <li
                v-for="(amount, category) in incomeCategorySummary"
                :key="category"
              >
                {{ category }} {{ amount.toLocaleString() }}원
              </li>
            </ul>
            <!-- 수입 데이터 없을 경우 메시지 -->
            <p class="text-center text-muted" v-else>수입 내역이 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Vue 및 Chart.js 관련 기능 불러오기
import { computed, onMounted, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Pinia 스토어 불러오기
import { useChartStore } from '@/stores/chartStore';
import { useAssetStore } from '@/stores/assetStore';
import { useAuthStore } from '@/stores/auth';

// Chart.js 컴포넌트 등록
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

// 로그인된 사용자 ID 및 사용자 정보 추출
const userId = computed(() => authStore.user?.id);
const user = computed(
  () => assetStore.users.find((u) => u.id === userId.value) || null
);

// 수입 관련 차트 및 요약 데이터 가져오기
const incomeChartData = computed(() => chartStore.incomeChartData);
const incomeCategorySummary = computed(() => chartStore.incomeCategorySummary);

// 차트 옵션 설정
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

// 데이터 로딩 함수
const loadData = async () => {
  if (assetStore.users.length === 0) {
    await assetStore.fetchUsers(); // 사용자 목록이 없으면 가져오기
  }
  if (user.value) {
    await chartStore.fetchIncomeData(props.year, props.month); // 수입 데이터 불러오기
  }
};

// 컴포넌트 마운트 시 데이터 로드
onMounted(loadData);

// 연도, 월, 사용자 변경 시 수입 데이터 재요청
watch(
  () => [props.year, props.month, user.value],
  async ([_, __, currentUser]) => {
    if (currentUser) {
      await chartStore.fetchIncomeData(props.year, props.month);
    }
  }
);
</script>
