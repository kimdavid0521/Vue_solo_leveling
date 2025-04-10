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
          <div style="height: 300px; overflow-y: scroll">
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
                  class="fa-solid"
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
          분류
        </button>
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
import { reactive, computed } from 'vue';
// import { useUserStore } from '@/stores/user.js';
import { useAuthStore } from '@/stores/auth.js';

const authStore = useAuthStore();
const user = authStore.user;

// 자산 선택창 내 확장 여부
const expanded = reactive({});

const states = reactive({
  moneyFilter: '금액',
  minMoney: null,
  maxMoney: null,
  searchText: '',
  assetFilter: '자산',
  assetList: [],
  selectedAsset: null,
});

const emit = defineEmits(['update-money', 'update-content', 'update-asset']);

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
</style>
