<template>
  <div class="sidebar-profile" ref="dropdownRef">
    <!-- 프로필 아이콘 버튼 -->
    <button class="profile-toggle" @click="isOpen = !isOpen">
      <i class="fa-regular fa-circle-user"></i>
    </button>

    <!-- 사용자 드롭다운 메뉴 -->
    <div class="profile-dropdown" v-if="isOpen">
      <!-- 사용자 정보 -->
      <div class="dropdown-item disabled">
        <i class="fa-regular fa-user me-2"></i>
        <span>{{ authStore.user?.nickname }}</span>
      </div>
      <div class="dropdown-item disabled">
        <i class="fa-regular fa-envelope me-2"></i>
        <span>{{ authStore.user?.email }}</span>
      </div>

      <hr />

      <!-- 구독 -->
      <div class="dropdown-item" @click="goSubscribe">
        <i class="fa-brands fa-web-awesome me-2"></i>
        <span>구독하기</span>
      </div>

      <!-- 마이페이지 -->
      <div class="dropdown-item" @click="goMypage">
        <i class="fa-solid fa-user-gear me-2"></i>
        <span>마이페이지</span>
      </div>

      <hr />

      <!-- 로그아웃 -->
      <div class="dropdown-item text-danger" @click="logout">
        <i class="fa-solid fa-right-from-bracket me-2"></i>
        <span>로그아웃</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const isOpen = ref(false);
const authStore = useAuthStore();
const router = useRouter();

const goMypage = () => {
  isOpen.value = false;
  router.push('/mypage');
};

const goSubscribe = () => {
  isOpen.value = false;
  router.push('/mypage/premium');
};

const logout = () => {
  isOpen.value = false;
  router.push('/');
};

const dropdownRef = ref(null);
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
function handleClickOutside(e) {
  // dropdownRef 내부를 클릭했다면 무시
  if (dropdownRef.value?.contains(e.target)) return;

  // 바깥을 클릭했으면 드롭다운 닫기
  isOpen.value = false;
}
</script>

<style scoped>
.sidebar-profile {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1rem;
}

/* 프로필 아이콘 버튼 */
.profile-toggle {
  font-size: 2rem;
  border: none;
  background-color: transparent;
  color: #2b2b2b;
  cursor: pointer;
  transition: color 0.2s ease;
}

.profile-toggle:hover {
  color: #ffc436;
}

/* 드롭다운 메뉴 */
.profile-dropdown {
  position: absolute;
  top: 120%; /* 버튼 아래로 떨어지게 */
  left: 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 0.5rem 0;
  min-width: 220px;
  z-index: 999;
}

/* 아이템 */
.dropdown-item {
  padding: 0.6rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-item:hover {
  background-color: #fff7db;
}

.dropdown-item.disabled {
  cursor: default;
  color: #999;
  font-weight: 500;
}

.dropdown-item.text-danger {
  color: #d9534f;
}

.dropdown-item.text-danger:hover {
  background-color: #ffe6e6;
}
</style>
