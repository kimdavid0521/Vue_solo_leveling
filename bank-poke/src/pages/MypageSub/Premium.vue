<template>
  <div class="container">
    <!-- 플랜 업그레이드 -->
    <div class="container my-5 text-dark">
      <h2 class="text-center fw-bold mb-4">플랜 업그레이드</h2>

      <!-- 플랜 카드 -->
      <div class="row justify-content-center text-start">
        <!-- Free Plan -->
        <div class="col-md-5 p-4 m-2 plan-card">
          <h4 class="fw-bold plan-title">Free</h4>
          <h2 class="fw-bold plan-price">
            0원 <small class="text-muted fs-6">/월</small>
          </h2>
          <button
            class="btn w-100 mb-3"
            :class="
              authStore.user?.isPremium
                ? 'btn-outline-dark'
                : 'btn-outline-secondary'
            "
            :disabled="!authStore.user || !authStore.user.isPremium"
            @click="registerFree"
          >
            {{ authStore.user?.isPremium ? "Free 이용하기" : "나의 현재 플랜" }}
          </button>
          <ul class="list-unstyled">
            <li>✔️ 거래 내역 입력</li>
            <li>✔️ 거래 내역 보기</li>
            <li>✔️ 예산 설정</li>
          </ul>
        </div>

        <!-- Pro Plan -->
        <div class="col-md-5 p-4 m-2 plan-card">
          <h4 class="fw-bold plan-title">Pro</h4>
          <h2 class="fw-bold plan-price">
            1,000원 <small class="text-muted fs-6">/월</small>
          </h2>
          <button
            class="btn w-100 mb-3"
            :class="
              authStore.user?.isPremium ? 'btn-outline-secondary' : 'btn-dark'
            "
            :disabled="authStore.user?.isPremium"
            data-bs-toggle="modal"
            data-bs-target="#paymentModal"
          >
            {{ authStore.user?.isPremium ? "나의 현재 플랜" : "Pro 이용하기" }}
          </button>
          <ul class="list-unstyled">
            <li>✔️ 거래 내역 입력</li>
            <li>✔️ 거래 내역 보기</li>
            <li>✔️ 예산 설정</li>
            <li>✔️ 분석 자료 및 그래프 제공</li>
            <li>✔️ 거래 내역 CSV 파일 제공</li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <ProPaymentModal />
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import ProPaymentModal from "@/components/ProPaymentModal.vue";
const authStore = useAuthStore();

const registerFree = async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      console.error("유저 정보가 없습니다.");
      return;
    }

    const userRes = await fetch(`/api/users/${userId}`);
    const freshUser = await userRes.json();

    // 유저 상태 업데이트 (프론트엔드)
    authStore.setUser({ ...freshUser, isPremium: false });

    // 백엔드(DB)에도 업데이트 요청 보내기 (json-server 등 사용 시)
    await fetch(`/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isPremium: false }),
    });
  } catch (error) {
    console.error("무료 등록 중 오류 발생:", error);
  }
};
</script>

<style scoped>
.container {
  padding: 3rem;
  border-radius: 1rem;
}

/* 플랜 카드 공통 스타일 */
.plan-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 1.2rem;
  border: 2px solid #eee;
  background-color: white;
  padding: 2rem;
  min-height: 350px;
}

.plan-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

/* 플랜명 */
.plan-title {
  font-size: 1.3rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #2b2b2b;
}

/* 가격 */
.plan-price {
  font-size: 2rem;
  font-weight: bold;
  color: #2b2b2b;
  margin-bottom: 1.5rem;
}

/* 기능 리스트 */
.plan-card ul {
  padding-left: 1rem;
  font-size: 0.95rem;
  color: #555;
}

/* 버튼 상태 */
.btn-outline-secondary {
  border-color: #ccc;
  color: #555;
}

.btn-outline-secondary:hover {
  background-color: #eee;
  color: #333;
}

.btn-dark {
  background-color: #2b2b2b;
  color: white;
  font-weight: bold;
}

.btn-dark:hover {
  background-color: #1f1f1f;
}

.btn-outline-dark {
  border-color: #2b2b2b;
  color: #2b2b2b;
}

.btn-outline-dark:hover {
  background-color: #2b2b2b;
  color: white;
}

/* 반응형 스타일 */
@media (max-width: 768px) {
  .plan-card {
    margin-bottom: 2rem;
    padding: 1.5rem;
  }

  .plan-title {
    font-size: 1.1rem;
  }

  .plan-price {
    font-size: 1.6rem;
  }

  .plan-card ul {
    font-size: 0.9rem;
  }

  .btn {
    font-size: 0.9rem;
    padding: 0.6rem 1rem;
  }
}
</style>
