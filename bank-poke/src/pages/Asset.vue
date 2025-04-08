<template>
  <div class="container py-3">
    <RetrieveAsset />
    <AddAsset />
  </div>
</template>

<script setup>
import RetrieveAsset from '@/components/RetrieveAsset.vue';
import AddAsset from '@/components/AddAsset.vue';
</script>

<style scoped>
.container {
  position: relative;
}
</style>
