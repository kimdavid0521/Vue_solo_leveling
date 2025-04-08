<template>
  <div>
    <h1>알림</h1>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const alarm = ref([]);

const getAlarm = async () => {
  const response = await fetch('/api/users/');
  const data = await response.json();
  alarm.value = data;
};
</script>

<style scoped></style>
