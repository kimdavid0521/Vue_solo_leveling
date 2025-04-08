<template>
  <div class="container">
    <form action="/action_page.php" v-if="!showForgotPassword && !showSignup">
      <div class="text-center">
        <!-- 로그인 타이틀 -->
        <div class="main-title mb-1">로그인</div>
        <p class="sub-title text-secondary">
          Bank-Poke에 오신 것을 환영합니다.
        </p>
      </div>
      <!-- 이메일 입력 -->
      <div class="mb-3 mt-3">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="이메일"
          autocomplete="email"
          name="email"
          v-model="email"
        />
      </div>
      <!-- 비밀번호 입력 -->
      <div class="mb-3">
        <div class="position-relative">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            class="form-control"
            placeholder="비밀번호"
            autocomplete="current-password"
            name="password"
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
      </div>
      <!-- 로그인 버튼 -->
      <div class="d-grid">
        <button
          type="button"
          class="btn btn-light btn-block text-secondary"
          @click="login"
        >
          로그인
        </button>
      </div>
      <!-- 회원가입 버튼 -->
      <div class="text-center">
        <button
          type="button"
          class="btn btn-link sub-title text-secondary pt-3"
          @click="showSignup = true"
        >
          회원가입
        </button>
      </div>
      <!-- 비밀번호 찾기 버튼 -->
      <div class="text-center">
        <button
          type="button"
          class="btn btn-link sub-title text-secondary pt-1"
          @click="showForgotPassword = true"
        >
          비밀번호를 잊으셨습니까?
        </button>
      </div>
    </form>
    <!-- 회원가입 페이지 -->
    <Signup v-else-if="showSignup" @back="showSignup = false" />
    <!-- 비밀번호 찾기 페이지 -->
    <ForgotPassword
      v-else-if="showForgotPassword"
      @back="showForgotPassword = false"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import ForgotPassword from '@/components/ForgotPassword.vue';
import Signup from '@/components/SignUp.vue';
import { ref } from 'vue';

const router = useRouter();

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
      router.push('/main');
    }
  } catch (error) {
    console.error(error);
    alert('오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9f9f9;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

.main-title {
  font-size: 1rem;
  font-weight: lighter;
  color: #242323;
}

.sub-title {
  font-size: 0.8rem;
  font-weight: lighter;
  color: #555555;
}

form {
  width: 100%;
  max-width: 400px; /* 폼 너비 제한 */
  padding: 2rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
</style>
