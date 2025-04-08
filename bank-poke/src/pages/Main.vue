<template>
  <div>
    <a href="#" @click.prevent="goToMypage">마이페이지</a>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const goToMypage = () => {
  router.push('/mypage');
};
</script>
