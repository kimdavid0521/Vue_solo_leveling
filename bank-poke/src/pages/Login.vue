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
        <ForgotPassword v-else="isForgot" @back="isForgot = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import ForgotPassword from "@/components/ForgotPassword.vue";
import Signup from "@/components/SignUp.vue";
import { ref } from "vue";
import LoginForm from "@/components/LoginForm.vue";

// 비밀번호 찾기 페이지 표시 여부
const isForgot = ref(false);
// 회원가입 페이지 표시 여부
const isSignup = ref(false);
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
  /* height: 100vh; ✅ 추가 */
}

/* 로그인 카드 */
.login-card {
  width: 100%;
  max-width: 600px;
  min-width: 500px;
  max-height: 500px;
  height: auto;
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
