<template>
  <div class="container">
    <!-- 로그인 화면이 아닐 때만 Header 보이기 -->
    <Header v-if="route.path !== '/'" />

    <!-- 라우터에 의해 매칭되는 컴포넌트 표시 -->
    <RouterView />

    <!-- 로딩 화면은 필요 시 사용 -->
    <!-- <Loading v-if="isLoading" /> -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Loading from '@/components/Loading.vue';

const route = useRoute();
</script>
