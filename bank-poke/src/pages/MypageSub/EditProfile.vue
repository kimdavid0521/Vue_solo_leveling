<template>
  <div>
    <!-- 회원정보 수정 -->
    <h4 class="fw-bold mb-4">회원정보 수정</h4>
    <div v-if="!authenticated">
      <label class="form-label">현재 비밀번호</label>
      <input
        type="password"
        v-model="password"
        class="form-control"
        placeholder="현재 비밀번호 입력"
      />
      <button class="btn btn-primary mt-2" @click="verifyPassword">확인</button>
    </div>
    <div v-else>
      <!-- 닉네임 변경 -->
      <div class="mb-3">
        <label class="form-label">닉네임</label>
        <input
          type="text"
          v-model="nickname"
          class="form-control"
          placeholder="새 닉네임을 입력하세요"
        />
      </div>

      <!-- 새 비밀번호 -->
      <div class="mb-3">
        <label class="form-label">새 비밀번호</label>
        <input
          type="password"
          v-model="newPassword"
          class="form-control"
          placeholder="새 비밀번호 입력"
        />
      </div>

      <!-- 새 비밀번호 확인 -->
      <div class="mb-3">
        <label class="form-label">새 비밀번호 확인</label>
        <input
          type="password"
          v-model="newPasswordCheck"
          class="form-control"
          placeholder="비밀번호 확인"
        />
      </div>

      <!-- 저장 버튼 -->
      <button class="btn btn-success" @click="saveChanges">
        변경 내용 저장
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
console.log(authStore.user);

// 사용자 정보
const nickname = ref(authStore.user?.nickname ?? '');
const newPassword = ref('');
const newPasswordCheck = ref('');
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

// 저장
const saveChanges = async () => {
  if (newPassword.value && newPassword.value !== newPasswordCheck.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  try {
    const response = await fetch(`/api/users/${authStore.user?.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`, // 토큰 추가
      },
      body: JSON.stringify({
        ...authStore.user,
        nickname: nickname.value,
        password: newPassword.value || authStore.user.password,
      }),
    });

    if (!response.ok) {
      throw new Error('서버 응답 오류');
    }

    const updatedUser = await response.json();

    // auth store 업데이트
    authStore.setUser({
      ...authStore.user,
      nickname: nickname.value,
    });

    alert('변경이 완료되었습니다!');
    nickname.value = '';
    newPassword.value = '';
    newPasswordCheck.value = '';
    password.value = '';
  } catch (err) {
    console.error(err);
    alert('저장 중 오류가 발생했습니다: ' + err.message);
  }
};
</script>
