<template>
  <div class="d-flex gap-1">
    <div class="d-flex gap-1">
      <!-- 자산 필터링 -->
      <div class="dropdown">
        <button
          class="btn btn-sm rounded-4 custom-btn text-nowrap dropdown-toggle"
          data-bs-toggle="dropdown"
        >
          자산
        </button>
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
          {{ state.moneyFilter }}
        </button>
        <!-- 금액 입력창 -->
        <div class="dropdown-menu p-3" style="width: 300px">
          <div class="d-flex align-items-center mb-3 gap-2">
            <input
              type="number"
              class="form-control"
              placeholder="최소"
              v-model.number="state.minMoney"
            />
            <span class="text-muted">~</span>
            <input
              type="number"
              class="form-control"
              placeholder="최대"
              v-model.number="state.maxMoney"
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
        v-model="state.searchText"
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
import { reactive } from 'vue';

const state = reactive({
  moneyFilter: '금액',
  minMoney: null,
  maxMoney: null,
  searchText: '',
});

const emit = defineEmits(['update-money', 'update-content']);

// 금액 범위 초기화
const resetMoneyFilter = () => {
  state.moneyFilter = '금액';
  state.minMoney = null;
  state.maxMoney = null;
  emit('update-money', {
    minMoney: state.minMoney,
    maxMoney: state.maxMoney,
  });
};

// 금액 범위 설정 (적용 버튼 클릭 시 호출)
const setMoneyFilter = () => {
  let minText = '최소';
  let maxText = '최대';
  if (state.maxMoney !== null && state.minMoney > state.maxMoney) {
    [state.minMoney, state.maxMoney] = [state.maxMoney, state.minMoney];
  }
  if (state.minMoney !== null && Number.isInteger(state.minMoney)) {
    minText = `${state.minMoney.toLocaleString()}원`;
  }
  if (state.maxMoney !== null && Number.isInteger(state.maxMoney)) {
    maxText = `${state.maxMoney.toLocaleString()}원`;
  }
  //입력창에 한글 입력되면 빈문자열 반환 (영어는 입력X)
  state.moneyFilter = `${minText} ~ ${maxText}`;
  emit('update-money', {
    minMoney: state.minMoney,
    maxMoney: state.maxMoney,
  });
};

const inputContent = (content) => {
  emit('update-content', content);
};

// 전체 초기화
const reset = () => {
  resetMoneyFilter();
  state.searchText = '';
  emit('update-content', state.searchText);
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
</style>
