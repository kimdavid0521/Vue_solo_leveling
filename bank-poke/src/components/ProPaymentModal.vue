<template>
  <div class="modal fade" id="paymentModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered">
      <div
        class="modal-content border border-dark shadow-sm bg-white text-white rounded-4"
      >
        <!-- 모달 헤더 -->
        <div class="modal-header border-0 text-dark fw-bold">
          <h3 class="modal-title fw-bold">변경 사항 확인</h3>
          <button type="button" class="btn-close" @click="closeModal"></button>
        </div>
        
        <!-- 모달 바디 -->
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

        <!-- 모달 푸터 -->
        <div class="modal-footer border-0">
          <button
            type="button"
            class="btn btn-outline-dark"
            @click="closeModal"
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
import { ref, onMounted, onUnmounted } from 'vue';
import { Modal } from 'bootstrap';

const authStore = useAuthStore();
const done = ref(false);
let modalInstance = null;

// 모달 초기화
onMounted(() => {
  const modalElement = document.getElementById('paymentModal');
  modalInstance = new Modal(modalElement, {
    backdrop: true,
    keyboard: true,
  });

  // 모달이 닫힐 때 cleanup
  modalElement.addEventListener('hidden.bs.modal', cleanup);
});

onUnmounted(() => {
  cleanup();
});

const cleanup = () => {
  document.body.classList.remove('modal-open');
  const backdrops = document.querySelectorAll('.modal-backdrop');
  backdrops.forEach((backdrop) => backdrop.remove());

  // 스크롤 관련 스타일 제거
  document.body.style.overflow = '';
  document.body.style.paddingRight = '';
};

// 모달 닫기
const closeModal = () => {
  if (modalInstance) {
    modalInstance.hide();
  }
};

// 결제 확인
const confirmPayment = async () => {
  try {
    await fetch(`/api/users/${authStore.user?.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...authStore.user, isPremium: true }),
    });

    authStore.setUser({ ...authStore.user, isPremium: true });
    done.value = true;
    closeModal();
  } catch (error) {
    console.error(error);
    alert('결제 오류가 발생했습니다.');
  }
};
</script>
