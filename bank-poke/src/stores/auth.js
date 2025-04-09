// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // 로그인한 사용자 정보
  }),
  // 로그인한 사용자 정보 설정
  actions: {
    setUser(userData) {
      this.user = userData;
    },
    clearUser() {
      this.user = null;
    },
  },
});
