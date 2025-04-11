<template>
  <div class="mypage-layout">
    <!-- 사이드바 -->
    <aside :class="['sidebar', { open: isSidebarOpen || isDesktop }]">
      <!-- 모바일용 닫기 버튼 (X) -->
      <button class="sidebar-close-btn d-lg-none" @click="closeSidebar">
        <i class="fa-solid fa-xmark"></i>
      </button>

      <!-- 로고 -->
      <div class="logo mb-4">
        <img src="@/assets/bankPoke.png" alt="BankPoke" class="logo-img" />
      </div>

      <!-- 프로필 드롭다운 -->
      <div class="profile-dropdown">
        <div class="dropdown-menu" v-if="isOpen">
          <div class="dropdown-item disabled">
            <i class="fa-regular fa-user me-2"></i
            >{{ authStore.user?.nickname }}
          </div>
          <div class="dropdown-item disabled">
            <i class="fa-regular fa-envelope me-2"></i
            >{{ authStore.user?.email }}
          </div>
          <hr />
          <div class="dropdown-item" @click="goTo('/mypage')">
            <i class="fa-solid fa-gear me-2"></i> 마이페이지
          </div>
          <div class="dropdown-item text-danger" @click="logout">
            <i class="fa-solid fa-right-from-bracket me-2"></i> 로그아웃
          </div>
        </div>
      </div>

      <!-- 메뉴 -->
      <ul class="nav flex-column mt-4">
        <li><h6 class="section-title">개인 설정</h6></li>
        <li class="nav-item" v-for="item in personalLinks" :key="item.to">
          <RouterLink :to="item.to" class="nav-link" @click="closeSidebar">
            {{ item.label }}
          </RouterLink>
        </li>

        <li><hr /></li>

        <li><h6 class="section-title">시스템 설정</h6></li>
        <li class="nav-item" v-for="item in systemLinks" :key="item.to">
          <RouterLink :to="item.to" class="nav-link" @click="closeSidebar">
            {{ item.label }}
          </RouterLink>
        </li>
      </ul>
    </aside>

    <!-- 모바일 전용 햄버거 버튼 (사이드바 열 때만 보임) -->
    <button
      class="sidebar-toggle d-lg-none"
      @click="toggleSidebar"
      v-if="!isSidebarOpen"
    >
      <i class="fa-solid fa-bars"></i>
    </button>

    <!-- 본문 -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const isSidebarOpen = ref(false);
const isDesktop = ref(window.innerWidth > 768);
const isOpen = ref(false); // 드롭다운 메뉴

const updateScreenSize = () => {
  isDesktop.value = window.innerWidth > 768;

  // 데스크탑에서는 강제로 사이드바 닫힘 상태 초기화
  if (isDesktop.value) {
    isSidebarOpen.value = false;
  }
};

onMounted(() => {
  window.addEventListener('resize', updateScreenSize);
  updateScreenSize();
});
onBeforeUnmount(() => {
  window.removeEventListener('resize', updateScreenSize);
});

const toggleSidebar = () => {
  isSidebarOpen.value = true;
};
const closeSidebar = () => {
  isSidebarOpen.value = false;
};

const goTo = (to) => {
  isOpen.value = false;
  closeSidebar();
  router.push(to);
};

const logout = () => {
  isOpen.value = false;
  closeSidebar();
  router.push('/');
};

const personalLinks = [
  { to: '/mypage/edit-profile', label: '회원정보 수정' },
  { to: '/mypage/budget', label: '예산 설정' },
  { to: '/mypage/income-category', label: '수입 분류 설정' },
  { to: '/mypage/expense-category', label: '지출 분류 설정' },
  { to: '/mypage/fixed-expense', label: '고정 지출 설정' },
];

const systemLinks = [
  { to: '/mypage/premium', label: '프리미엄 구독' },
  { to: '/mypage/cancle-account', label: '회원 탈퇴' },
];
</script>

<style scoped>
.mypage-layout {
  display: flex;
  min-height: 100vh;
}

/* 사이드바 */
.sidebar {
  position: relative;
  width: 260px;
  background-color: #ffffff;
  padding: 2rem 1rem;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
  align-items: start;
}

.sidebar-toggle {
  position: fixed;
  top: 50%;
  left: 1rem;
  z-index: 300;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #2b2b2b;
}

.sidebar-close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #2b2b2b;
  z-index: 300;
}

.logo-img {
  max-width: 150px;
}

.profile-dropdown {
  position: relative;
  align-self: center;
}

.dropdown-menu {
  position: absolute;
  top: 120%;
  left: 0;
  min-width: 220px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 0.5rem 0;
  z-index: 100;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #fff7db;
}

.dropdown-item.disabled {
  color: #999;
  cursor: default;
  font-weight: 500;
}

.dropdown-item.text-danger {
  color: #d9534f;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  margin-top: 1rem;
  color: #333;
}

.nav-link {
  font-size: 0.9rem;
  color: #555;
  padding: 0.5rem 0.8rem;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.nav-link:hover {
  background-color: #ffd95a44;
  color: #000;
}

.content {
  flex-grow: 1;
  padding: 3rem;
  background-color: #fff;
}

/* 모바일 전용 슬라이드 처리 */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -260px;
    top: 0;
    height: 100%;
    z-index: 200;
    transition: left 0.3s ease;
  }

  .sidebar.open {
    left: 0;
  }

  .content {
    padding: 1.5rem;
  }
}
</style>
