<template>
  <div class="d-flex" style="min-height: 100vh">
    <!-- 사이드바 -->
    <aside class="bg-light px-4 py-5" style="width: 250px">
      <h5 class="text-primary fw-bold mb-4">로고</h5>
      <ul class="nav flex-column">
        <li>
          <h5 class="text-primary fw-bold mb-4 text-dark">개인 설정</h5>
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link fw-light text-dark"
            to="/mypage/edit-profile"
            >회원정보 수정</RouterLink
          >
        </li>

        <li class="nav-item">
          <RouterLink class="nav-link fw-light text-dark" to="/mypage/budget"
            >예산 설정</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link fw-light text-dark"
            to="/mypage/income-category"
            >수입 분류 설정</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link fw-light text-dark"
            to="/mypage/expense-category"
            >지출 분류 설정</RouterLink
          >
        </li>
        <li>
          <hr class="my-4" />
        </li>
        <li>
          <h5 class="text-primary fw-bold mb-4 text-dark">시스템 설정</h5>
        </li>
        <li class="nav-item">
          <RouterLink class="nav-link fw-light text-dark" to="/mypage/premium"
            >프리미엄 구독</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink
            class="nav-link fw-light text-dark"
            to="/mypage/cancle-account"
            >회원 탈퇴</RouterLink
          >
        </li>
      </ul>
    </aside>

    <!-- 본문 영역 -->
    <main class="flex-grow-1 p-5">
      <RouterView />
      <!-- 여기서 자식 페이지들이 바뀜 -->
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
const authStore = useAuthStore();
console.log(authStore.user);
</script>
