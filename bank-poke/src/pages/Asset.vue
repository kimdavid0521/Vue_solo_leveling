<template>
  <div class="container-fluid px-4">
    <div class="container-wrapper mx-auto mt-3">
      <RetrieveAsset />
    </div>

    <!-- 버튼 위치: 화면 오른쪽 아래, 가운데 기준 약간 오른쪽 -->
    <div class="floating-buttons pe-5">
      <MinusAsset />
      <AddAsset />
      <UpdateAsset />
    </div>
  </div>
</template>

<script setup>
import RetrieveAsset from '@/components/RetrieveAsset.vue';
import MinusAsset from '@/components/MinusAsset.vue';
import AddAsset from '@/components/AddAsset.vue';
import UpdateAsset from '@/components/UpdateAsset.vue';
</script>

<style scoped>
.container-wrapper {
  max-width: 960px;
  position: relative;
}

/* 화면 비율에 맞춰 위치 */
.floating-buttons {
  position: fixed;
  bottom: 2rem;
  left: 80vw; /* 화면의 65% 지점에 고정 */
  transform: translateX(-50%); /* 가운데 정렬 보정 */
  display: flex;
  gap: 0.75rem;
  z-index: 1000;
}
</style>
