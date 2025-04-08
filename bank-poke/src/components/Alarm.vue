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

// 1. 상태 선언 정리
const authStore = useAuthStore();
const alarm = ref([]);
const monthConsumption = ref(100000);
const budget = ref(authStore.user?.setting?.budget ?? 0);

// 알림 관련 상태
const unreadCount = computed(
  () => alarm.value.filter((item) => !item.read).length
);
// 알림 목록 출력
const unreadAlarms = computed(() =>
  alarm.value
    .map((item, i) => ({ ...item, index: i }))
    .filter((item) => !item.read)
);

// 알림 읽음 처리
const markAsRead = (index) => {
  alarm.value[index].read = true;
};

// 내부 플래그 선언
const hasBudgetAlarm = ref(false);
const hasBudget90Alert = ref(false);
const cardAlertKeys = ref(new Set());
const fixCostAlertKeys = ref(new Set());

// 2. 예산 알림
watchEffect(() => {
  const consumption = monthConsumption.value;
  const totalBudget = budget.value;

  if (totalBudget <= 0) return;

  const ratio = consumption / totalBudget;

  if (ratio >= 0.9 && !hasBudget90Alert.value) {
    alarm.value.push({
      message: '⚠ 예산의 90%를 사용했습니다!',
      read: false,
    });
    hasBudget90Alert.value = true;
  }

  if (consumption > totalBudget && !hasBudgetAlarm.value) {
    alarm.value.push({
      message: '📢 월 소비금이 예산을 초과했습니다!',
      read: false,
    });
    hasBudgetAlarm.value = true;
  }
});

// 3. 카드 결제 예정일 알림
const cardList = ref(authStore.user?.card ?? []);

watchEffect(() => {
  const today = new Date();

  cardList.value.forEach((card) => {
    if (!card.dueDate) return;

    const due = new Date(card.dueDate);
    due.setHours(0, 0, 0, 0);
    const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    const key = `card-${card.name}-${card.dueDate}`;

    if (diff <= 3 && diff >= 0 && !cardAlertKeys.value.has(key)) {
      alarm.value.push({
        message: `💳 ${card.name} 결제일이 ${diff}일 남았습니다!`,
        read: false,
      });
      cardAlertKeys.value.add(key);
    }
  });
});

// 4. 고정지출 알림 
// 구간 계산 함수
const fixedCostList = computed(() => authStore.user?.fixCost ?? []);

function getNextDueDate(startDate, interval) {
  const now = new Date();
  const base = new Date(startDate);

  if (isNaN(base.getTime())) return null;

  while (base <= now) {
    switch (interval) {
      case 'daily':
        base.setDate(base.getDate() + 1);
        break;
      case 'weekly':
        base.setDate(base.getDate() + 7);
        break;
      case 'monthly':
        base.setMonth(base.getMonth() + 1);
        break;
      case 'yearly':
        base.setFullYear(base.getFullYear() + 1);
        break;
      default:
        return null;
    }
  }

  base.setHours(0, 0, 0, 0);
  return base;
}

// 고정지출 알림 처리
watchEffect(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  fixedCostList.value.forEach((item) => {
    if (item.type !== 'expense' || !item.startDate || !item.interval) return;

    const nextDue = getNextDueDate(item.startDate, item.interval);
    if (!nextDue) return;

    const diff = Math.ceil((nextDue - today) / (1000 * 60 * 60 * 24));
    const key = `fixcost-${item.name}-${nextDue.toISOString().slice(0, 10)}`;

    if (diff <= 3 && diff >= 0 && !fixCostAlertKeys.value.has(key)) {
      alarm.value.push({
        message: `🏠 고정지출(${item.name})이 ${diff}일 후 출금됩니다!`,
        read: false,
      });
      fixCostAlertKeys.value.add(key);
    }
  });
});
</script>
