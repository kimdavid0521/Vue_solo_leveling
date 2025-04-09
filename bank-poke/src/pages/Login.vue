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

    <!-- 우측 로그인 카드 -->
    <div class="right-section">
      <div class="login-card">
        <form @submit.prevent v-if="!showSignup && !showForgotPassword">
          <div class="text-center mb-3 mt-5">
            <h4 class="main-title">BankPoke 로그인</h4>
          </div>

          <!-- 이메일 입력 -->
          <div class="mb-3">
            <input
              type="email"
              class="form-control"
              placeholder="이메일"
              autocomplete="email"
              v-model="email"
            />
          </div>

          <!-- 비밀번호 입력 -->
          <div class="mb-3 position-relative">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              class="form-control"
              placeholder="비밀번호"
              autocomplete="current-password"
              v-model="password"
            />
            <button
              type="button"
              class="btn btn-sm position-absolute top-50 end-0 translate-middle-y"
              @click="togglePassword"
            >
              <i v-if="passwordVisible" class="fa fa-eye-slash"></i>
              <i v-else class="fa fa-eye"></i>
            </button>
          </div>

          <!-- 로그인 버튼 -->
          <div class="d-grid">
            <button
              type="button"
              class="btn btn-light btn-block text-secondary"
              @click="login"
            >
              로그인하기
            </button>
          </div>

          <!-- 회원가입 & 비밀번호 찾기 -->
          <div class="text-center mt-2">
            <div class="d-grid">
              <button
                type="button"
                class="btn btn-secondary btn-block text-white"
                @click="showSignup = true"
              >
                이메일 회원가입
              </button>
            </div>
            <br />
            <button
              type="button"
              class="btn btn-link"
              @click="showForgotPassword = true"
              style="color: #2b2b2b"
            >
              비밀번호 재설정
            </button>
          </div>

          <!-- 이용약관 및 개인정보 취급 방침 -->
          <div class="footer-links">
            <a href="https://ko.realbyteapps.com/policy/terms.html">이용약관</a>
            <span>|</span>
            <a href="https://ko.realbyteapps.com/policy/privacy.html"
              >개인정보 취급 방침</a
            >
          </div>
        </form>
        <Signup v-else-if="showSignup" @back="showSignup = false" />
        <!-- 비밀번호 찾기 페이지 -->
        <ForgotPassword
          v-else-if="showForgotPassword"
          @back="showForgotPassword = false"
        />
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

const router = useRouter();
const authStore = useAuthStore();

// 비밀번호 찾기 페이지 표시 여부
const showForgotPassword = ref(false);
// 회원가입 페이지 표시 여부
const showSignup = ref(false);
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

/* 우측 폼 영역 */
.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
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
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

/* 로그인 타이틀 */
.main-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2b2b2b;
}

/* 버튼 색상 */
.btn-light {
  background-color: #ffd95a;
  font-weight: bold;
  color: #2b2b2b;
}

.btn-light:hover {
  background-color: #ffc436;
}

/* 이용약관/개인정보 */
.footer-links {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  font-weight: 300;
  font-size: 0.9rem;
  color: #2b2b2b;
  gap: 0.5rem;
}

.footer-links a {
  color: #2b2b2b;
  text-decoration: none;
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
