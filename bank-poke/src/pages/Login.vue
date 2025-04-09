<template>
  <div class="login-page">
    <!-- 좌측 이미지 영역 -->
    <div class="left-section">
      <div class="welcome-text">
        <h2>Hello,</h2>
        <h3>건강한 소비 생활을 도와주는</h3>
        <h3><strong>BankPoke</strong>입니다.</h3>
      </div>
      <img
        src="@/assets/bankPoke.png"
        alt="welcome-graphic"
        class="login-graphic"
      />
    </div>

    <!-- 오른쪽 카드 영역 -->
    <div class="right-section">
      <div class="login-card">
        <LoginForm
          v-if="!isSignup && !isForgot"
          @goSignup="isSignup = true"
          @goForgot="isForgot = true"
        />

        <Signup v-else-if="isSignup" @back="isSignup = false" />

        <ForgotPassword v-else @back="isForgot = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ForgotPassword from '@/components/ForgotPassword.vue';
import Signup from '@/components/SignUp.vue';
import { useAuthStore } from '@/stores/auth';
import { ref } from 'vue';
import LoginForm from '@/components/LoginForm.vue';
const router = useRouter();
const authStore = useAuthStore();

// 비밀번호 찾기 페이지 표시 여부
const isForgot = ref(false);
// 회원가입 페이지 표시 여부
const isSignup = ref(false);
// 비밀번호 보이기 여부
const passwordVisible = ref(false);

// 비밀번호 보이기 토글
function togglePassword() {
  passwordVisible.value = !passwordVisible.value;
}

// 이메일 입력 값
const email = ref('');
// 비밀번호 입력 값
const password = ref('');

// 로그인 버튼 클릭 시 실행
const login = async () => {
  // 이메일 입력 체크
  if (!email.value) {
    alert('이메일을 입력해주세요.');
    return;
  }

  // 이메일 형식 체크
  if (!email.value.includes('@')) {
    alert('이메일 형식이 올바르지 않습니다.');
    return;
  }

  try {
    const response = await fetch('/api/users');
    const users = await response.json();

    const foundUser = users.find(
      (user) =>
        user.email.toLowerCase() === email.value.toLowerCase() &&
        user.password === password.value
    );

    if (!foundUser) {
      alert('이메일 또는 비밀번호가 일치하지 않습니다.');
    } else {
      authStore.setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      router.push('/main');
    }
  } catch (error) {
    console.error(error);
    alert('오류가 발생했습니다.');
  }
};
</script>

<style scoped>
html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

.login-page {
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
}

/* 좌측 이미지 영역 */
.left-section {
  flex: 2;
  background-color: #ffffff;
  padding: 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #333;
  text-align: center;
}

/* 인삿말 간격 */
.welcome-text h2,
.welcome-text h3 {
  margin: 0.2rem 0;
  display: block;
}

/* 이미지 크기 */
.login-graphic {
  max-width: 80%;
  height: auto;
  margin-top: 2rem;
}

.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  height: 100vh; /* ✅ 추가 */
}

/* 로그인 카드 */
.login-card {
  width: 100%;
  max-width: 600px;
  min-width: 500px;
  height: 500px;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
}

/* 반응형 처리 */
@media screen and (max-width: 1024px) {
  /* 이미지 숨기기 */
  .login-graphic {
    display: none;
  }

  /* 로그인 박스 안에 welcome-text 보이게 하기 */
  .left-section {
    display: none; /* left-section은 숨기고 */
  }

  .login-card::before {
    white-space: pre-line;
    display: block;
    font-size: 1rem;
    font-weight: 400;
    text-align: center;
    color: #2b2b2b;
    margin-bottom: 1rem;
  }
}
</style>
