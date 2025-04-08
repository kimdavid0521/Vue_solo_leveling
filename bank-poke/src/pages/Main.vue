<template>
  <div>
    <Alarm />
    <div>
      <h1>메인페이지입니다</h1>
      <p>로그인한 유저: {{ authStore.user?.id }}</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import Alarm from '@/components/Alarm.vue';

// 로그인한 유저 정보 가져오기
const authStore = useAuthStore();
</script>
