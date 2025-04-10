<template>
  <div
    class="modal fade show d-block"
    tabindex="-1"
    role="dialog"
    style="background: rgba(165, 97, 97, 0.5)"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">내역 추가</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <!-- 고정 지출 여부 -->
          <div class="mb-3">
            <label class="form-label">고정 지출 여부</label>
            <input
              v-model="isRepeat"
              type="checkbox"
              class="form-check-input"
            />
          </div>
          <!-- 고정 지출 반복 주기 -->
          <div v-if="isRepeat" class="mb-3">
            <label class="form-label">반복 주기</label>
            <select v-model="interval" class="form-select">
              <option disabled value="">주기 선택</option>
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
              <option value="yearly">매년</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">지출 이름</label>
            <input v-model="name" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">금액</label>
            <input v-model.number="amount" type="number" class="form-control" />
          </div>
          <!-- 고정 지출이라면 시작날짜와 종료날짜로 변경 -->
          <div class="mb-3" v-if="!isRepeat">
            <label class="form-label">날짜</label>
            <input v-model="date" type="date" class="form-control" />
          </div>

          <div v-else class="row mb-3">
            <div class="col">
              <label class="form-label">시작 날짜</label>
              <input v-model="startDate" type="date" class="form-control" />
            </div>

            <div class="col">
              <label class="form-label">종료 날짜</label>
              <input v-model="endDate" type="date" class="form-control" />
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">시간</label>
            <input v-model="time" type="time" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">자산 타입</label>
            <select v-model="selectedAssetType" class="form-select">
              <option disabled value="">자산 타입 선택</option>
              <option value="card">카드</option>
              <option value="account">계좌</option>
              <option value="etc">기타</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">자산 선택</label>
            <select v-model="selectedAssetId" class="form-select">
              <option disabled value="">자산 선택</option>
              <option
                v-for="asset in filteredAssets"
                :key="asset.id"
                :value="asset.id"
              >
                {{ asset.name }}
              </option>
            </select>
          </div>

          <!-- 카테고리 -->
          <div class="mb-3">
            <label class="form-label">소비 타입</label>
            <select v-model="selectedPayType" class="form-select">
              <option disabled value="">소비 타입 선택</option>
              <option value="expense">소비</option>
              <option value="income">입금</option>
            </select>
          </div>

          <!-- <div class="mb-3">
            <label class="form-label">상위 카테고리</label>
            <select v-model="selcetedCategoryType" class="form-select">
              <option disabled value="">카테고리 선택</option>
              <option value="card">카드</option>
              <option value="account">계좌</option>
              <option value="etc">기타</option>
            </select>
          </div> -->

          <div class="mb-3">
            <label class="form-label">상위 카테고리 선택</label>
            <select v-model="selcetedCategoryType" class="form-select">
              <option disabled value="">상위 카테고리 선택</option>
              <option
                v-for="category in filterCategory"
                :key="category.id"
                :value="category.id"
              >
                {{ category.main_category }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">하위 카테고리 선택</label>
            <select v-model="selectedSubCategory" class="form-select">
              <option disabled value="">하위 카테고리 선택</option>
              <option
                v-for="category in subCategoryOptions"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">메모</label>
            <input v-model="memo" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">내역에 추가할지</label>
            <input
              v-model="inInclude"
              type="checkbox"
              class="form-check-input"
            />
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="$emit('close')">
            취소
          </button>
          <button class="btn btn-primary" @click="handleSave">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

// 오늘 날짜
const today = new Date();
const currentTime = today.toTimeString().slice(0, 5);
// 유저 정보 받아오기
const authStore = useAuthStore();
const emit = defineEmits(['close', 'save']);

const name = ref('');
const amount = ref(0);

const date = ref(today.toISOString().split("T")[0]);
const startDate = ref(today.toISOString().split("T")[0]);
const endDate = ref("");
const time = ref(currentTime);
const memo = ref("");

const inInclude = ref(true);
const selectedAssetType = ref(''); // 자산 타입
const selectedAssetId = ref(''); // 자산 id
const selectedPayType = ref(''); // 소비 분류 타입 : 소비인지 입금인지
const selcetedCategoryType = ref(''); // 선택된 대분류 카테고리
const selectedSubCategory = ref(''); // 소분류 카테고리
const assetGroup = ref({ card: [], account: [], etc: [] });
const categoryGroup = ref({ expense: [], income: [] });
const category = ref("");
const sub_category = ref("");
const assetId = ref("");
const type = ref("");
const asset_type = ref("");
const addTotal = ref("");
// 고정 지출 여부 체크
const isRepeat = ref(false);
// 반복 주기
const interval = ref('');

onMounted(async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      console.log('유저 정보가 없습니다');
    }
    console.log(userId);
    const res = await axios.get(`http://localhost:3000/users/${userId}`);
    assetGroup.value = res.data.asset_group;
    categoryGroup.value = res.data.category;
  } catch (err) {
    console.error(err);
  }
});
// 자산 타입에 따라 자산 추출 변경
const filteredAssets = computed(() => {
  console.log(assetGroup.value[selectedAssetType.value]);
  return assetGroup.value[selectedAssetType.value] || [];
});

// 소비 타입에 따라 카테고리 분류
const filterCategory = computed(() => {
  return categoryGroup.value[selectedPayType.value] || [];
});

// 선택된 상위 카테고리 id에 따른 하위 카테고리 리스트
const subCategoryOptions = computed(() => {
  const selected = filterCategory.value.find(
    (c) => c.id === Number(selcetedCategoryType.value)
  );
  return selected ? selected.sub_categories : [];
});

const handleSave = () => {
  emit('save', {
    name: name.value,
    date: isRepeat.value
      ? { startDate: startDate.value, endDate: endDate.value }
      : date.value,
    category: selcetedCategoryType.value,
    sub_category: selectedSubCategory.value,
    assetId: selectedAssetId.value,
    type: selectedPayType.value,
    amount: amount.value,
    memo: memo.value,
    time: time.value,
    asset_type: selectedAssetType.value,
    addTotal: inInclude.value,
    isRepeat: isRepeat.value,
    ...(isRepeat.value && { interval: interval.value }), // 인터벌 값 제어
  });

  name.value = '';
  amount.value = 0;
  date.value = '';
  startDate.value = '';
  endDate.value = '';
  time.value = '';
  memo.value = '';
  inInclude.value = true;
  selectedAssetType.value = '';
  selectedAssetId.value = '';
  selectedPayType.value = '';
  selcetedCategoryType.value = '';
  selectedSubCategory.value = '';
  isRepeat.value = false;
  interval.value = '';
};
</script>

<style scoped>
.modal-dialog {
  max-width: 600px;
  animation: fadeInUp 0.4s ease-out;
}

.modal-content {
  background: linear-gradient(to right, #f8f9fa, #ffffff);
  border-radius: 20px;
  border: none;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.2);
}

.modal-header {
  background: #ffd95a;
  color: white;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: 1.2rem 1.5rem;
}

.modal-title {
  font-weight: 700;
  font-size: 1.5rem;
}

.btn-close {
  filter: brightness(100);
}

.modal-body {
  padding: 2rem;
  font-size: 1rem;
}

.form-label {
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
}

.form-control,
.form-select {
  border-radius: 12px;
  border: 1px solid #ced4da;
  transition: all 0.3s ease;
}

.form-control:focus,
.form-select:focus {
  border-color: #6c63ff;
  box-shadow: 0 0 0 0.2rem rgba(108, 99, 255, 0.25);
}

.form-check-input {
  width: 1.2rem;
  height: 1.2rem;
  cursor: pointer;
}

.modal-footer {
  background: #f1f3f5;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-primary {
  background-color: #6c63ff;
  border: none;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-primary:hover {
  background-color: #574fd6;
}

.btn-secondary {
  background-color: #adb5bd;
  border: none;
  font-weight: 600;
}

.btn-secondary:hover {
  background-color: #868e96;
}

@keyframes fadeInUp {
  0% {
    transform: translateY(40px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
