<template>
  <div class="container border rounded-3 overflow-hidden p-0">
    <ul class="nav nav-tabs nav-justified">
      <!-- 각 탭 추가 -->
      <li
        class="nav-item"
        :class="currentTab !== tab.name ? 'bgColorSky shadow-sm' : ''"
        v-for="tab in tabs"
        :key="tab.label"
        @click="updateTab(tab.name)"
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
    <slot></slot>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const currentTab = ref('전체');
const emit = defineEmits(['update-tab']);

defineProps({
  tabs: Array,
});

// 현재 클릭된 탭 이름 부모로 전달
const updateTab = (current) => {
  currentTab.value = current;
  emit('update-tab', current);
};
</script>
<style scoped>
.nav-link {
  color: black;
}
.textBlue {
  color: #007bff;
}
.textRed {
  color: #ff4e50;
}
.bgColorSky {
  background-color: #edf2fa;
}
.bgColorSky > a:hover {
  background-color: #d9e7fd;
}
</style>
