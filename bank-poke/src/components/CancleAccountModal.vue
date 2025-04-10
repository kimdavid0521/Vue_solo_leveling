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
        <!-- 모달 푸터 -->
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

// 회원 탈퇴 버튼 클릭 시
const cancleAccount = async () => {
  if (inputValue.value !== confirmText.value) {
    alert('입력한 글자가 일치하지 않습니다.');
    return;
  }

  try {
    // 1단계: 이메일로 유저 검색
    const res = await fetch(`/api/users?email=${confirmText.value}`);
    const users = await res.json();

    if (!users.length) {
      alert('해당 이메일의 사용자를 찾을 수 없습니다.');
      return;
    }

    const userId = users[0].id;

    // 2단계: 삭제 요청
    await fetch(`/api/users/${userId}`, {
      method: 'DELETE',
    });

    // 3단계: 스토어 정리
    authStore.clearUser();

    alert('회원 탈퇴가 완료되었습니다.');

    // 4단계: 모달 닫기
    const modalEl = document.getElementById('cancleAccountModal');
    const modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);

    modalEl.removeEventListener('hidden.bs.modal', onModalHidden);
    modalEl.addEventListener('hidden.bs.modal', onModalHidden);

    modalInstance.hide();
  } catch (err) {
    console.error('탈퇴 실패:', err);
    alert('탈퇴 중 문제가 발생했습니다.');
  }
};
</script>
