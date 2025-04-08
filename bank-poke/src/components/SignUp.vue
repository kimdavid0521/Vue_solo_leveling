<template>
  <div class="container">
    <form action="/action_page.php" @submit.prevent="signUp">
      <div class="text-center">
        <div class="main-title mb-1">회원가입</div>
      </div>
      <div class="mb-3 mt-3">
        <div class="row">
          <!-- 이름 -->
          <div class="col">
            <label for="username" class="form-label">이름</label>
            <input
              class="form-control"
              type="text"
              autofocus
              placeholder="이름 입력"
              v-model="username"
              required
            />
          </div>
          <!-- 닉네임 -->
          <div class="col">
            <label for="nickname" class="form-label">닉네임</label>
            <input
              class="form-control"
              type="text"
              autofocus
              placeholder="닉네임 입력"
              v-model="nickname"
              required
            />
          </div>
        </div>
      </div>
      <!-- 이메일 -->
      <div class="mb-3 mt-3">
        <div class="row align-items-end">
          <div class="col-6">
            <label for="email" class="form-label">이메일</label>
            <input
              class="form-control"
              type="text"
              autofocus
              placeholder="이메일 입력"
              v-model="email"
              required
            />
          </div>
          <div class="col-1 d-flex justify-content-center align-items-end">
            <span class="pb-1">@</span>
          </div>
          <div class="col-5">
            <label for="emailDomain" class="form-label">&nbsp;</label>
            <select class="form-select" v-model="emailDomain" required>
              <option value="" disabled selected>선택</option>
              <option value="naver.com">naver.com</option>
              <option value="gmail.com">gmail.com</option>
              <option value="daum.net">daum.net</option>
              <option value="hanmail.net">hanmail.net</option>
            </select>
          </div>
        </div>
      </div>
      <!-- 비밀번호 -->
      <div class="mb-3 mt-3">
        <label for="password" class="form-label">비밀번호</label>
        <input
          class="form-control"
          type="password"
          autofocus
          placeholder="비밀번호 입력"
          v-model="password"
          required
        />
      </div>
      <!-- 비밀번호 확인 -->
      <div class="mb-3 mt-3">
        <label for="password" class="form-label">비밀번호 확인</label>
        <input
          class="form-control"
          type="password"
          autofocus
          placeholder="비밀번호 확인"
          v-model="passwordCheck"
          required
        />
      </div>
      <!-- 회원가입 버튼 -->
      <div class="d-grid">
        <button type="submit" class="btn btn-light btn-block text-secondary">
          회원가입
        </button>
      </div>
      <!-- 로그인으로 돌아가기 -->
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

const username = ref('');
const nickname = ref('');
const email = ref('');
const emailDomain = ref('');
const password = ref('');
const passwordCheck = ref('');
const emit = defineEmits(['back']);

const signUp = async () => {
  // 비밀번호 더블 체크
  if (password.value !== passwordCheck.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }

  // 모든 필드 입력 체크
  if (!email.value || !username.value || !nickname.value || !password.value) {
    alert('모든 필드를 입력해주세요.');
    return;
  }

  try {
    const fullEmail = `${email.value}@${emailDomain.value}`;

    // 중복 이메일 체크
    const response = await fetch('/api/users');
    const users = await response.json();
    const found = users.find(
      (user) => user.email.toLowerCase() === fullEmail.toLowerCase()
    );
    if (found) {
      alert('이미 존재하는 이메일입니다.');
      return;
    }

    // 중복이 없으면 회원가입 진행
    const userData = {
      username: username.value,
      nickname: nickname.value,
      email: fullEmail,
      password: password.value,
      isPremium: false,
      card: [],
      account: [],
      setting: {
        currency: 'kr',
        weekStart: 'Monday',
        monthStart: 1,
        budget: 0,
      },
      transactions: [],
      fixCost: [],
      together_bank: [],
      category: ['식비'],
    };

    // 회원가입 요청
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    // 회원가입 성공
    if (res.ok) {
      alert('회원가입이 완료되었습니다.');
      emit('back');
    } else {
      throw new Error('회원가입 실패');
    }
  } catch (error) {
    // 회원가입 실패
    console.error(error);
    alert('회원가입 중 오류가 발생했습니다.');
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
