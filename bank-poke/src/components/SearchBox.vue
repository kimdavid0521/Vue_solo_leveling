<template>
  <div class="d-flex gap-1">
    <div class="d-flex gap-1">
      <!-- 자산 필터링 -->
      <div class="dropdown">
        <button
          class="btn btn-sm rounded-4 custom-btn text-nowrap dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          {{ states.assetFilter }}
        </button>
        <!-- 자산 선택창 -->
        <div class="dropdown-menu p-3" style="width: 300px">
          <!-- 보유 자산 목록 -->
          <div style="height: 300px; overflow-y: auto">
            <div
              class="px-2 py-2 mouseHover"
              style="cursor: pointer"
              data-bs-auto-close="outside"
              @click.stop="states.selectedAsset = 'cash'"
              :class="states.selectedAsset === 'cash' ? 'custom-selected' : ''"
            >
              현금
            </div>
            <div
              v-for="asset in states.assetList"
              :key="asset.value"
              data-bs-auto-close="outside"
              @click.stop
            >
              <div
                class="d-flex justify-content-between px-2 py-2 mouseHover"
                @click="toggleExpand(asset)"
                style="cursor: pointer"
              >
                {{ asset.name }}
                <i
                  v-if="asset.children"
                  class="align-content-center fa-solid"
                  :class="
                    expanded[asset.value] ? 'fa-chevron-up' : 'fa-chevron-down'
                  "
                ></i>
              </div>
              <!-- 하위 항목 -->
              <div v-if="asset.children && expanded[asset.value]" class="ms-4">
                <div
                  v-for="child in asset.children"
                  :key="child.id"
                  class="px-2 py-2 mouseHover"
                  @click.stop="
                    states.selectedAsset = {
                      type: asset.value,
                      typeName: asset.name,
                      id: child.id,
                      name: child.name,
                    }
                  "
                  style="cursor: pointer"
                  :class="
                    states.selectedAsset?.type === asset.value &&
                    states.selectedAsset?.id === child.id
                      ? 'custom-selected'
                      : ''
                  "
                >
                  {{ child.name }}
                </div>
              </div>
            </div>
          </div>
          <!-- 버튼 박스 -->
          <div class="d-flex justify-content-between border-top mt-2 pt-2">
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="resetAssetFilter"
            >
              초기화
            </button>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary" @click="">
                취소
              </button>
              <button class="btn btn-sm btn-danger" @click="setAssetFilter">
                적용
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 분류 필터링 -->
      <div class="dropdown">
        <button
          class="btn btn-sm rounded-4 custom-btn text-nowrap dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          {{ states.categoryFilter }}
        </button>
        <!-- 분류 선택창 -->
        <div class="dropdown-menu p-3" style="width: 300px">
          <!-- 분류 목록 -->
          <div>
            <div
              v-for="(type, index) in states.categoryList"
              :key="index"
              data-bs-auto-close="outside"
              @click.stop
            >
              <!-- 카테고리 유형 (수입/지출) -->
              <div
                v-if="type.category?.length !== 0"
                class="d-flex justify-content-between px-2 py-2 mouseHover"
                @click.stop="categoryExpand(type)"
                style="cursor: pointer"
                :class="expandedType[type.name] ? 'border-bottom' : ''"
              >
                {{ type.name }}
                <i
                  class="align-content-center fa-solid"
                  :class="
                    expandedType[type.name]
                      ? 'fa-chevron-up'
                      : 'fa-chevron-down'
                  "
                ></i>
              </div>
              <!-- 지출/수입 카테고리 -->
              <div
                v-if="type.category && expandedType[type.name]"
                class="ps-4"
                style="max-height: 200px; overflow-y: auto"
              >
                <div
                  v-for="(ct, index) in type.category"
                  :key="index"
                  class="my-2 pe-3"
                >
                  <!-- 메인 카테고리 -->
                  <div
                    class="d-flex align-items-center"
                    @click.stop="toggleSubCategory(type.name, ct)"
                  >
                    <input
                      type="checkbox"
                      class="form-check-input me-2"
                      :checked="isAllSubCategorySelected(type.name, ct)"
                      @change.stop="toggleMainCategory(type.name, ct)"
                    />
                    <span class="me-2">{{ ct.icon }}</span>
                    <span class="flex-grow-1" @click.stop="">{{
                      ct.main_category
                    }}</span>
                    <i
                      v-if="ct.sub_categories?.length"
                      class="align-content-center fa-solid"
                      :class="
                        (
                          type.name === '지출'
                            ? expandedSubExpense[ct.id]
                            : expandedSubIncome[ct.id]
                        )
                          ? 'fa-chevron-up'
                          : 'fa-chevron-down'
                      "
                      style="cursor: pointer"
                    ></i>
                  </div>

                  <!-- 서브 카테고리 -->
                  <div
                    v-if="
                      type.name === '지출'
                        ? expandedSubExpense[ct.id]
                        : expandedSubIncome[ct.id]
                    "
                    class="ms-4 my-2"
                    v-for="(sub, index) in ct.sub_categories"
                    :key="index"
                  >
                    <div class="d-flex align-items-center">
                      <input
                        type="checkbox"
                        class="form-check-input me-2"
                        :checked="isSubSelected(type.name, ct.id, sub)"
                        @change.stop="
                          toggleSubCategoryItem(type.name, ct.id, sub)
                        "
                      />
                      <span>{{ sub }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 버튼 박스 -->
          <div class="d-flex justify-content-between border-top mt-2 pt-2">
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="resetCategory"
            >
              초기화
            </button>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary" @click="">
                취소
              </button>
              <button class="btn btn-sm btn-danger" @click="setCategory">
                적용
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 금액 필터링 -->
      <div class="dropdown">
        <button
          class="btn btn-sm rounded-4 custom-btn text-nowrap dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          {{ states.moneyFilter }}
        </button>
        <!-- 금액 입력창 -->
        <div class="dropdown-menu p-3" style="width: 300px">
          <div
            class="d-flex align-items-center mb-3 gap-2"
            data-bs-auto-close="outside"
            @click.stop
          >
            <input
              type="number"
              class="form-control"
              placeholder="최소"
              v-model.number="states.minMoney"
            />
            <span class="text-muted">~</span>
            <input
              type="number"
              class="form-control"
              placeholder="최대"
              v-model.number="states.maxMoney"
            />
          </div>
          <div class="d-flex justify-content-between">
            <button
              class="btn btn-sm btn-outline-secondary"
              @click="resetMoneyFilter"
            >
              초기화
            </button>
            <div class="d-flex gap-2">
              <button class="btn btn-sm btn-outline-secondary" @click="">
                취소
              </button>
              <button class="btn btn-sm btn-danger" @click="setMoneyFilter">
                적용
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 내용 또는 메모 입력창 -->
    <div class="input-group rounded border">
      <span class="input-group-text bg-white border-0">
        <i class="fas fa-search text-muted"></i>
      </span>
      <input
        type="text"
        class="form-control border-0"
        placeholder="내용 또는 메모"
        v-model="states.searchText"
        @keyup.enter="inputContent($event.target.value)"
      />
    </div>
    <!-- 초기화 버튼 -->
    <div>
      <button
        class="btn btn-sm btn-danger rounded-3 text-nowrap"
        @click="reset"
      >
        <i class="fa-solid fa-arrow-rotate-right"></i>
        초기화
      </button>
    </div>
  </div>
</template>
<script setup>
import { reactive, computed, toRaw } from 'vue';
// import { useUserStore } from '@/stores/user.js';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();
const user = authStore.user;

// 자산 선택창 내 확장 여부
const expanded = reactive({});
// 분류 선택창 내 확장 여부
const expandedType = reactive({});
// 서브 카테고리 확장 여부
const expandedSubIncome = reactive({});
const expandedSubExpense = reactive({});
// 선택된 카테고리
const selectedSubCategories = reactive({
  expense: {}, // { [categoryId]: Set(subCategoryId) }
  income: {},
});

const states = reactive({
  moneyFilter: '금액',
  minMoney: null,
  maxMoney: null,
  searchText: '',
  assetFilter: '자산',
  assetList: [],
  selectedAsset: null,
  categoryFilter: '분류',
  categoryList: [
    { name: '지출', category: [] },
    { name: '수입', category: [] },
  ],
});

const emit = defineEmits([
  'update-money',
  'update-content',
  'update-asset',
  'update-category',
]);

// 사용자 보유 자산 목록
const userAssetList = () => {
  const userAssetGroup = user.asset_group;
  if (userAssetGroup.account.length !== 0) {
    states.assetList.push({
      name: '은행(계좌)',
      value: 'account',
      children: userAssetGroup.account,
    });
  }
  if (userAssetGroup.card.length !== 0) {
    const check = userAssetGroup.card.filter((a) => a.isCheck);
    const credit = userAssetGroup.card.filter((a) => !a.isCheck);
    if (credit.length !== 0) {
      states.assetList.push({
        name: '카드',
        value: 'card',
        children: credit,
      });
    }
    if (check.length !== 0) {
      states.assetList.push({
        name: '체크카드',
        value: 'card',
        children: check,
      });
    }
  }
  if (userAssetGroup.etc.length !== 0) {
    states.assetList.push({
      name: '기타',
      value: 'etc',
      children: userAssetGroup.etc,
    });
  }
};
userAssetList();

// 하위 자산 클릭 시 호출
const toggleExpand = (item) => {
  if (!item.children) return;
  expanded[item.value] = !expanded[item.value];
};

// 자산 필터 초기화
const resetAssetFilter = () => {
  states.assetFilter = '자산';
  states.selectedAsset = null;
  Object.keys(expanded).forEach((key) => {
    expanded[key] = false;
  });
  emit('update-asset', states.selectedAsset);
};

// 자산 필터 적용
const setAssetFilter = () => {
  if (states.selectedAsset === 'cash') {
    states.assetFilter = '현금';
  } else if (states.selectedAsset !== null) {
    states.assetFilter = `${states.selectedAsset.typeName}: ${states.selectedAsset.name}`;
  }
  emit('update-asset', states.selectedAsset);
};

// 사용자 보유 카테고리
const userCategory = () => {
  const category = user.category;
  states.categoryList[0].category = category.expense;

  states.categoryList[1].category = category.income;
};
userCategory();

// 카테고리 토글 클릭 시 호출
const categoryExpand = (item) => {
  if (!item.category) return;
  expandedType[item.name] = !expandedType[item.name];
};

// 서브 카테고리 토글 함수
const toggleSubCategory = (type, category) => {
  if (!category.sub_categories) return;
  if (type === '수입')
    expandedSubIncome[category.id] = !expandedSubIncome[category.id];
  if (type === '지출')
    expandedSubExpense[category.id] = !expandedSubExpense[category.id];
};

// 메인 카테고리 체크박스 상태 변경 시 호출
const toggleMainCategory = (type, ct) => {
  const selectedSubCategoriesBytype =
    type === '지출'
      ? selectedSubCategories.expense
      : selectedSubCategories.income;

  const selectedSet = selectedSubCategoriesBytype[ct.id] || new Set();
  const allSelected = selectedSet.size === ct.sub_categories.length;

  selectedSubCategoriesBytype[ct.id] = new Set(
    allSelected ? [] : ct.sub_categories
  );
};

// 서브 카테고리 체크박스 상태 변경 시 호출
const toggleSubCategoryItem = (type, catId, sub) => {
  const selectedSubCategoriesBytype =
    type === '지출'
      ? selectedSubCategories.expense
      : selectedSubCategories.income;

  if (!selectedSubCategoriesBytype[catId]) {
    selectedSubCategoriesBytype[catId] = new Set();
  }
  const set = selectedSubCategoriesBytype[catId];
  set.has(sub) ? set.delete(sub) : set.add(sub);
};

// 선택된 카테고리에 있으면 해당 서브 checked
const isSubSelected = (type, catId, sub) => {
  const selectedSubCategoriesBytype =
    type === '지출'
      ? selectedSubCategories.expense
      : selectedSubCategories.income;
  return selectedSubCategoriesBytype[catId]?.has(sub);
};

// 하위 서브 카테고리 모두 선택되면 전체 선택(메인 카테고리) checked
const isAllSubCategorySelected = (type, ct) => {
  const selectedSubCategoriesBytype =
    type === '지출'
      ? selectedSubCategories.expense
      : selectedSubCategories.income;
  return selectedSubCategoriesBytype[ct.id]?.size === ct.sub_categories?.length;
};

const resetCategory = () => {
  selectedSubCategories.income = {};
  selectedSubCategories.expense = {};
  Object.keys(expandedType).forEach((key) => {
    expandedType[key] = false;
  });
  Object.keys(expandedSubIncome).forEach((key) => {
    expandedSubIncome[key] = false;
  });
  Object.keys(expandedSubExpense).forEach((key) => {
    expandedSubExpense[key] = false;
  });
  emit('update-category', null);
};

const setCategory = () => {
  if (
    Object.keys(selectedSubCategories.expense).length !== 0 ||
    Object.keys(selectedSubCategories.income).length !== 0
  ) {
    emit('update-category', structuredClone(toRaw(selectedSubCategories)));
  }
};

// 금액 범위 초기화
const resetMoneyFilter = () => {
  states.moneyFilter = '금액';
  states.minMoney = null;
  states.maxMoney = null;
  emit('update-money', {
    minMoney: states.minMoney,
    maxMoney: states.maxMoney,
  });
};

// 금액 범위 설정 (적용 버튼 클릭 시 호출)
const setMoneyFilter = () => {
  let minText = '최소';
  let maxText = '최대';
  if (states.maxMoney !== null && states.minMoney > states.maxMoney) {
    [states.minMoney, states.maxMoney] = [states.maxMoney, states.minMoney];
  }
  if (states.minMoney !== null && Number.isInteger(states.minMoney)) {
    minText = `${states.minMoney.toLocaleString()}원`;
  }
  if (states.maxMoney !== null && Number.isInteger(states.maxMoney)) {
    maxText = `${states.maxMoney.toLocaleString()}원`;
  }
  //입력창에 한글 입력되면 빈문자열 반환 (영어는 입력X)
  states.moneyFilter = `${minText} ~ ${maxText}`;
  emit('update-money', {
    minMoney: states.minMoney,
    maxMoney: states.maxMoney,
  });
};

const inputContent = (content) => {
  emit('update-content', content);
};

// 전체 초기화
const reset = () => {
  resetMoneyFilter();
  resetAssetFilter();
  resetCategory();
  states.searchText = '';
  emit('update-content', states.searchText);
};
</script>
<style scoped>
.custom-btn {
  border: 1px solid #6c757d;
}
.input-group > * {
  height: 100%;
}
.input-group {
  overflow: hidden;
}
.mouseHover:hover {
  background-color: #f0f2f5;
}
.custom-selected {
  font-weight: bold;
  background-color: #fef1ed;
}
.custom-subCategory {
  font-weight: normal;
  background-color: #fef1ed;
}
</style>
