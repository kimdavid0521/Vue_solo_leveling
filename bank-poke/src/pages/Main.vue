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

const authStore = useAuthStore();
console.log('로그인한 유저 ID:', authStore.user?.id); // 콘솔 출력
</script>
