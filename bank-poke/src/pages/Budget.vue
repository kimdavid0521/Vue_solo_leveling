<template>
  <div class="container">
    <h4 class="fw-bold mb-3">월별 예산 설정</h4>

    <div class="row row-cols-1 row-cols-md-2 g-3">
      <div
        v-for="(budget, month) in monthlyBudget"
        :key="month"
        class="col d-flex align-items-center"
      >
        <label class="form-label me-2 mb-0" style="width: 80px">{{
          month
        }}</label>
        <input
          type="number"
          class="form-control"
          v-model.number="monthlyBudget[month]"
        />
      </div>
    </div>

    <button class="btn btn-primary mt-4" @click="saveMonthlyBudget">
      예산 저장
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
console.log(authStore.user.setting[0].monthlyBudget);
// 월별 예산 객체 가져오기
const monthlyBudget = ref({ ...authStore.user.setting[0].monthlyBudget });

// 예산 저장 함수
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

    // 업데이트 후 store도 갱신
    authStore.setUser(updatedUser);

    alert('예산이 저장되었습니다.');
  } catch (error) {
    alert('예산 저장 중 오류가 발생했습니다.');
    console.error(error);
  }
};
</script>
