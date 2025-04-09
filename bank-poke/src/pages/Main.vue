<template>
  <div>

    <Calender />

    <div
      class="dropup"
      style="float: right; margin-right: 130px"
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
import { ref } from "vue";
import axios from "axios";
import Calender from "@/components/Calender.vue";
import AddExpenseModal from "@/components/AddExpenseModal.vue";

const expenses = ref([]);
const showModal = ref(false);
const dropdownOpen = ref(false);
const selectedCategory = ref("");
const userId = 2;

const addExpense = () => {
  showModal.value = true;
};

// api 연결
const saveExpense = async (newExpense) => {
  try {
    // 유저 정보 가져오기
    const res = await axios.get(`http://localhost:3000/users/${userId}`);
    const userData = res.data;

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

    console.log("저장 완료");
    showModal.value = false;
  } catch (error) {
    console.error("저장 실패", error);
  }
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};
</script>

<style scoped>
.dropdown-menu.show {
  display: block;
  bottom: 100%;
  top: auto;
  transform: translateY(-0.5rem);
}
</style>
