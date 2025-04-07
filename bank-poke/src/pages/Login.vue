<template>
  <div class="container">
    <form action="/action_page.php" v-if="!showForgotPassword && !showSignup">
      <div class="text-center">
        <div class="main-title mb-1">로그인</div>
        <p class="sub-title text-secondary">
          Bank-Poke에 오신 것을 환영합니다.
        </p>
      </div>
      <div class="mb-3 mt-3">
        <input
          type="email"
          class="form-control"
          id="email"
          placeholder="이메일"
          name="email"
        />
      </div>
      <div class="mb-3">
        <div class="position-relative">
          <input
            :type="passwordVisible ? 'text' : 'password'"
            class="form-control"
            placeholder="비밀번호"
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
      <div class="d-grid">
        <button type="button" class="btn btn-light btn-block text-secondary">
          로그인
        </button>
      </div>
      <div class="text-center">
        <button
          type="button"
          class="btn btn-link sub-title text-secondary pt-3"
          @click="showSignup = true"
        >
          회원가입
        </button>
      </div>
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
    <Signup v-else-if="showSignup" @back="showSignup = false" />
    <ForgotPassword
      v-else-if="showForgotPassword"
      @back="showForgotPassword = false"
    />
  </div>
</template>

<script setup>
import ForgotPassword from '@/components/ForgotPassword.vue';
import Signup from '@/components/SignUp.vue';
import { ref } from 'vue';

const showForgotPassword = ref(false);
const showSignup = ref(false);
const passwordVisible = ref(false);

function togglePassword() {
  passwordVisible.value = !passwordVisible.value;
}
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
