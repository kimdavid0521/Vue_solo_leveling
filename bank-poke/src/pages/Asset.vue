
<template>
  <div class="container py-3">
    <RetrieveAsset />
    <div class="position-fixed bottom-0 end-0 m-4">
      <MinusAsset /> <AddAsset />
    </div>
  </div>
</template>

<script setup>
import RetrieveAsset from '@/components/RetrieveAsset.vue';
import MinusAsset from '@/components/MinusAsset.vue';
import AddAsset from '@/components/AddAsset.vue';
</script>

<style scoped>
.container {
  position: relative;
}
</style>

