<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white px-4 py-2">
    <div
      class="container-fluid d-flex align-items-center justify-content-between"
    >
      <!-- 왼쪽: 로고 + 토글 버튼 -->
      <div class="d-flex align-items-center me-auto">
        <!-- 로고 -->
        <RouterLink
          to="/main"
          class="navbar-brand d-flex align-items-center fw-bold text-dark"
        >
          <img
            src="../assets/bankPoke.png"
            alt="logo"
            width="24"
            height="24"
            class="me-2"
          />
          BankPoke
        </RouterLink>

        <!-- 토글 버튼 -->
        <button
          class="navbar-toggler ms-2"
          type="button"
          @click="toggleNav"
          :aria-expanded="isOpen"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

        <!-- 중앙: 메뉴 -->
      <div
        class="collapse navbar-collapse justify-content-center"
        :class="{ show: isOpen }"
      >
        <ul class="navbar-nav mb-2 mb-lg-0">
          <li class="nav-item me-3">
            <RouterLink
              to="/main"
              class="nav-link fw-bold text-secondary"
              active-class="active"
              exact-active-class="active"
              @click="closeNavbar"
            >
              가계부
            </RouterLink>
          </li>
          <li class="nav-item me-3">
            <RouterLink
              to="/transaction-list"
              class="nav-link fw-bold text-secondary"
              active-class="active"
              exact-active-class="active"
              @click="closeNavbar"
            >
              거래 내역
            </RouterLink>
          </li>
          <li class="nav-item me-3">
            <RouterLink
              to="/analyze"
              class="nav-link fw-bold text-secondary"
              active-class="active"
              exact-active-class="active"
              @click="closeNavbar"
            >
              분석
            </RouterLink>
          </li>
          <li class="nav-item me-3">
            <RouterLink
              to="/asset"
              class="nav-link fw-bold text-secondary"
              active-class="active"
              exact-active-class="active"
              @click="closeNavbar"
            >
              자산
            </RouterLink>
          </li>
        </ul>
      </div>

      <!-- 오른쪽: 알림 + 마이페이지 -->
      <div class="d-flex align-items-center gap-3 ms-3">
        <Alarm class="mb-3" />
        <MyAccount class="mb-3 mt-3" />
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import Alarm from './Alarm.vue';
import MyAccount from './MyAccount.vue';

// 열림/닫힘 상태
const isOpen = ref(false);

// 토글 버튼
function toggleNav() {
  isOpen.value = !isOpen.value;
}

// 메뉴 항목 클릭 시 닫기
function closeNavbar() {
  isOpen.value = false;
}
</script>

<style scoped>
.navbar {
  border-bottom: 2px solid #e0e0e0;
}
.nav-link.active {
  font-weight: bold;
  color: #ffd95a !important;
  border-bottom: 2px solid #ffd95a;
}
</style>
