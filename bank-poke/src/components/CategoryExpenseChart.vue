<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <!-- 왼쪽: 도넛 차트 -->
      <div class="col-12 col-md-5 mb-3 mb-md-0">
        <div class="card shadow-sm p-3 h-100 hover-lift">
          <h5 class="card-title text-center fw-bold">카테고리별 지출 비율</h5>
          <div
            class="d-flex justify-content-center align-items-center"
            style="height: 20rem"
          >
            <Doughnut
              v-if="expenseChartData"
              :data="expenseChartData"
              :options="chartOptions"
            />
          </div>
          <div
            class="d-flex justify-content-center align-items-center flex-wrap gap-2"
          >
            <input
              type="checkbox"
              id="toggle"
              hidden
              v-model="isDetail"
              @change="loadExpenseData"
            />
            <label for="toggle" class="toggleSwitch">
              <span class="toggleButton"></span>
            </label>
            <span class="ml-2 toggle-label"> 더 자세히 </span>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 지출 통계 요약 -->
      <div class="col-12 col-md-7">
        <div class="card shadow-sm p-3 h-100 hover-lift">
          <h5 class="text-center mb-3 fw-bold">지출 분석</h5>
          <ul class="m-3" v-if="Object.keys(expenseCategorySummary).length">
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
          <p class="text-center text-muted" v-else>지출 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

import { useChartStore } from '@/stores/chartStore';
import { useAssetStore } from '@/stores/assetStore';
import { useAuthStore } from '@/stores/auth';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const props = defineProps({
  year: Number,
  month: Number,
});

const chartStore = useChartStore();
const assetStore = useAssetStore();
const authStore = useAuthStore();

const isDetail = ref(false); // 스위치 상태

const userId = computed(() => authStore.user?.id);
const user = computed(
  () => assetStore.users.find((u) => u.id === userId.value) || null
);

const expenseChartData = computed(() => chartStore.expenseChartData);
const expenseCategorySummary = computed(
  () => chartStore.expenseCategorySummary
);
const totalExpense = computed(() => chartStore.totalExpense);
const averageExpense = computed(() => chartStore.averageExpense);
const transactionCount = computed(() => chartStore.transactionCount);

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

const loadExpenseData = async () => {
  if (assetStore.users.length === 0) {
    await assetStore.fetchUsers();
  }
  if (user.value) {
    // isDetail이 true면 상세 false면 요약
    await chartStore.fetchExpenseData(props.year, props.month, !isDetail.value);
  }
};

onMounted(loadExpenseData);

watch(
  () => [props.year, props.month, user.value],
  async ([_, __, currentUser]) => {
    if (currentUser) {
      await chartStore.fetchExpenseData(
        props.year,
        props.month,
        !isDetail.value
      );
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

.toggleSwitch {
  width: 3rem;
  height: 1.5rem;
  display: block;
  position: relative;
  border-radius: 1rem;
  background-color: #fff;
  box-shadow: 0 0 0.375rem 0.125rem rgba(0, 0, 0, 0.15);
  cursor: pointer;
  margin: 0.1rem;
  transition: background-color 0.2s ease-in, box-shadow 0.2s ease-in;
}

/* 비활성화된 상태 스타일 */
input:disabled ~ .toggleSwitch {
  background-color: #e0e0e0;
  cursor: not-allowed;
}

input:disabled ~ .toggleSwitch .toggleButton {
  background: #b0b0b0;
  left: 0.125rem;
}

/* 활성화된 상태의 버튼 */
.toggleSwitch .toggleButton {
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  top: 50%;
  left: 0.125rem;
  transform: translateY(-50%);
  border-radius: 50%;
  background: #ff4141;
  transition: all 0.2s ease-in;
}

/* 체크된 상태 */
#toggle:checked ~ .toggleSwitch {
  background: #ff4141;
}

#toggle:checked ~ .toggleSwitch .toggleButton {
  left: calc(100% - 1.375rem);
  background: #fff;
}

/* 왼쪽 여백 추가 */
.ml-2 {
  margin-left: 0.5rem;
}

/* 텍스트 라벨 */
.toggle-label {
  font-size: 1rem;
  white-space: nowrap;
}

/* 반응형 설정 */
@media (max-width: 576px) {
  .toggleSwitch {
    width: 2.75rem;
    height: 1.25rem;
  }

  .toggleSwitch .toggleButton {
    width: 1.125rem;
    height: 1.125rem;
  }

  .toggle-label {
    font-size: 0.875rem;
    text-align: center;
  }
}

@media (min-width: 576px) and (max-width: 768px) {
  .toggleSwitch {
    width: 3rem;
    height: 1.375rem;
  }

  .toggleSwitch .toggleButton {
    width: 1.25rem;
    height: 1.25rem;
  }
}
</style>
