<template>
  <div>
    <Alarm />
    <TimeOut />
    <MyAccount />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import Alarm from '@/components/Alarm.vue';
import TimeOut from '@/components/TimeOut.vue';
import MyAccount from '@/components/MyAccount.vue';

// 로그인한 유저 정보 가져오기
const authStore = useAuthStore();
</script>
