<template>
  <div class="container mt-4">
    <h4 class="fw-bold mb-4">회원탈퇴</h4>

    <!-- 비밀번호 인증 전 -->
    <div v-if="!authenticated">
      <label class="form-label">현재 비밀번호</label>
      <input
        type="password"
        v-model="password"
        class="form-control"
        placeholder="현재 비밀번호 입력"
      />
      <button
        class="btn w-100 mb-3"
        :class="
          authStore.user?.isPremium ? 'btn-outline-secondary' : 'btn-dark'
        "
        @click="handleDeleteAccount"
      >
        회원 탈퇴하기
      </button>
    </div>

    <!-- 모달 컴포넌트 -->
    <CancleAccountModal />
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import { useAuthStore } from '@/stores/auth';
import * as bootstrap from 'bootstrap';

// 모달 컴포넌트 가져오기
import CancleAccountModal from '@/components/CancleAccountModal.vue';

const authStore = useAuthStore();

// 사용자가 입력한 비밀번호
const password = ref('');
// 이미 인증됐는지 표시 (비밀번호 일치한 적이 있는지)
const authenticated = ref(false);

// 비밀번호 검증
const verifyPassword = async () => {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();

    const found = users.find(
      (user) =>
        user.id === authStore.user?.id && user.password === password.value
    );

    if (!found) {
      alert('비밀번호가 일치하지 않습니다.');
      return false;
    }
    return true;
  } catch (error) {
    console.error(error);
    alert('오류가 발생했습니다.');
    return false;
  }
};

// 회원탈퇴 버튼 클릭시 처리
const handleDeleteAccount = async () => {
  // 1) 비밀번호 인증
  const isValid = await verifyPassword();
  if (!isValid) return;

  // 2) 비밀번호가 맞았다면, “인증됨” 상태로 전환
  authenticated.value = true;

  // 3) 모달 오픈
  await nextTick(); // DOM이 준비되길 기다린 후
  const modalEl = document.getElementById('cancleAccountModal');
  if (!modalEl) {
    console.warn('❗ 모달 DOM 요소를 찾지 못함');
    return;
  }
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
  modalInstance.show();
};
</script>
<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}
/* 전체 영역 정렬 */

/* 타이틀 */
h4 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2b2b2b;
  margin-bottom: 2rem;
  border-left: 5px solid #ffd95a;
  padding-left: 0.75rem;
}

/* 입력 필드 */
input.form-control {
  font-size: 0.95rem;
  padding: 0.6rem 0.9rem;
  border-radius: 6px;
}

input.form-control:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.2);
  outline: none;
}

/* 탈퇴 버튼 */
.btn-dark,
.btn-outline-secondary {
  font-weight: bold;
  border-radius: 8px;
  padding: 0.6rem 1rem;
}

.btn-dark {
  background-color: #dc3545;
  color: white;
  border: none;
}

.btn-dark:hover {
  background-color: #c82333;
}

.btn-outline-secondary {
  border-color: #ccc;
  color: #555;
}

.btn-outline-secondary:hover {
  background-color: #eee;
  color: #333;
}
</style>
