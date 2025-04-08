<template>
  <div>
    <h4 class="fw-bold mb-4">회원탈퇴</h4>
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
        @click="verifyPassword"
        data-bs-toggle="modal"
        data-bs-target="#cancleAccountModal"
      >
        회원 탈퇴하기
      </button>
    </div>

    <!-- 저장 버튼 -->
    <CancleAccountModal />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import CancleAccountModal from '@/components/CancleAccountModal.vue';
const authStore = useAuthStore();

const password = ref('');
const authenticated = ref(false);

// 인증된 사용자 정보 저장
const verifiedUser = ref(null);

// 비밀번호 인증
const verifyPassword = async () => {
  try {
    const response = await fetch('/api/users');
    const users = await response.json();
    console.log(password);
    const found = users.find(
      (user) =>
        user.id === authStore.user?.id && user.password === password.value
    );
    console.log('authStore.user', authStore.user); // 전체 구조 찍어봐!
    if (!found) {
      alert('비밀번호가 일치하지 않습니다.');
    } else {
      verifiedUser.value = found;
      authenticated.value = true;
    }
  } catch (error) {
    console.error(error);
    alert('오류가 발생했습니다.');
  }
};
</script>

<style scoped></style>
