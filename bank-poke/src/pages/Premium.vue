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
          <button
            class="btn w-100 mb-3"
            :class="
              authStore.user?.isPremium
                ? 'btn-outline-dark'
                : 'btn-outline-secondary'
            "
            :disabled="!authStore.user || !authStore.user.isPremium"
            @click="registerFree"
          >
            {{ authStore.user?.isPremium ? 'Free 이용하기' : '나의 현재 플랜' }}
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
          <button
            class="btn w-100 mb-3"
            :class="
              authStore.user?.isPremium ? 'btn-outline-secondary' : 'btn-dark'
            "
            :disabled="authStore.user?.isPremium"
            data-bs-toggle="modal"
            data-bs-target="#paymentModal"
          >
            {{ authStore.user?.isPremium ? '나의 현재 플랜' : 'Pro 이용하기' }}
          </button>
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
    <!-- 모달 컴포넌트를 여기로 이동 -->
    <ProPaymentModal />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import ProPaymentModal from '@/components/ProPaymentModal.vue';
const authStore = useAuthStore();
const router = useRouter();

const registerFree = () => {
  authStore.setUser({ ...authStore.user, isPremium: false });
};
</script>

<style scoped>
.container {
  background-color: #f9f9f9;
  padding: 3rem;
  border-radius: 1rem;
}
</style>
