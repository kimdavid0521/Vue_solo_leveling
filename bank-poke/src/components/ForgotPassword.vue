<!-- ✅ 이렇게만 유지하세요 -->
<template>
  <form @submit.prevent>
    <!-- 비밀번호 찾기 타이틀 -->
    <div class="text-center mb-3">
      <div class="main-title mb-1">비밀번호를 잊으셨나요?</div>
      <p class="sub-title text-secondary">
        비밀번호를 찾으려면 이메일 주소를 입력하세요.
      </p>
    </div>

    <!-- 이메일 입력 필드 -->
    <div class="mb-3 mt-3">
      <input
        class="form-control"
        type="email"
        autofocus
        placeholder="이메일 주소 입력"
        v-model="email"
      />
    </div>

    <!-- 인증 코드 보내기 버튼 -->
    <div class="d-grid mt">
      <button
        type="button"
        class="btn btn-light btn-block text-secondary"
        @click="checkEmail"
      >
        인증 코드 보내기
      </button>
    </div>  

    <!-- 로그인으로 돌아가기 버튼 -->
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
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['back']);
const email = ref('');
const checkEmail = async () => {
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
    const found = users.find(
      (user) => user.email.toLowerCase() === email.value.toLowerCase()
    );

    // 이메일 존재 여부 체크
    if (!found) {
      alert('존재하지 않는 이메일입니다.');
    } else {
      alert('인증 코드를 보냈습니다.');
    }
  } catch (error) {
    // 오류 발생
    console.error(error);
    alert('오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.main-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #2b2b2b;
}

.sub-title {
  font-size: 0.9rem;
  font-weight: 300;
  color: #555555;
}

input.form-control:focus {
  outline: none;
  box-shadow: none;
}

.btn-light {
  background-color: #ffd95a;
  font-weight: bold;
  color: #2b2b2b;
}

.btn-light:hover {
  background-color: #ffc436;
}
</style>
