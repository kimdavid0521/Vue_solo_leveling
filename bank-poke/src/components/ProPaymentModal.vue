<template>
  <div class="container">
    <div class="modal fade" id="paymentModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content bg-dark text-white rounded-4">
          <div class="modal-header border-0">
            <h5 class="modal-title">변경 사항 확인</h5>
            <button
              type="button"
              class="btn-close btn-close-white"
              data-bs-dismiss="modal"
            ></button>
          </div>

          <div class="modal-body">
            <div class="d-flex justify-content-between">
              <div>
                <div class="fw-bold">Pro 구독</div>
                <small class="text-muted">월마다 결제, 오늘부터 시작</small>
              </div>
              <div class="fw-bold">\1,000.00</div>
            </div>

            <div class="d-flex justify-content-between mt-3">
              <div class="text-muted">정산</div>
              <div class="text-success">-\0.00</div>
            </div>

            <hr class="border-secondary" />

            <div class="d-flex justify-content-between">
              <div>소계</div>
              <div>\1,000.00</div>
            </div>
            <div class="d-flex justify-content-between">
              <div>세금 10%</div>
              <div>\100.00</div>
            </div>
            <div class="d-flex justify-content-between fw-bold mt-2">
              <div>오늘 납부 총계</div>
              <div>\1,100.00</div>
            </div>

            <hr class="border-secondary" />

            <div class="text-muted">결제 방법</div>
            <div class="fw-bold">VISA *1234</div>
          </div>

          <div class="modal-footer border-0">
            <button
              type="button"
              class="btn btn-outline-light"
              data-bs-dismiss="modal"
            >
              취소
            </button>
            <button
              type="button"
              class="btn btn-light fw-bold"
              @click="confirmPayment"
            >
              지금 결제
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

const confirmPayment = async () => {
  try {
    await fetch(`/api/users/${authStore.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...authStore.user,
        isPremium: true,
      }),
    });

    authStore.setUser({
      ...authStore.user,
      isPremium: true,
    });

    alert('Pro 등록이 완료되었습니다!');
    const modal = bootstrap.Modal.getInstance(
      document.getElementById('paymentModal')
    );
    modal.hide();
  } catch (error) {
    alert('결제 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.modal-content {
  font-family: 'Pretendard', sans-serif;
}
</style>
