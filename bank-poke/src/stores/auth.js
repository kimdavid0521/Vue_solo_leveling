// stores/auth.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null, // ✅ 초기값에 localStorage
  }),
  actions: {
    setUser(userData) {
      this.user = userData;
      localStorage.setItem('user', JSON.stringify(userData)); // 자동 저장
    },
    clearUser() {
      this.user = null;
      localStorage.removeItem('user');
    },
  },
});
