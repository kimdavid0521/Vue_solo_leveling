<template>
  <h5 class="my-3">거래 내역</h5>
  <!-- 거래 내역 헤더: 년월 이동 pagination + '이번달' 버튼 + 검색 버튼 -->
  <div class="d-flex justify-content-between mb-3">
    <div class="d-flex">
      <!-- 년월 이동 pagination -->
      <ul class="pagination pagination-sm mb-0 me-2 custom-pagination">
        <li class="page-item" @click="shiftYear(-1)">
          <a class="page-link" href="#"
            ><i class="fa-solid fa-angles-left"></i
          ></a>
        </li>
        <li class="page-item" @click="shiftMonth(-1)">
          <a class="page-link" href="#"
            ><i class="fa-solid fa-angle-left"></i
          ></a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">{{ formattedDate }}</a>
        </li>
        <li class="page-item" @click="shiftMonth(1)">
          <a class="page-link" href="#"
            ><i class="fa-solid fa-angle-right"></i
          ></a>
        </li>
        <li class="page-item" @click="shiftYear(1)">
          <a class="page-link" href="#"
            ><i class="fa-solid fa-angles-right"></i
          ></a>
        </li>
      </ul>
      <!-- '이번달' 버튼 -->
      <button class="btn btn-sm rounded-3 custom-btn" @click="goToNow">
        이번달
      </button>
    </div>
    <!-- 검색 버튼 -->
    <button class="btn btn-sm rounded-circle custom-btn">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </div>
  <!-- 거래 내역 테이블 -->
  <TableLayout :tabs="tabs">
    <template v-slot:default="slotProps">
      <table class="table table-hover mb-0">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>날짜</th>
            <th>자산</th>
            <th>분류</th>
            <th>내용</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody
          v-if="
            state.user && transactionsByType(slotProps.currentTab).length > 0
          "
        >
          <tr
            v-for="tr in transactionsByType(slotProps.currentTab)"
            :key="tr.id"
            @click=""
          >
            <td>
              <input type="checkbox" :value="tr.id" />
            </td>
            <td>{{ tr.date }}</td>
            <td>{{ asset(tr.asset_type, tr.assetId) }}</td>
            <td>{{ tr.category }}</td>
            <td>{{ tr.name }}</td>
            <td>{{ tr.amount }}원</td>
          </tr>
        </tbody>
        <tbody v-else>
          <tr>
            <td colspan="6" class="text-center">데이터가 없습니다.</td>
          </tr>
        </tbody>
      </table>
    </template>
  </TableLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/auth.js';
import TableLayout from '@/components/TableLayout.vue';

const { state } = useAuthStore();
const user = computed(() => state.user);

// 탭 데이터
const tabs = computed(() => [
  {
    name: '전체',
    count: transactionsByPeriod.value.length,
    amount: transactionsByPeriod.value.reduce((sum, t) => sum + t.amount, 0),
  },
  {
    name: '수입',
    count: transactionsByType('수입').length,
    amount: transactionsByType('수입').reduce((sum, t) => sum + t.amount, 0),
  },
  {
    name: '지출',
    count: transactionsByType('지출').length,
    amount: transactionsByType('지출').reduce((sum, t) => sum + t.amount, 0),
  },
]);

// 어떤 자산인지 계산하여 반환
const asset = computed(() => {
  return (type, id) => {
    if (type === 'card') {
      const card = user.value.asset_group.card.find((c) => c.id === id);
      return card ? (card.isCheck ? '체크카드' : '신용카드') : '';
    } else if (type === 'cash') {
      return '현금';
    } else if (type === 'account') {
      const account = user.value.asset_group.account.find((a) => a.id === id);
      return account ? account.name : '';
    } else if (type === 'etc') {
      const assetEtc = user.value.asset_group.etc.find((i) => i.id === id);
      return assetEtc ? assetEtc.name : '';
    }
    return '기타';
  };
});

// 현재 표시되는(선택한) 날짜
const currentDate = ref(new Date());

// YYYY-MM 형식으로 포맷
const formattedDate = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});

const shiftMonth = (direction) => {
  currentDate.value.setMonth(currentDate.value.getMonth() + direction);
  currentDate.value = new Date(currentDate.value);
};

const shiftYear = (direction) => {
  currentDate.value.setFullYear(currentDate.value.getFullYear() + direction);
  currentDate.value = new Date(currentDate.value);
};

const goToNow = () => {
  currentDate.value = new Date();
};

// 년월별로 필터링된 거래 내역
const transactionsByPeriod = computed(() => {
  if (!state.user || !state.user.transactions) return [];

  const currentYear = currentDate.value.getFullYear();
  const currentMonth = currentDate.value.getMonth() + 1;

  return state.user.transactions.filter((ts) => {
    const [year, month] = ts.date.split('-').map(Number); // 현재 yyyy-mm-dd 형식으로 계산
    return year === currentYear && month === currentMonth;
  });
});

// 수입/지출별로 필터링된 거래 내역
const transactionsByType = (type) => {
  if (type === '수입') {
    return transactionsByPeriod.value.filter((t) => t.type === 'income');
  } else if (type === '지출') {
    return transactionsByPeriod.value.filter((t) => t.type === 'expense');
  }
  return transactionsByPeriod.value;
};
</script>

<style scoped>
/* pagination 스타일 조정 */
.custom-pagination .page-link {
  color: #333;
  border: 1px solid #6c757d;
  padding: 5px 10px;
  font-size: 0.9rem;
}
.page-item:first-child .page-link {
  border-radius: 0.5rem 0 0 0.5rem;
}
.page-item:last-child .page-link {
  border-radius: 0 0.5rem 0.5rem 0;
}
/* 버튼 스타일 조정 */
.custom-btn {
  border: 1px solid #6c757d;
}
.custom-btn:hover {
  background-color: #f1f1f1;
}
</style>
