<template>
  <div class="container mt-4">
    <div class="row mb-4">
      <!-- 왼쪽: 도넛 차트 (수입 비율) -->
      <div class="col-12 col-md-5 mb-3 mb-md-0">
        <div class="card shadow-sm p-3 h-100 hover-lift">
          <h5 class="card-title text-center fw-bold">카테고리별 수입 비율</h5>
          <div
            class="ratio ratio-1x1 d-flex justify-content-center align-items-center"
            style="max-width: 100%; height: 20rem"
          >
            <Doughnut
              v-if="incomeChartData"
              :data="incomeChartData"
              :options="chartOptions"
            />
          </div>
          <div
            class="d-flex justify-content-center align-items-center flex-wrap gap-2"
          >
            <input
              type="checkbox"
              id="toggle-income"
              hidden
              v-model="isDetail"
              @change="loadData"
            />
            <label for="toggle-income" class="toggleSwitch">
              <span class="toggleButton"></span>
            </label>
            <span class="ml-2 toggle-label"> 더 자세히 </span>
          </div>
        </div>
      </div>

      <!-- 오른쪽: 수입 분석 요약 -->
      <div class="col-12 col-md-7">
        <div class="card shadow-sm p-3 h-100 hover-lift">
          <div class="mb-5">
            <h5 class="text-center mb-3 fw-bold">수입 분석</h5>
            <ul class="m-3" v-if="Object.keys(incomeCategorySummary).length">
              <li
                v-for="(amount, category) in incomeCategorySummary"
                :key="category"
              >
                {{ category }} : {{ amount.toLocaleString() }}원
              </li>
            </ul>
            <p class="text-center text-muted" v-else>수입 내역이 없습니다.</p>
          </div>
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

const incomeChartData = computed(() => chartStore.incomeChartData);
const incomeCategorySummary = computed(() => chartStore.incomeCategorySummary);

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

const loadData = async () => {
  if (assetStore.users.length === 0) {
    await assetStore.fetchUsers();
  }
  if (user.value) {
    await chartStore.fetchIncomeData(props.year, props.month, !isDetail.value);
  }
};

onMounted(loadData);

watch(
  () => [props.year, props.month, user.value],
  async ([_, __, currentUser]) => {
    if (currentUser) {
      await chartStore.fetchIncomeData(
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

input:disabled ~ .toggleSwitch {
  background-color: #e0e0e0;
  cursor: not-allowed;
}
input:disabled ~ .toggleSwitch .toggleButton {
  background: #b0b0b0;
  left: 0.125rem;
}

.toggleSwitch .toggleButton {
  width: 1.25rem;
  height: 1.25rem;
  position: absolute;
  top: 50%;
  left: 0.125rem;
  transform: translateY(-50%);
  border-radius: 50%;
  background: #2575ff;
  transition: all 0.2s ease-in;
}

#toggle-income:checked ~ .toggleSwitch {
  background: #2575ff;
}
#toggle-income:checked ~ .toggleSwitch .toggleButton {
  left: calc(100% - 1.375rem);
  background: #fff;
}

.ml-2 {
  margin-left: 0.5rem;
}
.toggle-label {
  font-size: 1rem;
  white-space: nowrap;
}

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
