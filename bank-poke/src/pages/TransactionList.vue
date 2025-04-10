<template>
  <!-- <h5 class="my-3">거래 내역</h5> -->
  <!-- 거래 내역 헤더: 년월 이동 pagination + '이번달' 버튼 + 검색 버튼 -->
  <div class="d-flex justify-content-between mb-3 fixed-height">
    <div class="d-flex flex-nowrap me-2 gap-1">
      <!-- 년월 이동 pagination -->
      <ul class="pagination pagination-sm mb-0 custom-pagination">
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
        <li class="page-item text-nowrap">
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
      <button
        class="btn btn-sm rounded-3 text-nowrap custom-btn"
        @click="goToNow"
      >
        이번달
      </button>
    </div>
    <!-- 검색 박스 -->
    <div class="d-flex gap-1 me-2">
      <SearchBox
        v-if="isSearch"
        @update-money="moneyFilter"
        @update-content="contentFilter"
        @update-asset="assetFilter"
      >
      </SearchBox>
      <!-- 검색 버튼 -->
      <button
        class="btn btn-sm rounded-circle custom-btn"
        @click="switchSearch"
      >
        <i
          class="fa-solid"
          :class="isSearch ? 'fa-xmark' : 'fa-magnifying-glass'"
        ></i>
      </button>
    </div>
  </div>
  <!-- 거래 내역 테이블 -->
  <TableLayout :tabs="tabs" @update-tab="updateTab">
    <table class="table table-hover mb-0">
      <thead>
        <tr v-if="selectedTransactions.length === 0">
          <th>
            <input
              type="checkbox"
              :disabled="filteredTransactionsByType.length === 0"
              :checked="allSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th>날짜</th>
          <th>자산</th>
          <th>분류</th>
          <th>내용</th>
          <th>금액</th>
        </tr>
        <tr v-else class="custom-selected">
          <th>
            <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleSelectAll"
            />
          </th>
          <th colspan="4" class="text-white">
            {{ selectedTransactions.length }}건 선택
          </th>
          <th class="p-0 align-middle">
            <button
              class="btn btn-sm text-white"
              @click="deleteSelectedTransactions"
            >
              <i class="fa-solid fa-trash"></i>
            </button>
          </th>
        </tr>
      </thead>
      <tbody v-if="user && filteredTransactionsByType.length > 0">
        <tr
          v-for="tr in filteredTransactionsByType"
          :key="tr.id"
          :class="{ 'selected-row': selectedTransactions.includes(tr.id) }"
        >
          <td>
            <input
              type="checkbox"
              :value="tr.id"
              v-model="selectedTransactions"
            />
          </td>
          <td>{{ tr.date }}</td>
          <td>{{ asset(tr.asset_type, tr.assetId) }}</td>
          <td>{{ tr.category }}</td>
          <td>{{ tr.name }}</td>
          <td>{{ tr.amount.toLocaleString() }}원</td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td colspan="6" class="text-center">데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </TableLayout>
</template>

<script setup>
import { ref, computed, reactive } from "vue";
// import { useUserStore } from '@/stores/user.js';
import { useAuthStore } from "@/stores/auth.js";
import TableLayout from "@/components/TableLayout.vue";
import SearchBox from "@/components/SearchBox.vue";

// const { state, deleteTransactions } = useAuthStore();
const authStore = useAuthStore();
const user = computed(() => authStore.user);
console.log(user.value);

// 선택된 거래 내역 id 리스트
const selectedTransactions = ref([]);

// 검색 활성화관련 변수
const isSearch = ref(false);
// 현재 클릭된 탭 변수
const currentTab = ref("전체");

// 금액 범위
const moneyLimit = reactive({
  minMoney: null,
  maxMoney: null,
});

// 검색된 내용 문자열
const searchText = ref("");

// 선택된 자산 필터
const assetSelected = ref(null);

// 이벤트 발생마다 자식으로부터 데이터 받아옴
const updateTab = (current) => {
  currentTab.value = current;
  selectedTransactions.value = []; // 선택 초기화
};

// 이벤트 발생마다 자식으로부터 데이터 받아옴
const moneyFilter = ({ minMoney, maxMoney }) => {
  moneyLimit.minMoney = minMoney;
  moneyLimit.maxMoney = maxMoney;
  selectedTransactions.value = []; // 선택 초기화
};

// 이벤트 발생마다 자식으로부터 데이터 받아옴
const contentFilter = (content) => {
  searchText.value = content;
  selectedTransactions.value = []; // 선택 초기화
};

// 이벤트 발생마다 자식으로부터 데이터 받아옴
const assetFilter = (asset) => {
  assetSelected.value = asset;
  selectedTransactions.value = []; // 선택 초기화
};

// 탭 데이터
const tabs = computed(() => [
  {
    name: "전체",
    count: transactionsByType("전체").length,
    amount: transactionsByType("전체").reduce((sum, t) => sum + t.amount, 0),
  },
  {
    name: "수입",
    count: transactionsByType("수입").length,
    amount: transactionsByType("수입").reduce((sum, t) => sum + t.amount, 0),
  },
  {
    name: "지출",
    count: transactionsByType("지출").length,
    amount: transactionsByType("지출").reduce((sum, t) => sum + t.amount, 0),
  },
]);

// 어떤 자산인지 계산하여 반환
const asset = computed(() => {
  return (type, id) => {
    if (type === "card") {
      const card = user.value.asset_group.card.find((c) => c.id === id);
      return card ? (card.isCheck ? "체크카드" : "신용카드") : "";
    } else if (type === "cash") {
      return "현금";
    } else if (type === "account") {
      const account = user.value.asset_group.account.find((a) => a.id === id);
      return account ? account.name : "";
    } else if (type === "etc") {
      const assetEtc = user.value.asset_group.etc.find((i) => i.id === id);
      return assetEtc ? assetEtc.name : "";
    }
    return "기타";
  };
});

// 현재 표시되는(선택한) 날짜
const currentDate = ref(new Date());

// YYYY-MM 형식으로 포맷
const formattedDate = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = String(currentDate.value.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
});

const shiftMonth = (direction) => {
  currentDate.value.setMonth(currentDate.value.getMonth() + direction);
  currentDate.value = new Date(currentDate.value);
  selectedTransactions.value = []; // 선택 초기화
};

const shiftYear = (direction) => {
  currentDate.value.setFullYear(currentDate.value.getFullYear() + direction);
  currentDate.value = new Date(currentDate.value);
  selectedTransactions.value = []; // 선택 초기화
};

const goToNow = () => {
  currentDate.value = new Date();
  selectedTransactions.value = []; // 선택 초기화
};

// 필터링된 거래내역
const filteredTransactions = computed(() => {
  if (!user.value || !user.value.transactions) return [];

  const currentYear = currentDate.value.getFullYear();
  const currentMonth = currentDate.value.getMonth() + 1;

  return (
    user.value.transactions
      // 1. 년월 필터
      .filter((ts) => {
        const [year, month] = ts.date.split("-").map(Number); // 현재 yyyy-mm-dd 형식으로 계산
        return year === currentYear && month === currentMonth;
      })
      // 2. 금액 범위 필터
      .filter((ts) => {
        if (moneyLimit.minMoney !== null && ts.amount < moneyLimit.minMoney)
          return false;
        if (moneyLimit.maxMoney !== null && ts.amount > moneyLimit.maxMoney)
          return false;
        return true;
      })
      // 3. 내용 또는 메모 필터
      .filter((ts) => {
        if (!searchText.value) return true;
        if (ts.name?.toLowerCase().includes(searchText.value.toLowerCase()))
          return true;
        if (ts.memo?.toLowerCase().includes(searchText.value.toLowerCase()))
          return true;
        return false;
      })
      // 4. 자산 필터
      .filter((ts) => {
        if (!assetSelected.value) return true;
        if (assetSelected.value === "cash" && ts.asset_type === "cash")
          return true;
        else if (
          assetSelected.value !== null &&
          assetSelected.value.type === ts.asset_type &&
          assetSelected.value.id === ts.assetId
        )
          return true;
        return false;
      })
  );
});

// 필터링된 거래내역에서 전체/수입/지출 필터하여 랜더링
const filteredTransactionsByType = computed(() => {
  return filteredTransactions.value.filter((ts) => {
    if (currentTab.value === "수입") return ts.type === "income";
    else if (currentTab.value === "지출") return ts.type === "expense";
    return true;
  });
});

// 수입/지출/전체의 금액과 거래 수 계산을 위해 타입별 거래 배열 반환
const transactionsByType = (typeName) => {
  return filteredTransactions.value.filter((ts) => {
    if (typeName === "수입") return ts.type === "income";
    if (typeName === "지출") return ts.type === "expense";
    return true;
  });
};

// 검색창 열고 닫기
const switchSearch = () => {
  isSearch.value = !isSearch.value;
  // 검색창 닫히면 모두 초기화
  if (!isSearch.value) {
    moneyLimit.minMoney = null;
    moneyLimit.maxMoney = null;
    searchText.value = "";
  }
  selectedTransactions.value = []; // 선택 초기화
};

// 선택된 거래 내역 삭제
const deleteSelectedTransactions = () => {
  if (!confirm("선택한 거래내역을 삭제하시겠습니까?")) return;

  deleteTransactions(selectedTransactions.value);
  // 삭제 후 선택 초기화
  selectedTransactions.value = [];
};

// 전체 선택이 checked되면 모든 거래 선택
const allSelected = computed(() => {
  return (
    filteredTransactions.value.length > 0 &&
    filteredTransactions.value.every((tr) =>
      selectedTransactions.value.includes(tr.id)
    )
  );
});

// 전체 선택 클릭 시 호출
const toggleSelectAll = () => {
  // 이미 전체 선택이 되어있다면 모두 해제로 변경
  if (allSelected.value) {
    selectedTransactions.value = [];
  } else {
    selectedTransactions.value = filteredTransactions.value.map((tr) => tr.id);
  }
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
/* 높이 고정 */
.fixed-height {
  height: 2rem;
}
tr.custom-selected th {
  background-color: #3e4474;
}
tr.selected-row td {
  background-color: #f0f2f5; /* #fff8e1 */
}
</style>
