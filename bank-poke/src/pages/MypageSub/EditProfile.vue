<template>
  <div class="edit-profile-container">
    <h4 class="section-title">회원정보 수정</h4>
    <div class="form-box">
      <!-- 비밀번호 인증 전 -->
      <div v-if="!authenticated">
        <label class="form-label">현재 비밀번호</label>
        <input
          type="password"
          v-model="password"
          class="form-control"
          placeholder="현재 비밀번호 입력"
        />
        <button class="btn btn-auth mt-3" @click="verifyPassword">확인</button>
      </div>

      <!-- 인증 후 수정 폼 -->
      <div v-else>
        <div class="mb-3">
          <label class="form-label">닉네임</label>
          <input
            type="text"
            v-model="nickname"
            class="form-control"
            placeholder="새 닉네임을 입력하세요"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">새 비밀번호</label>
          <input
            type="password"
            v-model="newPassword"
            class="form-control"
            placeholder="새 비밀번호 입력"
          />
        </div>

        <div class="mb-3">
          <label class="form-label">새 비밀번호 확인</label>
          <input
            type="password"
            v-model="newPasswordCheck"
            class="form-control"
            placeholder="비밀번호 확인"
          />
        </div>

        <button class="btn btn-save mt-3" @click="saveChanges">
          변경 내용 저장
        </button>
      </div>
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

<style scoped>
.edit-profile-container {
  max-width: 500px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2b2b2b;
  margin-bottom: 2rem;
  border-left: 5px solid #ffd95a;
  padding-left: 0.75rem;
}

.form-box {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

input.form-control {
  border-radius: 6px;
  padding: 0.6rem 0.9rem;
  font-size: 0.95rem;
}

input.form-control:focus {
  border-color: #ffd95a;
  box-shadow: 0 0 0 0.2rem rgba(255, 217, 90, 0.2);
  outline: none;
}

.btn-auth {
  background-color: #ffd95a;
  color: #2b2b2b;
  font-weight: bold;
  width: 100%;
}

.btn-auth:hover {
  background-color: #ffc436;
}

.btn-save {
  background-color: #28a745;
  color: white;
  font-weight: bold;
  width: 100%;
}

.btn-save:hover {
  background-color: #218838;
}
</style>
