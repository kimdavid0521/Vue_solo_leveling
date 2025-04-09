<template>
  <div class="container border rounded-3 overflow-hidden p-0">
    <ul class="nav nav-tabs nav-justified">
      <!-- 각 탭 추가 -->
      <li
        class="nav-item"
        v-for="tab in tabs"
        :key="tab.label"
        @click="currentTab = tab.name"
      >
        <a
          class="nav-link"
          :class="{ active: currentTab === tab.name }"
          href="#"
        >
          {{ tab.name }}
          <span
            class="badge rounded-pill"
            :class="currentTab === tab.name ? 'bg-primary' : 'bg-secondary'"
            >{{ tab.count }}</span
          >
          <div
            class="fw-bold"
            :class="{
              textBlue: tab.name === '수입',
              textRed: tab.name === '지출',
            }"
          >
            {{ tab.amount.toLocaleString() }}원
          </div>
        </a>
      </li>
    </ul>
    <slot :currentTab="currentTab"></slot>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const currentTab = ref('전체');

defineProps({
  tabs: Array,
});
</script>
<style scoped>
.nav-link {
  color: black;
}
.textBlue {
  color: #007bff;
}
.textRed {
  color: #dc3545;
}
</style>
