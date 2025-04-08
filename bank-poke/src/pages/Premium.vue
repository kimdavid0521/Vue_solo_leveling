<template>
  <div class="container">
    <div class="container my-5 text-dark">
      <div>
        {{ authStore.user.id }}
        {{ authStore.user.isPremium }}
      </div>
      <h2 class="text-center fw-bold mb-4">플랜 업그레이드</h2>

      <!-- 플랜 카드 -->
      <div class="row justify-content-center text-start">
        <!-- Free Plan -->
        <div
          class="col-md-5 p-4 m-2 rounded-4 border border-dark shadow-sm bg-white"
        >
          <h4 class="fw-bold">Free</h4>
          <h2 class="fw-bold">
            0원 <small class="text-muted fs-6">/월</small>
          </h2>
          <button class="btn btn-outline-secondary w-100 mb-3" disabled>
            나의 현재 플랜
          </button>
          <ul class="list-unstyled">
            <li>✔️ 통계 자료 제공</li>
            <li>✔️ 거래 내역 입력</li>
            <li>✔️ 예산 정리</li>
          </ul>
        </div>

        <!-- Pro Plan -->
        <div
          class="col-md-5 p-4 m-2 rounded-4 border border-dark shadow-sm bg-white"
        >
          <h4 class="fw-bold">Pro</h4>
          <h2 class="fw-bold">
            1,000원 <small class="text-muted fs-6">/월</small>
          </h2>
          <button class="btn btn-dark w-100 mb-3 fw-bold" @click="registerPro">
            Pro 이용하기
          </button>
          <ProPaymentModal />

          <ul class="list-unstyled">
            <li>✔️ 통계 자료 및 그래프 제공</li>
            <li>✔️ 통계 자료 CSV 파일 제공</li>
            <li>✔️ 거래 내역 입력</li>
            <li>✔️ 예산 정리</li>
            <li>✔️ 모임통장 기능 오픈</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ProPaymentModal from '@/components/ProPaymentModal.vue';
const router = useRouter();
const authStore = useAuthStore();

const registerPro = async () => {
  try {
    const response = await fetch(`/api/users/${authStore.user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...authStore.user,
        isPremium: true,
      }),
    });

    if (!response.ok) {
      throw new Error('서버 응답 오류');
    }

    const updatedUser = await response.json();

    // auth store 업데이트
    authStore.setUser({
      ...authStore.user,
      isPremium: true,
    });

    alert('Pro 등록이 완료되었습니다!');
  } catch (err) {
    console.error(err);
    alert('저장 중 오류가 발생했습니다: ' + err.message);
  }
};
</script>

<style scoped>
.container {
  background-color: #f9f9f9;
  padding: 3rem;
  border-radius: 1rem;
}
</style>
