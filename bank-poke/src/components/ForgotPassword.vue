<template>
  <div class="container">
    <form action="/action_page.php">
      <div class="text-center">
        <div class="main-title mb-1">비밀번호를 잊으셨나요?</div>
        <p class="sub-title text-secondary">
          비밀번호를 찾으려면 이메일 주소를 입력하세요.
        </p>
      </div>
      <div class="mb-3 mt-3">
        <input
          class="form-control border-danger"
          type="email"
          autofocus
          placeholder="이메일 주소 입력"
          v-model="email"
        />
      </div>
      <div class="d-grid">
        <button
          type="button"
          class="btn btn-light btn-block text-secondary"
          @click="checkEmail"
        >
          인증 코드 보내기
        </button>
      </div>
      <div class="text-center">
        <button
          type="button"
          class="btn btn-link sub-title text-secondary pt-3"
          @click.prevent="$emit('back')"
        >
          로그인으로 돌아가기
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['back']);
const email = ref('');
const checkEmail = async () => {
  try {
    const res = await fetch('/api/users');
    const users = await res.json();
    const found = users.find(
      (user) => user.email.toLowerCase() === email.value.toLowerCase()
    );

    if (!found) {
      alert('존재하지 않는 이메일입니다.');
    } else {
      alert('인증 코드를 보냈습니다.');
    }
  } catch (error) {
    console.error(error);
    alert('⚠️ 오류가 발생했습니다.');
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

input.form-control:focus {
  outline: none;
  box-shadow: none;
}
</style>
