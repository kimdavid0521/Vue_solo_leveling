<template>
  <div>
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
