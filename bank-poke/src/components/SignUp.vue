<template>
  <div class="login-page">
    <div class="right-section">
      <div class="login-card">
        <form @submit.prevent>
          <div class="text-center mb-3">
            <div class="main-title mb-1">회원가입</div>
          </div>

          <!-- 이름 & 닉네임 -->
          <div class="mb-3 mt-3 row">
            <div class="col">
              <label class="form-label">이름</label>
              <input
                class="form-control"
                type="text"
                placeholder="이름 입력"
                v-model="username"
                required
              />
            </div>
            <div class="col">
              <label class="form-label">닉네임</label>
              <input
                class="form-control"
                type="text"
                placeholder="닉네임 입력"
                v-model="nickname"
                required
              />
            </div>
          </div>

          <!-- 이메일 -->
          <div class="mb-3 mt-3 row align-items-end">
            <div class="col-6">
              <label class="form-label">이메일</label>
              <input
                class="form-control"
                type="text"
                placeholder="이메일 입력"
                v-model="email"
                required
                autocomplete
              />
            </div>
            <div class="col-1 text-center">@</div>
            <div class="col-5">
              <label class="form-label">&nbsp;</label>
              <select class="form-select" v-model="emailDomain" required>
                <option value="" disabled selected>선택</option>
                <option value="naver.com">naver.com</option>
                <option value="gmail.com">gmail.com</option>
                <option value="daum.net">daum.net</option>
                <option value="hanmail.net">hanmail.net</option>
              </select>
            </div>
          </div>

          <!-- 비밀번호 -->
          <div class="mb-3 mt-3">
            <label class="form-label">비밀번호</label>
            <input
              class="form-control"
              type="password"
              placeholder="비밀번호 입력"
              v-model="password"
              required
            />
          </div>

          <!-- 비밀번호 확인 -->
          <div class="mb-3 mt-3">
            <label class="form-label">비밀번호 확인</label>
            <input
              class="form-control"
              type="password"
              placeholder="비밀번호 확인"
              v-model="passwordCheck"
              required
            />
          </div>

          <!-- 버튼 영역 -->
          <div class="d-grid">
            <button
              type="submit"
              class="btn btn-light text-secondary"
              @click="signUp"
            >
              회원가입
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
    </div>
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
      asset_group: {
        card: [],
        account: [],
        etc: [],
      },
      setting: [
        {
          currency: 'kr',
          weekStart: 'Monday',
          monthStart: 1,
          monthlyBudget: {
            Jan: 0,
            Feb: 0,
            Mar: 0,
            Apr: 0,
            May: 0,
            Jun: 0,
            Jul: 0,
            Aug: 0,
            Sep: 0,
            Oct: 0,
            Nov: 0,
            Dec: 0,
          },
        },
      ],
      transactions: [],
      fixCost: [],
      together_bank: [],
      category: {
        expense: [
          {
            id: 1,
            main_category: '식비',
            sub_categories: ['외식', '마트', '카페', '배달'],
          },
          {
            id: 2,
            main_category: '교통비',
            sub_categories: ['버스', '지하철', '택시', '기타'],
          },
          {
            id: 3,
            main_category: '주거/통신',
            sub_categories: ['월세', '관리비', '인터넷', '휴대폰'],
          },
          {
            id: 4,
            main_category: '생활',
            sub_categories: ['세탁', '청소', '생필품'],
          },
          {
            id: 5,
            main_category: '기타',
            sub_categories: ['기타 지출'],
          },
        ],
        income: [
          {
            id: 1,
            main_category: '급여',
            sub_categories: ['월급', '상여금'],
          },
          {
            id: 2,
            main_category: '용돈',
            sub_categories: ['부모님', '친척', '기타'],
          },
          {
            id: 3,
            main_category: '투자수익',
            sub_categories: ['주식', '코인', '이자'],
          },
          {
            id: 4,
            main_category: '기타',
            sub_categories: ['환급', '기타 수입'],
          },
        ],
      },
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
.login-page {
  display: flex;
  min-height: 100vh;
  background-color: #f9f9f9;
}

/* 우측 폼 영역 */
.right-section {
  flex: 1;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  height: 100vh; /* ✅ 추가 */
}

.login-card {
  width: 100%;
  max-width: 600px;
  min-width: 500px;
  height: 500px;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);

  /* Flexbox를 사용하여 중앙 정렬 적용 */
  display: flex;
  flex-direction: column;
  /* align-items: center; 가로 중앙 정렬 */
  justify-content: center; /* 세로 중앙 정렬 */
  /* text-align: center; 내부 텍스트도 중앙 정렬 */
}
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
