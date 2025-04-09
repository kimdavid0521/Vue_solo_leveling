<!-- MinusAsset.vue -->
<template>
  <div>
    <button
      class="btn btn-outline-danger rounded-circle mb-1 d-flex justify-content-center align-items-center"
      style="width: 3em; height: 3em"
      @click="showForm = true"
    >
      -
    </button>
  </div>

  <!-- 자산 목록 모달 -->
  <teleport to="body">
    <div
      v-if="showForm"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: transparent"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title">자산 삭제</h5>
            <button class="btn-close" @click="showForm = false"></button>
          </div>
          <div class="modal-body">
            <p>삭제할 자산을 선택하세요:</p>
            <ul class="list-group">
              <li
                v-for="asset in allAssets"
                :key="asset.id"
                class="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                @click="confirmDelete(asset)"
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

  <!-- 삭제 확인 모달 -->
  <teleport to="body">
    <div
      v-if="confirmAsset"
      class="modal fade show d-block"
      tabindex="-1"
      style="background-color: transparent"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content p-3">
          <div class="modal-header">
            <h5 class="modal-title">삭제 확인</h5>
            <button class="btn-close" @click="confirmAsset = null"></button>
          </div>
          <div class="modal-body">
            <p>
              정말로 <strong>{{ confirmAsset.name }}</strong> 자산을
              삭제하시겠습니까?
            </p>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="confirmAsset = null">
              취소
            </button>
            <button class="btn btn-danger" @click="deleteAsset">삭제</button>
          </div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAssetStore } from '@/stores/assetStore';

const store = useAssetStore();
const userId = 1;

const showForm = ref(false);
const confirmAsset = ref(null);

const currentUser = computed(() => store.users.find((u) => u.id == userId));

const allAssets = computed(() => {
  const group = currentUser.value?.asset_group || {};
  return [
    ...(group.card || []).map((a) => ({ ...a, type: 'card' })),
    ...(group.account || []).map((a) => ({ ...a, type: 'account' })),
    ...(group.etc || []).map((a) => ({ ...a, type: 'etc' })),
  ];
});

const confirmDelete = (asset) => {
  confirmAsset.value = asset;
};

const deleteAsset = async () => {
  const asset = confirmAsset.value;
  if (!asset) return;

  // 자산 삭제 및 연결된 거래 내역 정리
  await store.deleteAsset(userId, asset.type, asset.id);

  // 초기화
  confirmAsset.value = null;
  showForm.value = false;
};
</script>
