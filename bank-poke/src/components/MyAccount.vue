<template>
  <div class="container mt-4">
    <!-- 드롭다운 -->
    <div class="dropdown d-inline">
      <button
        type="button"
        class="btn btn-primary dropdown-toggle"
        data-bs-toggle="dropdown"
        aria-expanded="false"
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
import { onMounted } from 'vue';
import { Dropdown } from 'bootstrap';

const authStore = useAuthStore();
const router = useRouter();

// 드롭다운 초기화
onMounted(() => {
  const dropdownElementList = document.querySelectorAll(
    '[data-bs-toggle="dropdown"]'
  );
  const dropdownList = [...dropdownElementList].map(
    (dropdownToggleEl) => new Dropdown(dropdownToggleEl)
  );
});

// 로그아웃
const logout = () => {
  router.push('/');
};

// 마이페이지 이동
const myPage = () => {
  router.push('/mypage');
};
</script>

<style>
/* 드롭다운 전체 너비 */
.dropdown-item {
  width: 250px;
  font-size: 0.95rem;
  color: #333;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #fff7db;
}

/* 비활성화된 항목 (닉네임, 이메일 등) */
.dropdown-item.disabled {
  opacity: 1;
  font-weight: 500;
  background-color: transparent;
  color: #999;
  cursor: default;
}

/* 드롭다운 토글 버튼 */
.dropdown-toggle {
  background-color: transparent;
  border: none;
  font-size: 1.6rem;
  color: #2b2b2b;
}

.dropdown-toggle:hover,
.dropdown-toggle:focus,
.dropdown-toggle:active,
.dropdown-toggle.show {
  background-color: #ffd95a !important;
  border-radius: 50%;
  box-shadow: none !important;
  color: #2b2b2b;
}

/* 드롭다운 메뉴 꾸미기 */
.dropdown-menu {
  padding: 0.5rem 0;
  border-radius: 10px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 구분선 */
.dropdown-divider {
  margin: 0.3rem 0;
  border-top: 1px solid #ddd;
}

/* 로그아웃 색상 강조 */
.dropdown-item.text-danger {
  color: #d9534f;
  font-weight: bold;
}

.dropdown-item.text-danger:hover {
  background-color: #ffe6e6;
}
</style>
