<template>
  <div class="container me-5 p-5 m-lg-">
    <!-- 총합 -->
    <div class="row mb-4">
      <div class="col mb-1">
        <div class="card shadow-sm p-3 hover-lift">
          <h5 class="card-title section-title text-nowrap">총 자산</h5>

          <p :class="getAmountClass(+1)">
            {{ totalAsset.toLocaleString() }} 원
          </p>
        </div>
      </div>
      <div class="col">
        <div class="card shadow-sm p-3 hover-lift">
          <h5 class="card-title section-title text-nowrap">총 부채</h5>
          <p :class="getAmountClass(-1)">{{ totalDebt.toLocaleString() }} 원</p>
        </div>
      </div>
      <div class="col">
        <div class="card shadow-sm p-3 hover-lift">
          <h5 class="card-title section-title text-nowrap">순자산</h5>
          <p :class="getAmountClass(netAsset)">
            {{ netAsset.toLocaleString() }} 원
          </p>
        </div>
      </div>
    </div>

    <!-- 자산 상세 목록 -->
    <div class="row">
      <!-- 현금 -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card shadow-sm p-3 hover-lift">
          <h5 class="section-title text-nowrap">현금</h5>
          <p :class="getAmountClass(cashValue)">
            {{ cashValue.toLocaleString() }} 원
          </p>
        </div>
      </div>

      <!-- 계좌 -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card shadow-sm p-3 hover-lift">
          <h5 class="section-title text-nowrap">계좌</h5>
          <ul class="list-group list-group-flush">
            <li
              v-if="accountAssets.length === 0"
              class="list-group-item text-muted"
            >
              계좌 없음
            </li>
            <li
              v-for="acc in accountAssets"
              :key="acc.assetId"
              class="list-group-item d-flex justify-content-between"
            >
              {{ acc.name }}
              <span :class="getAmountClass(acc.value)">
                {{ acc.value.toLocaleString() }} 원
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 기타 자산 -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card shadow-sm p-3 hover-lift">
          <div>
            <span><h5 class="section-title text-nowrap">기타 자산</h5></span>
            <span class="text-muted small"
              >현금/카드/계좌 제외한 기타 자산</span
            >
          </div>
          <ul class="list-group list-group-flush">
            <li
              v-if="otherAssets.length === 0"
              class="list-group-item text-muted"
            >
              기타 자산 없음
            </li>
            <li
              v-for="asset in otherAssets"
              :key="asset.assetId"
              class="list-group-item d-flex justify-content-between"
            >
              {{ asset.name }}
              <span :class="getAmountClass(asset.value)">
                {{ asset.value.toLocaleString() }} 원
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 체크카드 사용액 (현재 월) -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card shadow-sm p-3 hover-lift">
          <div>
            <span
              ><h5 class="section-title">체크카드 총 사용 (이번 달)</h5></span
            >
            <span class="text-muted small">계좌/미분류에 반영됨</span>
          </div>

          <ul class="list-group list-group-flush">
            <li
              v-if="checkCardUsage.length === 0"
              class="list-group-item text-muted"
            >
              체크카드 없음
            </li>
            <li
              v-for="card in checkCardUsage"
              :key="card.assetId"
              class="list-group-item d-flex justify-content-between"
            >
              {{ card.name }}
              <span :class="card.value">
                {{ card.value.toLocaleString() }} 원
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 신용카드 부채 -->
      <div class="col-12 col-md-6 mb-4">
        <div class="card shadow-sm p-3 hover-lift">
          <h5 class="section-title">신용카드 납부 예정</h5>
          <ul class="list-group list-group-flush">
            <li
              v-if="creditCardDebts.length === 0"
              class="list-group-item text-muted"
            >
              신용카드 없음
            </li>
            <li
              v-for="card in creditCardDebts"
              :key="card.id"
              class="list-group-item d-flex justify-content-between"
            >
              {{ card.name }}
              <small class="text-muted ms-2"> 결제일 - {{ card.day }}일 </small>

              <span :class="getAmountClass(card.value)">
                {{ card.value.toLocaleString() }} 원
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- 미분류 거래 -->
      <div class="col-12 mt-4">
        <div class="card shadow-sm p-3 hover-lift">
          <h5 class="section-title">미분류 거래 내역</h5>
          <ul class="list-group list-group-flush">
            <li
              v-if="uncategorizedTransactions.length === 0"
              class="list-group-item text-muted"
            >
              미분류 거래 없음
            </li>
            <li
              v-for="tx in uncategorizedTransactions"
              :key="tx.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <span
                  >{{ tx.date }} - {{ tx.name || '이름 없음' }} :
                  {{ tx.memo || '메모 없음' }}</span
                >
                <small
                  v-if="tx.asset_type === 'card' && tx.assetId === null"
                  class="text-muted ms-2"
                >
                  (계좌 없는 카드)
                </small>
              </div>
              <span :class="getAmountClass(calcAmount(tx))">
                {{ calcAmount(tx).toLocaleString() }} 원
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAssetStore } from '@/stores/assetStore.js';
import { useAuthStore } from '@/stores/auth';

const store = useAssetStore();
const auth = useAuthStore();
const userId = computed(() => auth.user?.id);

// 사용자 데이터 불러오기
onMounted(() => {
  store.fetchUsers();
});

// 현재 사용자 정보
const user = computed(
  () => store.users.find((u) => u.id == userId.value) || null
);

// 거래 금액 계산 (수입: +, 지출: -)
const calcAmount = (tx) => {
  if (tx.type === 'income') return tx.amount || 0;
  if (tx.type === 'expense') return -(tx.amount || 0);
  return tx.amount || 0;
};

// 조건에 맞는 거래 총합 계산
const getTransactionSum = ({ filterFn = () => true } = {}) => {
  return (user.value?.transactions || [])
    .filter((tx) => tx.addTotal !== false)
    .filter(filterFn)
    .reduce((sum, tx) => sum + calcAmount(tx), 0);
};

// 계좌 ID와 체크카드 여부에 따른 카드 거래 총합
const getCardTransactionSumByAccountId = (accountId, isCheck) => {
  const today = new Date();
  const cards =
    user.value?.asset_group?.card?.filter((c) => c.isCheck === isCheck) || [];
  const cardIds = cards.map((c) => String(c.id));

  return getTransactionSum({
    filterFn: (tx) => {
      const card = cards.find((c) => String(c.id) === String(tx.assetId));
      if (
        tx.asset_type !== 'card' ||
        !card ||
        String(card.account_id) !== String(accountId)
      ) {
        return false;
      }

      const txDate = new Date(tx.date);

      // (1) 미래 거래는 제외
      if (txDate > today) {
        return false;
      }

      if (!isCheck) {
        const dueDay = parseInt(card.dueDate.split('-')[2], 10);

        // (2) tx.date 기준 결제일 계산
        const txDueDate =
          txDate.getDate() < dueDay
            ? new Date(txDate.getFullYear(), txDate.getMonth(), dueDay)
            : new Date(txDate.getFullYear(), txDate.getMonth() + 1, dueDay);

        // (3) 결제일이 오늘보다 크면 반영하지 않음
        if (txDueDate > today) {
          return false;
        }
      }

      return true;
    },
  });
};

// 현금 잔액 계산 -> 거래 내역
const cashValue = computed(() => {
  const base = user.value?.asset_group?.cash?.balance || 0;
  const sum = getTransactionSum({ filterFn: (tx) => tx.asset_type === 'cash' });
  return base + sum;
});

// 계좌 자산 목록 계산 (계좌 잔액 + 연결된 카드 거래 내역)
const accountAssets = computed(() =>
  (user.value?.asset_group?.account || []).map((acc) => {
    const base = acc.balance || 0;
    const accountList = getTransactionSum({
      filterFn: (tx) => tx.asset_type === 'account' && tx.assetId === acc.id,
    });
    const checkCard = getCardTransactionSumByAccountId(acc.id, true);
    const creditCard = getCardTransactionSumByAccountId(acc.id, false);
    return {
      assetId: acc.id,
      name: acc.name || '이름 없음',
      value: base + checkCard + creditCard + accountList,
    };
  })
);

// 기타 자산 목록 계산
const otherAssets = computed(() =>
  (user.value?.asset_group?.etc || []).map((item) => {
    const sum = getTransactionSum({
      filterFn: (tx) => tx.asset_type === 'etc' && tx.assetId === item.id,
    });
    return {
      assetId: item.id,
      name: item.name || '이름 없음',
      value: (item.balance || 0) + sum,
    };
  })
);

// 카드 ID로 체크카드 여부 확인
const isCheckCard = (cardId) =>
  user.value?.asset_group?.card?.find((c) => String(c.id) == String(cardId))
    ?.isCheck ?? true;

// 이번 달 체크카드 사용 내역
const thisMonthCheckCardUsage = computed(() => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const usageByCard = {};

  (user.value?.transactions || []).forEach((tx) => {
    if (
      tx.addTotal !== false &&
      tx.asset_type === 'card' &&
      isCheckCard(tx.assetId) &&
      new Date(tx.date) >= start &&
      new Date(tx.date) <= today
    ) {
      usageByCard[tx.assetId] = (usageByCard[tx.assetId] || 0) + calcAmount(tx);
    }
  });

  const cards = user.value?.asset_group?.card?.filter((c) => c.isCheck) || [];
  return cards.map((card) => ({
    assetId: card.id,
    name: card.name,
    value: usageByCard[card.id] || 0,
  }));
});

// 신용카드 미결제 금액 계산
const creditCardDebts = computed(() => {
  const today = new Date();
  const cards =
    user.value?.asset_group?.card?.filter((c) => c.isCheck === false) || [];
  let day = 0;
  return cards.map((card) => {
    day = Number(card.dueDate?.split('-')[2]) || 1;
    const dueDay = day;
    const prevDue = new Date(today);
    if (today.getDate() < dueDay) prevDue.setMonth(prevDue.getMonth() - 1);
    prevDue.setDate(dueDay);
    const startDate = new Date(prevDue);
    startDate.setDate(startDate.getDate() + 1);

    const value = getTransactionSum({
      filterFn: (tx) =>
        tx.addTotal !== false &&
        tx.asset_type === 'card' &&
        String(tx.assetId) === String(card.id) &&
        new Date(tx.date) >= startDate &&
        new Date(tx.date) <= today,
    });

    return { assetId: card.id, name: card.name || '이름 없음', value, day };
  });
});

// 분류되지 않은 거래 내역 + 계좌 연동 안된 카드
const uncategorizedTransactions = computed(() =>
  (user.value?.transactions || []).filter(
    (tx) =>
      tx.addTotal !== false &&
      (!tx.asset_type || (tx.asset_type === 'card' && tx.assetId === null))
  )
);

// 총 자산 (양수 자산만 포함)
const totalAsset = computed(() =>
  [
    cashValue.value,
    ...accountAssets.value.map((a) => a.value),
    ...otherAssets.value.map((a) => a.value),
  ]
    .filter((v) => v >= 0)
    .reduce((sum, v) => sum + v, 0)
);

// 총 부채 (음수 자산, 신용카드 미결제, 미분류 지출 등 포함)
const totalDebt = computed(() => {
  const liabilities = [
    ...(cashValue.value < 0 ? [cashValue.value] : []),
    ...creditCardDebts.value.map((c) => c.value),
    ...accountAssets.value.map((a) => a.value).filter((v) => v < 0),
    ...otherAssets.value.map((a) => a.value).filter((v) => v < 0),
    ...uncategorizedTransactions.value
      .map((tx) => calcAmount(tx))
      .filter((v) => v < 0),
  ];
  return liabilities.reduce((sum, v) => sum + v, 0);
});

// 순자산 = 총자산 + 총부채
const netAsset = computed(() => totalAsset.value + totalDebt.value);

// 금액 표시용 클래스 설정
const getAmountClass = (amount) =>
  amount >= 0 ? 'text-primary fw-bold' : 'text-danger fw-bold';

// 체크카드 사용 내역 (이번 달)
const checkCardUsage = thisMonthCheckCardUsage;
</script>

<style scoped>
.section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #2b2b2b;
  margin-bottom: 1rem;
  border-left: 5px solid #ffd95a;
  padding-left: 0.75rem;
}
.hover-lift {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}
</style>
