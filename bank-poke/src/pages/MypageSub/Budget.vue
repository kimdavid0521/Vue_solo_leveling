<template>
  <div class="budget-container mt-4">
    <h4 class="fw-bold mb-4 section-title">월별 예산 설정</h4>

    <!-- 월별 예산 입력 필드 -->
    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div v-for="(budget, month) in monthlyBudget" :key="month" class="col">
        <div
          class="budget-card"
          :class="{ 'current-month': isCurrentMonth(month) }"
        >
          <label class="budget-label">
            {{ monthMap[month] }}
            <span v-if="isCurrentMonth(month)">✔️</span>
          </label>
          <input
            type="number"
            class="form-control budget-input"
            v-model.number="monthlyBudget[month]"
          />
        </div>
      </div>
    </div>

    <!-- 저장 버튼 -->
    <div class="text-end">
      <button class="btn btn-save mt-4" @click="saveMonthlyBudget">
        예산 저장
      </button>
    </div>
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

<style scoped>
.budget-container {
  max-width: 900px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 2rem;
  color: #2b2b2b;
  border-left: 5px solid #ffd95a;
  padding-left: 0.75rem;
}

.budget-card {
  background-color: #f9f9f9;
  padding: 1rem;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: 0.2s;
}

.budget-card.current-month {
  background-color: #fff7db;
  border: 2px solid #ffd95a;
}

.budget-label {
  font-weight: 600;
  color: #333;
  width: 80px;
}

.budget-input {
  width: 50%;
  font-size: 0.95rem;
  border-radius: 6px;
}

.budget-input:focus {
  border-color: #ffd95a;
  box-shadow: 0 0 0 0.15rem rgba(255, 217, 90, 0.2);
  outline: none;
}

.btn-save {
  background-color: #ffd95a;
  font-weight: bold;
  color: #2b2b2b;
  padding: 0.6rem 1.5rem;
  border-radius: 8px;
}

.btn-save:hover {
  background-color: #ffc436;
}
</style>
