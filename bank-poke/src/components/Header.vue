<template>
  <nav
    class="navbar navbar-expand-lg navbar-light bg-white px-4 py-2 border-bottom"
  >
    <div
      class="container-fluid d-flex justify-content-between align-items-center"
    >
      <!-- 왼쪽: 로고 (pc 화면) -->
      <div class="d-flex align-items-center">
        <RouterLink
          to="/main"
          class="navbar-brand d-none d-lg-flex align-items-center fw-bold text-dark me-auto"
        >
          <img
            src="../assets/bankPoke.png"
            alt="logo"
            width="40"
            height="40"
            class="me-3"
          />
          <span class="fs-4 fw-bold">BankPoke</span>
        </RouterLink>
      </div>
      <!-- 왼쪽: 로고 (모바일 화면) -->
      <div class="d-flex align-items-center me-auto d-lg-none gap-3">
        <RouterLink
          to="/main"
          class="navbar-brand d-flex align-items-center fw-bold text-dark"
        >
          <img
            src="../assets/bankPoke.png"
            alt="logo"
            width="32"
            height="32"
            class="me-3"
          />
          <span class="fs-5 fw-bold">BankPoke</span>
        </RouterLink>
      </div>

      <!-- 가운데: 메뉴 항목 (PC 전용) -->
      <div class="d-mone d-lg-block">
        <ul class="navbar-nav flex-row justify-content-center d-none d-lg-flex">
          <li
            class="nav-item mx-3"
            v-for="(item, index) in menuItems"
            :key="index"
          >
            <!-- 분석 메뉴만 조건 분기 -->
            <template v-if="item.path === '/analyze'">
              <template v-if="authStore.user?.isPremium">
                <RouterLink
                  :to="item.path"
                  class="nav-link fw-bold text-secondary"
                  active-class="active"
                  exact-active-class="active"
                >
                  <i :class="[item.icon, 'me-1']"></i>
                  {{ item.label }}
                </RouterLink>
              </template>
              <template v-else>
                <span
                  class="nav-link text-muted d-flex fw-bold align-items-center"
                  style="cursor: not-allowed"
                >
                  <i class="fa-solid fa-lock me-1"></i>
                  {{ item.label }}
                </span>
              </template>
            </template>

            <!-- 나머지 메뉴 -->
            <template v-else>
              <RouterLink
                :to="item.path"
                class="nav-link fw-bold text-secondary"
                active-class="active"
                exact-active-class="active"
              >
                <i :class="[item.icon, 'me-1']"></i>
                {{ item.label }}
              </RouterLink>
            </template>
          </li>
        </ul>
      </div>

      <!-- 오른쪽: 알림 + 마이페이지 + 토글 -->
      <div class="d-flex align-items-center gap-3">
        <Alarm />
        <MyAccount class="mb-1 mt-1" />

        <!-- 토글 버튼 (모바일 전용) -->
        <button
          class="navbar-toggler d-lg-none"
          type="button"
          @click="toggleNav"
          :aria-expanded="isOpen"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>
    </div>
    <!-- 모바일 메뉴 토글 (모바일 전용) -->
    <div class="d-lg-none collapse navbar-collapse" :class="{ show: isOpen }">
      <ul class="navbar-nav text-center d-lg-none">
        <li
          class="nav-item my-2"
          v-for="(item, index) in menuItems"
          :key="'mobile-' + index"
        >
          <RouterLink
            :to="item.path"
            class="nav-link fw-bold text-secondary"
            active-class="active"
            exact-active-class="active"
            @click="closeNavbar"
          >
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { RouterLink } from 'vue-router';
import Alarm from './Alarm.vue';
import MyAccount from './MyAccount.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

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
const menuItems = [
  { path: '/main', label: '가계부', icon: 'fa-solid fa-calendar-days' },
  {
    path: '/transaction-list',
    label: '거래 내역',
    icon: 'fa-solid fa-receipt',
  },
  { path: '/analyze', label: '분석', icon: 'fa-solid fa-chart-line' },
  { path: '/asset', label: '자산', icon: 'fa-solid fa-wallet' },
];
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
.navbar-brand img {
  object-fit: contain;
}
.nav-link.text-muted {
  opacity: 0.6;
}
</style>
