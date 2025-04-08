<template>
  <div class="container mt-4">
    <!-- 드롭다운 -->
    <div class="dropdown d-inline">
      <button
        type="button"
        class="btn btn-primary dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        <!-- 로그인 상태 -->
        <i class="fa-regular fa-circle-user"></i>
      </button>
      <ul class="dropdown-menu">
        <!-- 닉네임 -->
        <li>
          <span
            class="dropdown-item d-flex justify-content-between align-items-center disabled"
          >
            <span>
              <i class="fa-regular fa-user me-2"> </i>
            </span>
            <span>
              {{ authStore.user?.nickname }}
            </span>
          </span>
        </li>
        <!-- 이메일 -->
        <li>
          <span
            class="dropdown-item d-flex justify-content-between align-items-center disabled"
          >
            <span> <i class="fa-regular fa-envelope"> </i> </span>
            <span>
              {{ authStore.user?.email }}
            </span>
          </span>
        </li>
        <!-- 구독하기 -->
        <li>
          <span
            class="dropdown-item d-flex justify-content-between align-items-center"
          >
            <span><i class="fa-brands fa-web-awesome"> </i> </span>
            <span> 구독하기 </span>
          </span>
        </li>
        <!-- 마이페이지 -->
        <li>
          <a
            class="dropdown-item d-flex justify-content-between align-items-center"
            href="#"
            @click.prevent="myPage"
          >
            <i class="fa-brands fa-microsoft"></i>
            <span>마이페이지</span>
          </a>
        </li>
        <li><hr class="dropdown-divider" /></li>
        <!-- 로그아웃 -->
        <li>
          <a
            class="dropdown-item d-flex justify-content-between align-items-center text-danger"
            href="#"
            @click.prevent="logout"
          >
            <i class="fa-solid fa-right-from-bracket"></i>
            <span>로그아웃</span>
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';
const authStore = useAuthStore();
const router = useRouter();
// 로그아웃
const logout = () => {
  router.push('/');
};

const myPage = () => {
  router.push('/mypage');
};
</script>

<style>
.dropdown-item {
  width: 250px;
}
.dropdown-toggle {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
  color: #000;
}
.dropdown-toggle:hover,
.dropdown-toggle:focus,
.dropdown-toggle:active,
.dropdown-toggle.show {
  background-color: transparent !important;
  box-shadow: none !important;
  color: #000;
}
</style>
