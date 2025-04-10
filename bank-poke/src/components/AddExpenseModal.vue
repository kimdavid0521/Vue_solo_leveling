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
          <h5 class="modal-title">지출 추가</h5>
          <button
            type="button"
            class="btn-close"
            @click="$emit('close')"
          ></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">지출 이름</label>
            <input v-model="name" type="text" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">금액</label>
            <input v-model.number="amount" type="number" class="form-control" />
          </div>
          <div class="mb-3">
            <label class="form-label">날짜</label>
            <input v-model="date" type="date" class="form-control" />
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

          <div class="mb-3">
            <label class="form-label">상위 카테고리 선택</label>
            <select v-model="selectedCategoryType" class="form-select">
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
              <option v-for="sub in subCategoryOptions" :key="sub" :value="sub">
                {{ sub }}
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

const emit = defineEmits(['close', 'save']);

const selectedAssetType = ref(''); // 자산 타입
const selectedAssetId = ref(''); // 자산 id
const selectedPayType = ref(''); // 소비 유형: 'expense' or 'income'
const selectedCategoryType = ref(''); // 상위 카테고리 id
const selectedSubCategory = ref(''); // 하위 카테고리
const assetGroup = ref({ card: [], account: [], etc: [] });
const categoryGroup = ref({ expense: [], income: [] });

const name = ref('');
const amount = ref(0);
const date = ref('');
const time = ref('');
const memo = ref('');
const inInclude = ref(true);

const authStore = useAuthStore();

onMounted(async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      console.error('유저 정보가 없습니다.');
      return;
    }
    const res = await axios.get(`http://localhost:3000/users/${userId}`);
    assetGroup.value = res.data.asset_group;
    categoryGroup.value = res.data.category;
  } catch (err) {
    console.error(err);
  }
});

// 자산 타입에 따라 자산 필터링
const filteredAssets = computed(() => {
  return assetGroup.value[selectedAssetType.value] || [];
});
// 소비 타입에 따라 카테고리 분류
const filterCategory = computed(() => {
  return categoryGroup.value[selectedPayType.value] || [];
});

// 선택된 상위 카테고리에 따른 하위 카테고리 리스트
const subCategoryOptions = computed(() => {
  const selected = filterCategory.value.find(
    (c) => c.id === Number(selectedCategoryType.value)
  );

  return selected ? selected.sub_categories : [];
});

const handleSave = () => {
  // 부모 컴포넌트에게 데이터 전달
  emit('save', {
    name: name.value,
    date: date.value,
    category: selectedCategoryType.value,
    sub_category: selectedSubCategory.value,
    assetId: selectedAssetId.value,
    type: selectedPayType.value,
    amount: amount.value,
    memo: memo.value,
    time: time.value,
    asset_type: selectedAssetType.value,
    addTotal: inInclude.value,
  });

  // 입력 항목 초기화
  name.value = '';
  amount.value = 0;
  date.value = '';
  time.value = '';
  memo.value = '';
  inInclude.value = true;

  selectedAssetType.value = '';
  selectedAssetId.value = '';
  selectedPayType.value = '';
  selectedCategoryType.value = '';
  selectedSubCategory.value = '';
};
</script>
