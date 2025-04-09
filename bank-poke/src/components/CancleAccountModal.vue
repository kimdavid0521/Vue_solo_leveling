<template>
  <div class="modal fade" id="cancleAccountModal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-4 rounded-4 shadow-sm bg-white text-dark">
        <!-- 모달 헤더 -->
        <div class="modal-header border-0">
          <h5 class="modal-title fw-bold">회원 탈퇴</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
          ></button>
        </div>
        <!-- 모달 바디 -->
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
import * as bootstrap from 'bootstrap'; // ESM import
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

// 유저 이메일 가져오기
const authStore = useAuthStore();
const userEmail = ref(authStore.user.email);

// 모달에서 확인해야 할 문구
const confirmText = userEmail;

const inputValue = ref('');
const router = useRouter();

//모달이 완전히 닫힌 후에 호출될 함수
function onModalHidden() {
  // 혹시 남아 있는 modal-open 클래스/백드롭 제거
  document.body.classList.remove('modal-open');
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) backdrop.remove();

  // 추후 id삭제 기능 추가
  router.push('/');
}

// 회원 탈퇴 버튼 클릭 ㅣㅅ
const cancleAccount = () => {
  // 1) 입력값이 이메일과 다른지 확인
  if (inputValue.value !== confirmText.value) {
    alert('입력한 글자가 일치하지 않습니다.');
    return;
  }

  // 2) 실제 탈퇴처리 로직 (스토어나 서버에 반영 등)
  alert('회원 탈퇴가 완료되었습니다.');

  // 3) 모달 닫기
  const modalEl = document.getElementById('cancleAccountModal');
  const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);

  // 닫히는 순간(‘hidden.bs.modal’)에 라우터 이동
  modalEl.removeEventListener('hidden.bs.modal', onModalHidden);
  modalEl.addEventListener('hidden.bs.modal', onModalHidden);

  modalInstance.hide();
};
</script>
