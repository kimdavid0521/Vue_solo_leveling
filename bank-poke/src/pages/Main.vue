<template>
  <div>
    <!-- 테이블 상단 네비게이션 바 -->
    <TableLayout :tabs="tabs" @update-tab="updateTab" />
    <Calender :currentPage="currentTab" @update-summary="updateSummary" />

    <div
      class="dropup"
      style="
        float: right;
        margin-right: 130px;
        position: fixed;
        bottom: 40px;
        right: 50px;
        z-index: 10;
      "
      @click="toggleDropdown"
    >
      <button class="btn btn-secondary dropdown-toggle">
        {{ selectedCategory || "+" }}
      </button>
      <ul class="dropdown-menu" :class="{ show: dropdownOpen }">
        <li>
          <a class="dropdown-item" href="#" @click="addExpense"
            >거래 내역 추가</a
          >
        </li>
        <li>
          <a class="dropdown-item" href="#" @click="addExpense">예산 설정</a>
        </li>
      </ul>
    </div>

    <AddExpenseModal
      v-if="showModal"
      @close="showModal = false"
      @save="saveExpense"
    />
  </div>
</template>

<script setup>
import { ref, computed, isRef } from "vue";
import axios from "axios";
import Calender from "@/components/Calender.vue";
import AddExpenseModal from "@/components/AddExpenseModal.vue";
import TableLayout from "@/components/TableLayout.vue";
import { useAuthStore } from "@/stores/auth";

// 유저 정보 받아오기
const authStore = useAuthStore();
const expenses = ref([]);
const showModal = ref(false);
const dropdownOpen = ref(false);
const selectedCategory = ref("");

const currentTab = ref("전체");
// const summary = ref({ income: 0, expenses: 0, total: 0 });
// const summaryCount = ref({ incomeCount: 0, expenseCount: 0, totalCount: 0 });

// 하위 컴포넌트에서 전달받은 값 등록
// const updateSummary = ({
//   summary: newSummary,
//   countSummary: newCountSummary,
// }) => {
//   summary.value = newSummary;
//   summaryCount.value = newCountSummary;
// };

// 페이지 이동 함수
const updateTab = (current) => {
  currentTab.value = current;
  console.log(currentTab.value);
};

const summary = ref({ income: 0, expense: 0, total: 0 });
const summaryCount = ref({ incomeCount: 0, expenseCount: 0, totalCount: 0 });

const updateSummary = ({ summary: newSummary, countSummary: newCount }) => {
  summary.value = newSummary;
  summaryCount.value = newCount;
};

// 탭 데이터
const tabs = computed(() => [
  {
    name: "전체",
    count: summaryCount.value.totalCount,
    amount: summary.value.total,
  },
  {
    name: "수입",
    count: summaryCount.value.incomeCount,
    amount: summary.value.income,
  },
  {
    name: "지출",
    count: summaryCount.value.expenseCount,
    amount: summary.value.expense,
  },
]);

const addExpense = () => {
  showModal.value = true;
};

// api 연결
const saveExpense = async (newExpense) => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      console.log("유저 정보가 없습니다");
    }
    // 유저 정보 가져오기
    const res = await axios.get(`http://localhost:3000/users/${userId}`);
    const userData = res.data;

    if (newExpense.isRepeat) {
      if (!Array.isArray(userData.fixCost)) {
        userData.fixCost = [];
      }

      const newId = userData.fixCost.length + 1;
      newExpense.id = newId;

      //fixCost배열에 추가
      userData.fixCost.push(newExpense);

      // 반복거래 내역 추가
      const repeatDates = generateRepeatDates(
        newExpense.date.startDate,
        newExpense.date.endDate,
        newExpense.interval
      );

      if (!Array.isArray(userData.transactions)) {
        userData.transactions = [];
      }

      // 반복된 날짜만큼 거래 생성
      for (const recurDate of repeatDates) {
        userData.transactions.push({
          ...newExpense,
          id: userData.transactions.length + 1,
          date: recurDate.toISOString().split("T")[0],
          isRepeat: false,
        });
      }

      // 고정 지출이랑 그에따른 지출 저장
      await axios.patch(`http://localhost:3000/users/${userId}`, {
        fixCost: userData.fixCost,
        transactions: userData.transactions,
      });

      console.log("고정 지출 저장 완료");
      showModal.value = false;
    } else {
      // 거래 배열 없으면 초기화
      if (!Array.isArray(userData.transactions)) {
        userData.transactions = [];
      }

      // 새로운 거래에 고유 id 부여
      const newId = userData.transactions.length + 1;
      newExpense.id = newId;

      // 거래 추가
      userData.transactions.push(newExpense);

      // 서버에 patch요청으로 저장
      await axios.patch(`http://localhost:3000/users/${userId}`, {
        transactions: userData.transactions,
      });

      console.log("거래 내역 저장 완료");
      showModal.value = false;
    }
  } catch (error) {
    console.error("저장 실패", error);
  }
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// 반복 날짜 생성 함수
function generateRepeatDates(startDate, endDate, interval) {
  const dates = [];
  const current = new Date(startDate);
  const last = new Date(endDate);

  while (current <= last) {
    dates.push(new Date(current));

    switch (interval) {
      case "daily":
        current.setDate(current.getDate() + 1);
        break;
      case "weekly":
        current.setDate(current.getDate() + 7);
        break;
      case "monthly":
        current.setMonth(current.getMonth() + 1);
        break;
      case "yearly":
        current.setFullYear(current.getFullYear() + 1);
        break;
      default:
        throw new Error("지원하지 않는 인터벌 기간입니다.");
    }
  }
  return dates;
}
</script>

<style scoped>
.dropdown-menu.show {
  display: block;
  bottom: 100%;
  top: auto;
  transform: translateY(-0.5rem);
}
</style>
