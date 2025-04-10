<!-- UpdateAsset.vue -->
<template>
  <div>
    <!-- 수정 버튼 -->
    <button
      class="btn btn-outline-success rounded-circle mb-1 d-flex flex-column justify-content-center align-items-center"
      style="width: 4em; height: 4em"
      @click="showForm = true"
    >
      <i class="fa-solid fa-pen-to-square"></i>
      <div style="font-size: 90%; padding-top: 5%">수정</div>
    </button>

    <!-- 자산 선택 모달 -->
    <teleport to="body">
      <div
        v-if="showForm"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div class="modal-content p-3">
            <div class="modal-header">
              <h5 class="modal-title">수정할 자산을 선택하세요</h5>
              <button class="btn-close" @click="resetForm"></button>
            </div>

            <div class="modal-body" style="max-height: 300px; overflow-y: auto">
              <ul class="list-group">
                <li
                  v-for="asset in allAssets"
                  :key="asset.id"
                  class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  @click="selectAsset(asset)"
                  style="cursor: pointer"
                >
                  <span>{{ asset.name }}</span>
                  <span class="badge bg-secondary">{{ asset.type }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </teleport>

    <!-- 자산 수정 모달 -->
    <teleport to="body">
      <div
        v-if="selectedAsset"
        class="modal fade show d-block"
        tabindex="-1"
        style="background-color: rgba(0, 0, 0, 0.5)"
      >
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-4">
            <div class="modal-header">
              <h5 class="modal-title">자산 수정</h5>
              <button class="btn-close" @click="resetForm"></button>
            </div>

            <div class="modal-body d-flex flex-column gap-3">
              <!-- 카드 수정 -->
              <template v-if="selectedAsset.type === 'card'">
                <div>
                  <label class="form-label">카드 이름</label>
                  <input
                    class="form-control"
                    v-model="selectedAsset.name"
                    required
                  />
                </div>

                <div>
                  <label class="form-label">실적</label>
                  <input
                    type="number"
                    v-model.number="selectedAsset.sales_achievements"
                    class="form-control"
                    min="0"
                    required
                  />
                </div>

                <div>
                  <label class="form-label">연동 계좌</label>
                  <select
                    v-model="selectedAsset.account_id"
                    class="form-select"
                    required
                  >
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

                <div v-if="selectedAsset.isCheck === false">
                  <label class="form-label">결제일 (일 단위)</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    v-model.number="selectedAsset.due_day"
                    class="form-control"
                    required
                  />
                </div>
              </template>

              <!-- 계좌 수정 -->
              <template v-else-if="selectedAsset.type === 'account'">
                <div>
                  <label class="form-label">은행 이름</label>
                  <input
                    class="form-control"
                    v-model="selectedAsset.name"
                    required
                  />
                </div>

                <div>
                  <label class="form-label">초기 자본</label>
                  <input
                    type="number"
                    v-model.number="selectedAsset.balance"
                    class="form-control"
                    min="0"
                    required
                  />
                </div>
              </template>

              <!-- 기타 자산 수정 -->
              <template v-else-if="selectedAsset.type === 'etc'">
                <div>
                  <label class="form-label">기타 자산 이름</label>
                  <input
                    class="form-control"
                    v-model="selectedAsset.name"
                    required
                  />
                </div>

                <div>
                  <label class="form-label">금액</label>
                  <input
                    type="number"
                    v-model.number="selectedAsset.balance"
                    class="form-control"
                    min="0"
                    required
                  />
                </div>
              </template>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary" @click="resetForm">취소</button>
              <button
                class="btn btn-primary"
                :disabled="!isFormValid"
                @click="updateAsset"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAssetStore } from '@/stores/assetStore';
import { useAuthStore } from '@/stores/auth';

const store = useAssetStore();
const auth = useAuthStore();

const userId = computed(() => auth.user?.id);
const showForm = ref(false);
const selectedAsset = ref(null);

const currentUser = computed(() =>
  store.users.find((u) => u.id == userId.value)
);

const allAssets = computed(() => {
  const group = currentUser.value?.asset_group || {};
  return [
    ...(group.card || []).map((a) => ({ ...a, type: 'card' })),
    ...(group.account || []).map((a) => ({ ...a, type: 'account' })),
    ...(group.etc || []).map((a) => ({ ...a, type: 'etc' })),
  ];
});

const selectAsset = (asset) => {
  selectedAsset.value = JSON.parse(JSON.stringify(asset));
  showForm.value = false;
};

const isFormValid = computed(() => {
  const a = selectedAsset.value;
  if (!a) return false;

  if (a.type === 'card') {
    return (
      a.name &&
      a.sales_achievements >= 0 &&
      a.account_id &&
      (a.isCheck || (!a.isCheck && a.due_day >= 1 && a.due_day <= 31))
    );
  } else if (a.type === 'account' || a.type === 'etc') {
    return a.name && a.balance >= 0;
  }
  return false;
});

const updateAsset = async () => {
  if (!userId.value || !selectedAsset.value) return;
  await store.updateAsset(userId.value, selectedAsset.value, () => {
    resetForm();
  });
};

const resetForm = () => {
  showForm.value = false;
  selectedAsset.value = null;
};
</script>

<style scoped>
.list-group-item:hover {
  background-color: #f8f9fa;
}
</style>
