<template>
  <div class="modal fade" id="paymentModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content border border-dark shadow-sm bg-white text-white rounded-4"
      >
        <div class="modal-header border-0 text-dark fw-bold">
          <h3 class="modal-title fw-bold">변경 사항 확인</h3>
          <button
            type="button"
            class="btn-close btn-close-white"
            data-bs-dismiss="modal"
          ></button>
        </div>

        <div class="modal-body">
          <div class="d-flex justify-content-between">
            <div>
              <div class="fw-bold text-dark">Pro 구독</div>
              <small class="text-muted">월마다 결제, 오늘부터 시작</small>
            </div>
            <div class="fw-bold text-dark">₩1,000</div>
          </div>

          <div class="d-flex justify-content-between mt-3">
            <div class="text-muted fw-bold">정산</div>
            <div class="text-success fw-bold">-₩0</div>
          </div>

          <hr class="border-secondary" />

          <div class="d-flex justify-content-between">
            <div class="text-muted fw-bold">소계</div>
            <div class="text-dark">₩1,000</div>
          </div>
          <div class="d-flex justify-content-between text-muted">
            <div class="text-muted fw-bold">세금 10%</div>
            <div class="text-muted">₩100</div>
          </div>
          <div class="d-flex justify-content-between fw-bold mt-2">
            <div class="text-muted fw-bold">오늘 납부 총계</div>
            <div class="text-dark fw-bold">₩1,100</div>
          </div>
        </div>

        <div class="modal-footer border-0">
          <button
            type="button"
            class="btn btn-outline-dark"
            data-bs-dismiss="modal"
          >
            취소
          </button>
          <button
            type="button"
            class="btn btn-outline-dark btn-light fw-bold"
            @click="confirmPayment"
          >
            지금 결제
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';

const authStore = useAuthStore();
const done = ref(false);

const confirmPayment = async () => {
  try {
    await fetch(`/api/users/${authStore.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...authStore.user, isPremium: true }),
    });

    authStore.setUser({ ...authStore.user, isPremium: true });
    done.value = true;
  } catch (error) {
    alert('결제 오류가 발생했습니다.');
  }
};
</script>
