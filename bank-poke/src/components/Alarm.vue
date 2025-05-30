<template>
  <div class="container mt-2">
    <div class="alarm-wrapper position-relative" ref="dropdownRef">
      <!-- 토글 버튼 -->
      <button class="btn position-relative" @click="toggleDropdown">
        <i class="fa-solid fa-bell fs-4"></i>
        <!-- 알림 배지 -->
        <span
          class="badge bg-danger position-absolute top-0 start-100 translate-middle rounded-pill"
          v-if="unreadCount > 0"
        >
          {{ unreadCount }}
        </span>
      </button>

      <!-- 드롭다운 목록 (Vue 제어) -->
      <ul class="alarm-dropdown" v-if="isOpen">
        <!-- 읽지 않은 알림들 -->
        <li
          v-for="(item, index) in unreadAlarms"
          :key="item.index"
          @click="markAsRead(item.index)"
          class="dropdown-item"
        >
          {{ item.message }}
        </li>
        <!-- 알림 없을 때 -->
        <li v-if="unreadAlarms.length === 0" class="dropdown-item text-muted">
          읽지 않은 알림이 없습니다
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, onBeforeUnmount } from 'vue';
import { useAuthStore } from '@/stores/auth';

// 1. 상태 선언 정리
const authStore = useAuthStore();
const alarm = ref([]);
const monthConsumption = ref(0);
// 현재 월을 영어 약어 (Jan ~ Dec)로 가져오기
const monthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];
const currentMonth = monthNames[new Date().getMonth()];
const currentYearMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

// 예산 가져오기 (기본값 0)
const budget = ref(
  authStore.user?.setting?.[0]?.monthlyBudget?.[currentMonth] ?? 0
);

// 여기서 monthConsumption 계산 로직 추가
onMounted(() => {
  const transactions = authStore.user?.transactions ?? [];
  const expensesThisMonth = transactions.filter(
    (tx) => tx.type === 'expense' && tx.date?.startsWith(currentYearMonth)
  );
  monthConsumption.value = expensesThisMonth.reduce(
    (sum, tx) => sum + tx.amount,
    0
  );
});

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
const cardList = computed(() => authStore.user?.asset_group?.card ?? []);
console.log(cardList.value);
watchEffect(() => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // 자정으로 맞춰서 정확한 비교

  cardList.value
    .filter((card) => card.isCheck === false) // ✅ 체크 안 된 카드만
    .forEach((card) => {
      const dueDateStr = card.dueDate; // 또는 card.due_day로 계산해도 됨
      if (!dueDateStr) return;

      const dueDate = new Date(dueDateStr);
      dueDate.setHours(0, 0, 0, 0);

      const diff = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      const key = `card-${card.id}-${dueDateStr}`;

      if (diff <= 3 && diff >= 0 && !cardAlertKeys.value.has(key)) {
        alarm.value.push({
          message: `💳 ${card.name} 카드 결제일이 ${diff}일 남았습니다!`,
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
    if (item.type !== 'expense' || !item.date?.startDate || !item.interval)
      return;

    const nextDue = getNextDueDate(item.date?.startDate, item.interval);
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
// 드롭다운 열림 제어
const isOpen = ref(false);
function toggleDropdown() {
  isOpen.value = !isOpen.value;
}
const dropdownRef = ref(null);
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
function handleClickOutside(e) {
  // dropdownRef 내부를 클릭했다면 무시
  if (dropdownRef.value?.contains(e.target)) return;

  // 바깥을 클릭했으면 드롭다운 닫기
  isOpen.value = false;
}
</script>
<style scoped>
.alarm-wrapper {
  display: inline-block;
}

.alarm-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 6px;
  z-index: 999;
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
}

.dropdown-item {
  padding: 0.6rem 1rem;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-item:hover {
  background-color: #fff7db;
}

.text-muted {
  color: #999;
}
</style>
