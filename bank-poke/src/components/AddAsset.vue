<template>
  <!-- 플로팅 폼 -->
  <Teleport to="body">
    <div v-if="showForm" class="position-fixed bottom-0 end-0 p-3">
      <div class="card p-3 shadow" style="width: 300px">
        <form @submit.prevent="handleAdd">
          <label for="cardName" class="form-label">카드 이름</label>
          <input
            id="cardName"
            v-model="cardName"
            class="form-control mb-2"
            required
          />

          <label for="sales" class="form-label">실적</label>
          <input
            id="sales"
            v-model.number="sales"
            type="number"
            class="form-control mb-2"
            required
          />

          <label for="bankSelect" class="form-label">은행 선택</label>
          <select
            id="bankSelect"
            v-model.number="accountBankId"
            class="form-select mb-2"
            required
          >
            <option disabled value="">은행 선택</option>
            <option v-for="b in store.bank" :key="b.id" :value="b.id">
              {{ b.name }}
            </option>
          </select>

          <button class="btn btn-success w-100" type="submit">추가</button>
        </form>
      </div>
    </div>
  </Teleport>

  <!-- 버튼 -->
  <button
    class="btn btn-primary rounded-circle position-fixed bottom-0 end-0 m-3"
    style="width: 50px; height: 50px; font-size: 24px"
    @click="showForm = !showForm"
  >
    +
  </button>
</template>

<script setup>
import { ref } from 'vue';
import { useMockUser } from '@/stores/mockUser';

const store = useMockUser();
const userId = 1;

const showForm = ref(false);
const cardName = ref('');
const sales = ref(0);
const accountBankId = ref('');

const handleAdd = async () => {
  const newId = Date.now();

  await store.addCardAndAccount(
    userId,
    {
      id: newId,
      name: cardName.value,
      sales_achievements: sales.value,
    },
    {
      id: newId,
      bankId: accountBankId.value,
    }
  );

  // 초기화
  cardName.value = '';
  sales.value = 0;
  accountBankId.value = '';
  showForm.value = false;
};
</script>
