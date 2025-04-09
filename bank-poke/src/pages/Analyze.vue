<template>
  <div class="container py-4">
    <!-- 년/월 선택 -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <button class="btn btn-outline-primary" @click="prevMonth">
        &#8592;
      </button>
      <h3 @click="showPicker = !showPicker" style="cursor: pointer">
        {{ displayDate }}
      </h3>

      <!-- 달력 -->
      <div
        v-if="showPicker"
        class="position-absolute bg-white border rounded shadow p-2"
        style="z-index: 10"
      >
        <Datepicker
          v-model="selectedMonth"
          type="month"
          format="YYYY-MM"
          :clearable="false"
          :editable="false"
          @closed="showPicker = false"
        />
      </div>
      <button class="btn btn-outline-primary" @click="nextMonth">
        &#8594;
      </button>
    </div>

    <!-- 차트 컴포넌트 -->
    <DailyExpenseChart :year="year" :month="month" />
    <CategoryExpenseChart :year="year" :month="month" />
    <CategoryIncomeChart :year="year" :month="month" />
    <BudgetProgress :year="year" :month="month" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import DailyExpenseChart from '@/components/DailyExpenseChart.vue';
import CategoryExpenseChart from '@/components/CategoryExpenseChart.vue';
import CategoryIncomeChart from '@/components/CategoryIncomeChart.vue';
import BudgetProgress from '@/components/BudgetProgress.vue';
import Datepicker from 'vue3-datepicker';

const selectedMonth = ref(new Date()); // 기본값 현재 월

const today = dayjs();
const year = ref(today.year());
const month = ref(today.month());

const displayDate = computed(() => `${year.value}년 ${month.value + 1}월`);

// 월 이동 함수
function prevMonth() {
  const date = dayjs()
    .year(year.value)
    .month(month.value)
    .date(1)
    .subtract(1, 'month');
  year.value = date.year();
  month.value = date.month();
}

function nextMonth() {
  const date = dayjs()
    .year(year.value)
    .month(month.value)
    .date(1)
    .add(1, 'month');
  year.value = date.year();
  month.value = date.month();
}
</script>

<style scoped>
.container {
  max-width: 900px;
}
</style>
