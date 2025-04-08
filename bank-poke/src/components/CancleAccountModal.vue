<template>
  <div class="modal fade" id="cancleAccountModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-4 rounded-4 shadow-sm bg-white text-dark">
        <div class="modal-header border-0">
          <h5 class="modal-title fw-bold">회원 탈퇴</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>

        <div class="modal-body">
          <p>삭제를 위해, "{{ confirmText }}" 안의 글자를 입력하세요.</p>
          <input
            type="text"
            class="form-control"
            v-model="inputValue"
            placeholder="Type here to confirm"
          />
        </div>

        <div class="modal-footer border-0">
          <button
            class="btn btn-danger w-100"
            :disabled="inputValue !== confirmText"
            @click="cancleAccount"
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import * as bootstrap from 'bootstrap'; // ESM 방식 import
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// props나 Pinia로 유저 이메일 받아온다 가정
const authStore = useAuthStore();
const userEmail = ref(authStore.user.email);

// 입력해야 할 문자열
const confirmText = userEmail;

// 사용자가 입력한 문자열
const inputValue = ref('');

// 라우터
const router = useRouter();

// 모달이 완전히 닫힌 뒤에 라우터 이동하는 핸들러
function onModalHidden() {
  console.log('✅ 모달이 완전히 닫혔음. → /로 이동');
  router.push('/');
}

const cancleAccount = () => {
  if (inputValue.value !== confirmText.value) {
    alert('입력한 글자가 일치하지 않습니다.');
    return;
  }

  // 실제 탈퇴 로직(예: fetch API)도 여기에 붙이면 됨
  alert('회원 탈퇴가 완료되었습니다.');

  // 모달 요소/인스턴스 참조
  const modalEl = document.getElementById('cancleAccountModal');
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);

  // 혹시 이전에 등록된 이벤트 핸들러가 있을 수 있으니 제거
  modalEl.removeEventListener('hidden.bs.modal', onModalHidden);

  // 모달이 "완전히" 닫힌 뒤(애니메이션 끝) 이벤트 발생 → 이동
  modalEl.addEventListener('hidden.bs.modal', onModalHidden, { once: true });

  // 모달 닫기
  modalInstance.hide();
};
</script>
