<!-- 수정사항
    1. 알림 데이터 추가
    2. 월 소비금 계산 방식 변경

    알림 기능
    1. 월 소비금이 예산을 초과했을 때 알림 추가
    2. 카드 결제 예정일이 3일 남았을 때 알림 추가
    3. 고정지출이 3일 남았을 때 알림 추가
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
          v-for="item in unreadAlarms"
          :key="item.index"
          @click="markAsRead(item.index)"
        >
          <a class="dropdown-item" href="#">{{ item.message }}</a>
        </li>
        <li v-if="unreadAlarms.length === 0" class="dropdown-item text-muted">
          읽지 않은 알림이 없습니다
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
const monthConsumption = ref(900000);
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

// 읽지 않은 알림 목록
const unreadAlarms = computed(() =>
  alarm.value
    .map((item, i) => ({ ...item, index: i })) // index 유지
    .filter((item) => !item.read)
);

// 알림 데이터
const alarm = ref([]);
// 월 소비금이 예산을 초과했을 때 알림 표시 여부
const hasBudgetAlarm = ref(false);
// 월 소비금이 예산을 90% 초과했을 때 알림 표시 여부
const hasBudget90Alert = ref(false);

// 월 소비금이 예산 알림 추가
watchEffect(() => {
  const consumption = monthConsumption.value;
  const totalBudget = budget.value;

  if (totalBudget <= 0) return; // 예산이 없으면 계산 안 함

  const ratio = consumption / totalBudget;

  // 1. 90% 초과 알림
  if (ratio >= 0.9 && !hasBudget90Alert.value) {
    alarm.value.push({
      message: '⚠ 예산의 90%를 사용했습니다!',
      read: false,
    });
    hasBudget90Alert.value = true;
  }

  // 2. 100% 초과 알림
  if (consumption > totalBudget && !hasBudgetAlarm.value) {
    alarm.value.push({
      message: '📢 월 소비금이 예산을 초과했습니다!',
      read: false,
    });
    hasBudgetAlarm.value = true;
  }
});

// 카드 목록
const cardList = ref(authStore.user?.card ?? []);
// 카드 결제 예정일 알림 표시 여부
const hasCardDueAlert = ref(false);

// 카드 결제 예정일 알림 추가
watchEffect(() => {
  if (hasCardDueAlert.value) return;

  const today = new Date();

  cardList.value.forEach((card) => {
    const due = new Date(card.dueDate);
    const diff = (due - today) / (1000 * 60 * 60 * 24);

    if (diff <= 3 && diff >= 0 && !hasCardDueAlert.value) {
      alarm.value.push({
        message: `💳 ${card.name} 결제일이 ${Math.ceil(diff)}일 남았습니다!`,
        read: false,
      });
      hasCardDueAlert.value = true;
    }
  });
});

// 고정지출 목록
const fixedCostList = computed(() => authStore.user?.fixCost ?? []);
const fixCostAlertSet = ref(new Set()); // ✅ 중요

watchEffect(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 시간을 00:00:00으로 설정

  fixedCostList.value.forEach((item) => {
    if (!item.startDate) return;
    const end = new Date(item.endDate);
    end.setHours(0, 0, 0, 0);
    const diff = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

    if (diff <= 3 && diff >= 0 && !fixCostAlertSet.value.has(item.name)) {
      alarm.value.push({
        message: `🏠 고정지출(${item.name})이 곧 출금됩니다!`,
        read: false,
      });
      fixCostAlertSet.value.add(item.name);
    }
  });
});
</script>
