<template>
  <div class="container mt-4">
    <h3 class="section-title">고정 지출 목록</h3>

    <ul class="list-group mb-4">
      <li
        v-for="item in fixCostList"
        :key="item.id"
        class="list-group-item"
        :class="{ active: selectedFixCost?.id === item.id }"
        @click="selectItem(item)"
        style="cursor: pointer"
      >
        <div class="d-flex justify-content-between align-items-center">
          <strong>{{ item.name || '(이름 없음)' }}</strong>
          <small
            >{{ item.amount.toLocaleString() }}원 / {{ item.interval }}</small
          >
        </div>
      </li>
    </ul>

    <div v-if="selectedFixCost" class="card p-4">
      <h5>✏️ 수정: {{ selectedFixCost.name || '(이름 없음)' }}</h5>

      <div class="mb-3">
        <label class="form-label">이름</label>
        <input v-model="selectedFixCost.name" class="form-control" />
      </div>

      <div class="mb-3">
        <label class="form-label">금액</label>
        <input
          v-model.number="selectedFixCost.amount"
          type="number"
          class="form-control"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">반복 주기</label>
        <select v-model="selectedFixCost.interval" class="form-select">
          <option value="daily">매일</option>
          <option value="weekly">매주</option>
          <option value="monthly">매월</option>
          <option value="yearly">매년</option>
        </select>
      </div>

      <div class="row mb-3">
        <div class="col">
          <label class="form-label">시작일</label>
          <input
            v-model="selectedFixCost.date.startDate"
            type="date"
            class="form-control"
          />
        </div>
        <div class="col">
          <label class="form-label">종료일</label>
          <input
            v-model="selectedFixCost.date.endDate"
            type="date"
            class="form-control"
          />
        </div>
      </div>

      <div class="d-flex justify-content-end gap-2 mt-3">
        <button
          class="btn btn-outline-secondary"
          @click="selectedFixCost = null"
        >
          취소
        </button>
        <button
          class="btn btn-outline-danger"
          @click="deleteFixCost(selectedFixCost.id)"
        >
          삭제
        </button>
        <button class="btn btn-success" @click="saveFixCost">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import axios from 'axios';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const userId = ref(null);
const fixCostList = ref([]);
const selectedFixCost = ref(null);

onMounted(async () => {
  userId.value = authStore.user?.id;
  if (!userId.value) {
    alert('로그인이 필요합니다.');
    return router.push('/login');
  }

  const res = await axios.get(`http://localhost:3000/users/${userId.value}`);
  fixCostList.value = res.data.fixCost || [];
});

const selectItem = (item) => {
  selectedFixCost.value = JSON.parse(JSON.stringify(item));
};

const saveFixCost = async () => {
  const updated = fixCostList.value.map((item) =>
    item.id === selectedFixCost.value.id ? selectedFixCost.value : item
  );

  try {
    await axios.patch(`http://localhost:3000/users/${userId.value}`, {
      fixCost: updated,
    });
    fixCostList.value = updated;
    selectedFixCost.value = null;
    alert('수정 완료!');
  } catch (err) {
    console.error(err);
    alert('수정 실패');
  }
};

const deleteFixCost = async (id) => {
  if (!confirm('정말 삭제하시겠어요?')) return;

  const updated = fixCostList.value.filter((item) => item.id !== id);

  try {
    await axios.patch(`http://localhost:3000/users/${userId.value}`, {
      fixCost: updated,
    });
    fixCostList.value = updated;
    selectedFixCost.value = null;
    alert('삭제 완료!');
  } catch (err) {
    console.error(err);
    alert('삭제 실패');
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2b2b2b;
  margin-bottom: 2rem;
  border-left: 5px solid #ffd95a;
  padding-left: 0.75rem;
}

.fix-cost-container {
  max-width: 800px;
  margin: 40px auto;
  padding: 20px;
}

.page-title {
  font-weight: bold;
  font-size: 24px;
  margin-bottom: 24px;
  color: #333;
}

.fix-cost-list {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.fix-cost-item {
  padding: 16px 20px;
  border: 1px solid #ddd;
  margin-bottom: 8px;
  border-radius: 10px;
  background: #f9f9f9;
  transition: 0.2s;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.fix-cost-item:hover {
  background: #f0f0f0;
}
.fix-cost-item.active {
  border-color: #007bff;
  background: #eaf4ff;
}

.fix-cost-editor {
  background: #fff;
  border: 1px solid #ccc;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.05);
}

.editor-title {
  font-weight: bold;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.date-group {
  display: flex;
  gap: 20px;
}

.editor-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.btn {
  padding: 8px 16px;
  font-size: 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn.save {
  background: #007bff;
  color: white;
}
.btn.cancel {
  background: #aaa;
  color: white;
}
.btn.delete {
  background: #dc3545;
  color: white;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
