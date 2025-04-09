<template>
  <div class="container">
    <h4 class="fw-bold mb-3">월별 예산 설정</h4>
    <!-- 예산 설정 테이블 -->
    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div
        v-for="(budget, month) in monthlyBudget"
        :key="month"
        class="col d-flex align-items-center"
      >
        <label
          class="form-label me-2 mb-0 fw-bold"
          :class="{ 'text-primary': isCurrentMonth(month) }"
          style="width: 100px"
        >
          {{ monthMap[month] }}
          <span v-if="isCurrentMonth(month)">✔️</span>
        </label>

        <input
          type="number"
          class="form-control"
          v-model.number="monthlyBudget[month]"
        />
      </div>
    </div>

    <!-- 예산 저장 버튼 -->
    <button class="btn btn-primary mt-4" @click="saveMonthlyBudget">
      예산 저장
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// 한글 매핑
const monthMap = {
  Jan: '1월',
  Feb: '2월',
  Mar: '3월',
  Apr: '4월',
  May: '5월',
  Jun: '6월',
  Jul: '7월',
  Aug: '8월',
  Sep: '9월',
  Oct: '10월',
  Nov: '11월',
  Dec: '12월',
};

// 현재 달 계산
const currentMonthEng = Object.keys(monthMap)[new Date().getMonth()];

// 현재 달 여부 판별
const isCurrentMonth = (month) => month === currentMonthEng;

// 예산 객체
const monthlyBudget = ref({ ...authStore.user.setting[0].monthlyBudget });

// 예산 저장
const saveMonthlyBudget = async () => {
  try {
    const updatedUser = {
      ...authStore.user,
      setting: [
        {
          ...authStore.user.setting[0],
          monthlyBudget: monthlyBudget.value,
        },
      ],
    };

    await fetch(`/api/users/${authStore.user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    authStore.setUser(updatedUser);
    alert('예산이 저장되었습니다.');
  } catch (error) {
    alert('예산 저장 중 오류가 발생했습니다.');
    console.error(error);
  }
};
</script>
