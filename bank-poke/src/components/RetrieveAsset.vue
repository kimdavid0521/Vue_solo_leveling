<template>
  <div class="card p-3 mb-3">
    <!-- 상단 요약: 자산, 부채, 순자산 -->
    <div class="row text-center mb-4">
      <div class="col">
        <div class="text-muted">자산</div>
        <div class="text-primary fw-bold">
          {{ totalAsset.toLocaleString() }}원
        </div>
      </div>
      <div class="col">
        <div class="text-muted">부채</div>
        <div class="text-danger fw-bold">
          {{ totalDebt.toLocaleString() }}원
        </div>
      </div>
      <div class="col">
        <div class="text-muted">합계</div>
        <div class="text-dark fw-bold">{{ netAsset.toLocaleString() }}원</div>
      </div>
    </div>

    <!-- 현금 내역 -->
    <div
      class="bg-light border-top border-bottom py-2 px-3 fw-bold text-secondary"
    >
      현금
    </div>
    <ul class="list-group mb-3">
      <li class="list-group-item d-flex justify-content-between">
        <span>현금</span>
        <span :class="getAmountClass(cashValue)">
          {{ cashValue.toLocaleString() }}원
        </span>
      </li>
    </ul>

    <!-- 카드/은행행 자산 -->
    <div
      class="bg-light border-top border-bottom py-2 px-3 fw-bold text-secondary"
    >
      카드/은행
    </div>

    <ul class="list-group">
      <li
        v-for="item in bankAssets"
        :key="item.assetId"
        class="list-group-item d-flex justify-content-between"
      >
        <span>{{ item.name }}</span>
        <span :class="getAmountClass(item.value)">
          {{ item.value.toLocaleString() }}원
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useMockUser } from '@/stores/mockUser';

const store = useMockUser();
const userId = 1;

// 사용자와 은행 목록을 최초 로딩
onMounted(async () => {
  await store.fetchUsers();
  await store.fetchBankList();
});

// 사용자 객체: 존재하지 않으면 null 반환
const user = computed(() => {
  return store.users.find((u) => u.id == userId) || null;
});

// 은행 리스트 (옵셔널 대응)
const bankList = computed(() => store.bank || []);

// 현금 계산
const cashValue = computed(() => {
  if (!user.value || !user.value.transactions) return 0;

  let cashIn = 0,
    cashOut = 0;

  user.value.transactions.forEach((tx) => {
    if (tx.assetId === null) {
      if (tx.type === 'income') cashIn += tx.amount;
      else if (tx.type === 'expense') cashOut += tx.amount;
    }
  });
  return cashIn - cashOut;
});

// 카드/은행 자산 계산
const bankAssets = computed(() => {
  if (!user.value) return [];

  const accounts = user.value.account || [];
  const cards = user.value.card || [];

  return accounts.map((acc) => {
    const card = cards.find((c) => c.id === acc.id);
    const minus = card ? card.minus_balance : 0;
    return {
      assetId: acc.id,
      name: card ? card.name : '이름 없음',
      value: acc.balance - minus,
    };
  });
});

// 총 자산
const totalAsset = computed(() => {
  const bank = bankAssets.value
    .filter((item) => item.value > 0)
    .reduce((sum, item) => sum + item.value, 0);

  return cashValue.value > 0 ? bank + cashValue.value : bank;
});

// 총 부채
const totalDebt = computed(() => {
  const bank = bankAssets.value
    .filter((item) => item.value < 0)
    .reduce((sum, item) => sum + Math.abs(item.value), 0);

  return cashValue.value < 0 ? bank + Math.abs(cashValue.value) : bank;
});

// 순자산
const netAsset = computed(() => totalAsset.value - totalDebt.value);

// 금액 스타일 클래스
const getAmountClass = (amount) => {
  if (amount > 0) return 'text-primary fw-bold';
  if (amount < 0) return 'text-danger fw-bold';
  return 'fw-bold';
};
</script>
