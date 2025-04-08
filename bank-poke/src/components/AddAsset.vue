<template>
  <div>
    <button
      class="btn btn-outline-primary rounded-circle mb-2 d-flex justify-content-center align-items-center"
      style="width: 3em; height: 3em"
      @click="showForm = true"
    >
      +
    </button>
  </div>

  <!-- 자산 추가 폼 -->
  <teleport to="body">
    <div
      v-if="showForm"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: transparent"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-4">
          <div class="modal-header">
            <h5 class="modal-title">자산 추가</h5>
            <button type="button" class="btn-close" @click="cancel"></button>
          </div>

          <div class="modal-body d-flex flex-column gap-3">
            <!-- 자산 유형 -->
            <div>
              <label class="form-label">자산 유형</label>
              <select v-model="assetType" class="form-select" required>
                <option value="card">카드</option>
                <option value="account">계좌</option>
                <option value="etc">기타</option>
              </select>
            </div>

            <!-- 이름 -->
            <div>
              <label class="form-label">이름</label>
              <input
                v-model="cardOrAccountName"
                class="form-control"
                required
              />
            </div>

            <!-- 카드 종류 -->
            <div v-if="assetType === 'card'">
              <label class="form-label">카드 종류</label>
              <select v-model="isCheck" class="form-select" required>
                <option :value="true">체크카드</option>
                <option :value="false">신용카드</option>
              </select>
            </div>

            <!-- 실적 -->
            <div v-if="assetType === 'card'">
              <label class="form-label">실적</label>
              <input
                type="number"
                v-model.number="sales"
                class="form-control"
                required
              />
            </div>

            <!-- 연동 계좌 -->
            <div v-if="assetType === 'card'">
              <label class="form-label">연동 계좌</label>
              <select v-model="linkedAccountId" class="form-select" required>
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
              <label class="form-label">결제일 (일 단위)</label>
              <input
                type="number"
                min="1"
                max="31"
                v-model.number="dueDay"
                class="form-control"
                required
              />
            </div>

            <!-- 초기 자본 -->
            <div v-if="assetType === 'account' || assetType === 'etc'">
              <label class="form-label">초기 자본</label>
              <input
                type="number"
                v-model.number="sales"
                class="form-control"
                required
              />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cancel">취소</button>
            <button class="btn btn-primary" @click="handleAdd">추가</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAssetStore } from '@/stores/assetStore.js';

const store = useAssetStore();
const userId = 1;

const showForm = ref(false);
const cardOrAccountName = ref('');
const sales = ref(0);
const assetType = ref('');
const isCheck = ref(true);
const dueDay = ref(1);
const linkedAccountId = ref('');

const currentUser = computed(() => store.users.find((u) => u.id == userId));

const handleAdd = async () => {
  const newId = Date.now();

  if (assetType.value === 'card') {
    const newCard = {
      id: newId,
      name: cardOrAccountName.value,
      sales_achievements: sales.value,
      isCheck: isCheck.value,
      account_id: linkedAccountId.value,
    };

    if (!isCheck.value) {
      const now = new Date();
      now.setDate(dueDay.value);
      newCard.dueDate = now.toISOString().slice(0, 10);
    }

    await store.addCard(userId, newCard);
  } else if (assetType.value === 'account') {
    await store.addAccount(userId, {
      id: newId,
      name: cardOrAccountName.value,
      balance: sales.value,
    });
  } else if (assetType.value === 'etc') {
    await store.addEtc(userId, {
      id: newId,
      name: cardOrAccountName.value,
      balance: sales.value,
    });
  }

  // 초기화
  showForm.value = false;
  cardOrAccountName.value = '';
  sales.value = 0;
  isCheck.value = true;
  dueDay.value = 1;
  assetType.value = '';
  linkedAccountId.value = '';
};

const cancel = () => {
  showForm.value = false;
};
</script>
