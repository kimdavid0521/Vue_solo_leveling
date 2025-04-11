<template>
  <div>
    <button
      class="btn btn-outline-primary rounded-circle mb-1 d-flex flex-column justify-content-center align-items-center"
      style="width: 4em; height: 4em"
      @click="showForm = true"
    >
      <i class="fa-solid fa-file-circle-plus"></i>
      <div style="font-size: 90%; padding-top: 5%">추가</div>
    </button>
  </div>

  <!-- 자산 추가 폼 -->
  <teleport to="body">
    <div
      v-if="showForm"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: rgba(0, 0, 0, 0.3)"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
          <div class="modal-header bg-light border-0 py-3 px-4">
            <h5 class="modal-title fw-semibold">자산 추가</h5>
            <button type="button" class="btn-close" @click="resetForm"></button>
          </div>

          <div class="modal-body bg-white px-4 py-3 d-flex flex-column gap-3">
            <!-- 자산 유형 -->
            <div>
              <label class="form-label mb-1">자산 유형</label>
              <select v-model="assetType" class="form-select rounded-3">
                <option value="card">카드</option>
                <option value="account">계좌</option>
                <option value="etc">기타</option>
              </select>
            </div>

            <!-- 이름 -->
            <div>
              <label class="form-label mb-1">이름</label>
              <input
                v-model="cardOrAccountName"
                class="form-control rounded-3"
                placeholder="자산 이름 입력"
              />
            </div>

            <!-- 카드 종류 -->
            <div v-if="assetType === 'card'">
              <label class="form-label mb-1">카드 종류</label>
              <select v-model="isCheck" class="form-select rounded-3">
                <option :value="true">체크카드</option>
                <option :value="false">신용카드</option>
              </select>
            </div>

            <!-- 실적 -->
            <div v-if="assetType === 'card'">
              <label class="form-label mb-1">실적</label>
              <input
                type="number"
                v-model.number="sales"
                class="form-control rounded-3"
                placeholder="실적 금액 입력"
              />
            </div>

            <!-- 연동 계좌 -->
            <div v-if="assetType === 'card'">
              <label class="form-label mb-1">연동 계좌</label>
              <select v-model="linkedAccountId" class="form-select rounded-3">
                <option disabled value="">계좌를 선택하세요</option>
                <option
                  v-for="account in currentUser?.asset_group?.account || []"
                  :key="account.id"
                  :value="account.id"
                >
                  {{ account.name }}
                </option>
              </select>
            </div>

            <!-- 결제일 -->
            <div v-if="assetType === 'card' && isCheck === false">
              <label class="form-label mb-1">결제일 (일 단위)</label>
              <input
                type="number"
                min="1"
                max="31"
                v-model.number="dueDay"
                class="form-control rounded-3"
                placeholder="예: 25"
              />
            </div>

            <!-- 초기 자본 -->
            <div v-if="assetType === 'account' || assetType === 'etc'">
              <label class="form-label mb-1">초기 자본</label>
              <input
                type="number"
                v-model.number="sales"
                class="form-control rounded-3"
                placeholder="예: 500000"
              />
            </div>
          </div>

          <div class="modal-footer bg-light border-0 px-4 py-3">
            <button
              class="btn btn-outline-secondary rounded-3"
              @click="resetForm"
            >
              취소
            </button>
            <button class="btn btn-primary rounded-3 px-4" @click="handleAdd">
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAssetStore } from '@/stores/assetStore.js';
import { useAuthStore } from '@/stores/auth';
import { nextTick } from 'vue';

const store = useAssetStore();

const auth = useAuthStore();
const userId = computed(() => auth.user?.id);

const showForm = ref(false);
const cardOrAccountName = ref('');
const sales = ref(0);
const assetType = ref('account');
const isCheck = ref(true);
const dueDay = ref(1);
const linkedAccountId = ref('');

const currentUser = computed(() =>
  store.users.find((u) => u.id == userId.value)
);

const handleAdd = async () => {
  // 기본 유효성 검사
  if (!assetType.value) {
    alert('자산 유형을 선택해주세요.');
    return;
  }

  if (!cardOrAccountName.value.trim()) {
    alert('이름은 필수 항목입니다.');
    await nextTick();
    document.querySelector('#asset-name')?.focus();
    return;
  }

  if (assetType.value === 'card') {
    if (!linkedAccountId.value) {
      alert('카드는 연동 계좌 선택이 필요합니다.');
      await nextTick();
      document.querySelector('#linked-account')?.focus();
      return;
    }

    if (sales.value < 0) {
      alert('실적은 0 이상이어야 합니다.');
      await nextTick();
      document.querySelector('#sales')?.focus();
      return;
    }

    if (!isCheck.value && (dueDay.value < 1 || dueDay.value > 31)) {
      alert('신용카드의 결제일은 1~31 사이여야 합니다.');
      await nextTick();
      document.querySelector('#due-day')?.focus();
      return;
    }

    const today = new Date();
    const newCard = {
      id: Date.now(),
      name: cardOrAccountName.value,
      sales_achievements: sales.value,
      isCheck: isCheck.value,
      account_id: linkedAccountId.value,
      dueDate: new Date(today.getFullYear(), today.getMonth(), dueDay.value),
    };

    if (!isCheck.value) {
      const now = new Date();
      now.setDate(dueDay.value);
      newCard.dueDate = now.toISOString().slice(0, 10);
    }

    await store.addCard(userId.value, newCard);
  } else if (assetType.value === 'account' || assetType.value === 'etc') {
    if (sales.value < 0) {
      alert('초기 자본은 0 이상이어야 합니다.');
      await nextTick();
      document.querySelector('#sales')?.focus();
      return;
    }

    const assetData = {
      id: Date.now(),
      name: cardOrAccountName.value,
      balance: sales.value,
    };

    if (assetType.value === 'account') {
      await store.addAccount(userId.value, assetData);
    } else {
      await store.addEtc(userId.value, assetData);
    }
  }

  // 초기화
  resetForm();
};

const resetForm = () => {
  showForm.value = false;
  cardOrAccountName.value = '';
  sales.value = 0;
  isCheck.value = true;
  dueDay.value = 1;
  assetType.value = '';
  linkedAccountId.value = '';
  assetType.value = 'account';
};
</script>
