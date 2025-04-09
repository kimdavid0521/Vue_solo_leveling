<template>
  <nav class="navbar navbar-expand-md bg-white shadow-sm">
    <div class="container-fluid px-4">
      <!-- 로고 -->
      <RouterLink to="/main" class="navbar-brand d-flex align-items-center">
        <img
          src="@/assets/bankPoke.png"
          alt="BankPoke 로고"
          class="logo me-2"
        />
        <span class="brand-text fw-bold text-dark">BankPoke</span>
      </RouterLink>

      <!-- 토글 버튼 (모바일용) -->
      <button
        class="navbar-toggler"
        type="button"
        @click="isNavOpen = !isNavOpen"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 메뉴 영역 -->
      <div class="collapse navbar-collapse" :class="{ show: isNavOpen }">
        <ul
          class="navbar-nav ms-auto d-flex align-items-center"
          style="gap: 1.5rem; font-size: 1rem"
        >
          <li class="nav-item">
            <RouterLink to="/main" class="nav-link">홈</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/analyze" class="nav-link">지출 분석</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/transaction-list" class="nav-link"
              >거래 내역</RouterLink
            >
          </li>
          <li class="nav-item">
            <RouterLink to="/asset" class="nav-link">내 자산</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/mypage" class="nav-link">마이 페이지</RouterLink>
          </li>
          <li>
            <Alarm />
          </li>
          <li>
            <Time />
          </li>
          <li>
            <MyAccount />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import Alarm from './Alarm.vue';
import Time from './TimeOut.vue';
import MyAccount from './MyAccount.vue';
const isNavOpen = ref(false);
</script>

<style scoped>
.logo {
  height: 40px;
  width: auto;
}

.navbar {
  height: 70px;
  border-bottom: 1px solid #eee;
}

.navbar .nav-link {
  color: #555;
  font-weight: 500;
  transition: color 0.2s ease;
}

.navbar .nav-link.router-link-exact-active {
  color: #ffc436;
  font-weight: bold;
}

.navbar .nav-link:hover {
  color: #ffc436;
  text-decoration: underline;
}

.brand-text {
  font-size: 1.2rem;
}
</style>
