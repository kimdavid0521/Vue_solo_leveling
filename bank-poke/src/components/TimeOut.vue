<template>
  <div>
    <h2>{{ minutes }}분 {{ seconds }}초 후 로그아웃</h2>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from 'vue-router';
// 타이머 초기 시간 설정
const props = defineProps({
  initialTime: {
    type: Number,
    default: 60 * 60, // 60분 (초 단위)
  },
});

// 타이머 시간 계산
const totalTime = ref(props.initialTime);
const timer = ref(null);
const router = useRouter();

const minutes = computed(() => Math.floor(totalTime.value / 60));
const seconds = computed(() => totalTime.value % 60);

// 타이머 시작
const startTimer = () => {
  timer.value = setInterval(() => {
    if (totalTime.value > 0) {
      totalTime.value--;
    }

    if (totalTime.value === 0) {
      clearInterval(timer.value);
      alert('시간이 만료되었습니다.');
      router.push('/');
    }
  }, 1000);
};
// 타이머 시작
onMounted(() => {
  startTimer();
});

// 타이머 종료
onUnmounted(() => {
  clearInterval(timer.value);
});
</script>
