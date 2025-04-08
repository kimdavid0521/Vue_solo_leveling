<!-- 수정사항
    1. 알림 데이터 추가
    2. 월 소비금 계산 방식 변경

    알림 기능
    1. 월 소비금이 예산을 초과했을 때 알림 추가
    2. 카드 결제 예정일이 3일 남았을 때 알림 추가
-->
<template>
  <div class="container">
    <p>월 소비금: {{ monthConsumption.toLocaleString() }}원</p>
    <p>월 예산: {{ budget.toLocaleString() }}원</p>

    <div class="dropdown">
      <button class="btn position-relative" data-bs-toggle="dropdown">
        <i class="fa-solid fa-bell fs-4"></i>
        <span
          class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
          v-if="unreadCount > 0"
        >
          {{ unreadCount }}
        </span>
      </button>
      <ul class="dropdown-menu">
        <li
          v-for="(item, index) in alarm"
          :key="index"
          @click="markAsRead(index)"
        >
          <a
            class="dropdown-item"
            :class="{ 'text-muted': item.read }"
            href="#"
          >
            {{ item.message }}
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect } from 'vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();

// 월 소비금 (추후 변경 예정)
const monthConsumption = ref(13000000);
// 월 예산
const budget = ref(authStore.user?.setting?.budget ?? 0);

// 읽지 않은 알림 개수
const unreadCount = computed(
  () => alarm.value.filter((item) => !item.read).length
);
// 알림 읽음 처리
const markAsRead = (index) => {
  alarm.value[index].read = true;
};

// 알림 데이터
const alarm = ref([]);
// 월 소비금이 예산을 초과했을 때 알림 표시 여부
const hasBudgetAlarm = ref(false);

watchEffect(() => {
  // 월 소비금이 예산을 초과했을 때 알림 추가
  if (monthConsumption.value > budget.value && !hasBudgetAlarm.value) {
    alarm.value.push({
      message: '📢 월 소비금이 예산을 초과했습니다!',
      read: false,
    });
    hasBudgetAlarm.value = true;
  }
});
if (alarm.value.length === 0) {
  console.log('알림 없음');
}

// 카드 목록
const cardList = ref(authStore.user?.card ?? []); // 카드 배열
// 카드 결제 예정일 알림 표시 여부
const hasCardDueAlert = ref(false);

// 카드 결제 예정일 알림 추가
watchEffect(() => {
  if (hasCardDueAlert.value) return;

  const today = new Date();

  cardList.value.forEach((card) => {
    const due = new Date(card.dueDate);
    const diff = (due - today) / (1000 * 60 * 60 * 24);

    if (diff <= 3 && diff >= 0) {
      alarm.value.push({
        message: `💳 ${card.name} 결제일이 ${Math.ceil(diff)}일 남았습니다!`,
        read: false,
      });
      hasCardDueAlert.value = true;
    }
  });
});
</script>
