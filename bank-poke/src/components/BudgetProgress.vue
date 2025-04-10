<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <div class="col-12">
        <!-- 카드 스타일의 박스 -->
        <div class="card shadow-sm p-3">
          <h5 class="mb-3 text-center fs-4 fw-bold">예산 사용률</h5>

          <!-- 도넛 차트 영역 -->
          <div
            class="position-relative mx-auto ratio ratio-1x1"
            style="max-width: 400px"
          >
            <div class="w-100 h-100">
              <!-- 차트 데이터가 있을 때만 렌더링 -->
              <Doughnut
                v-if="chartData"
                :data="chartData"
                :options="chartOptions"
              />
            </div>

            <!-- 차트 중앙 텍스트 -->
            <div
              class="position-absolute top-50 start-50 translate-middle text-center px-2"
              style="z-index: 10"
            >
              <div class="fs-5 fw-bold">{{ usedPercent }}%</div>
              <div class="small">
                전체 예산: {{ formatCurrency(chartStore.totalBudget) }}<br />
                남은 예산: {{ formatCurrency(chartStore.remaining) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 필요한 라이브러리 및 스토어 임포트
import { computed, onMounted, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, ArcElement, Legend } from 'chart.js';
import { useChartStore } from '@/stores/chartStore';
import { useAssetStore } from '@/stores/assetStore';
import { useAuthStore } from '@/stores/auth';

// Chart.js 구성요소 등록
ChartJS.register(Title, Tooltip, ArcElement, Legend);

// 부모 컴포넌트로부터 전달받은 연도/월
const props = defineProps({
  year: Number,
  month: Number,
});

// Pinia 스토어 사용
const chartStore = useChartStore();
const assetStore = useAssetStore();
const authStore = useAuthStore();

// 현재 로그인한 유저의 ID
const userId = computed(() => authStore.user?.id);

// 사용률 계산 (예외 처리 포함)
const usedPercent = computed(() => {
  const percent = chartStore.usedPercent;
  return isNaN(percent) || percent === null ? 0 : percent;
});

// 도넛 차트 데이터 설정
const chartData = computed(() => ({
  labels: ['사용', '남음'],
  datasets: [
    {
      data: [usedPercent.value, 100 - usedPercent.value],
      backgroundColor: ['#36a2eb', '#d3d3d3'],
      borderWidth: 0,
    },
  ],
}));

// 차트 옵션 설정 (반원 형태)
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

// 통화 단위로 포맷팅
function formatCurrency(amount) {
  return typeof amount === 'number' ? amount.toLocaleString() + '원' : '0원';
}

// 예산 데이터 불러오기
const loadBudgetData = async () => {
  if (assetStore.users.length === 0) {
    await assetStore.fetchUsers(); // 유저 목록이 없으면 먼저 가져오기
  }

  if (userId.value) {
    await chartStore.fetchBudgetData(props.year, props.month); // 예산 정보 가져오기
  }
};

// 컴포넌트 마운트 시 예산 데이터 로딩
onMounted(loadBudgetData);

// 연도/월/유저ID 변경 시 다시 불러오기
watch(
  () => [props.year, props.month, userId.value],
  async () => {
    if (userId.value) {
      await chartStore.fetchBudgetData(props.year, props.month);
    }
  }
);
</script>
