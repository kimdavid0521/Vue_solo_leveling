import { defineStore } from 'pinia';
import { reactive, computed } from 'vue';
import axios from 'axios';

export const useMockUser = defineStore('mockUser', () => {
  // 서버 주소
  const BASEURI = 'http://localhost:3000';

  // 상태 정의
  const states = reactive({
    users: [],
    bank: [],
    isLoading: false,
  });

  // Getters
  const users = computed(() => states.users); // 사용자 목록
  const bank = computed(() => states.bank); // 은행 목록
  const isLoading = computed(() => states.isLoading); // 로딩 여부

  /** 사용자 목록 불러오기 */
  const fetchUsers = async () => {
    states.isLoading = true;
    try {
      const { data } = await axios.get(`${BASEURI}/users`);
      states.users = data;
    } catch (error) {
      alert('사용자 불러오기 실패: ' + error.message);
    } finally {
      states.isLoading = false;
    }
  };

  /** 은행 목록 불러오기 */
  const fetchBankList = async () => {
    states.isLoading = true;
    try {
      const { data } = await axios.get(`${BASEURI}/bank`);
      states.bank = data;
    } catch (error) {
      alert('은행 목록 불러오기 실패: ' + error.message);
    } finally {
      states.isLoading = false;
    }
  };

  /** 카드 + 계좌 한 번에 추가 */
  const addCardAndAccount = async (
    userId,
    newCard, // { name, sales_achievements }
    newAccount, // { bankId }
    successCallback
  ) => {
    states.isLoading = true;
    try {
      const user = states.users.find((u) => u.id == userId);
      if (!user) throw new Error('사용자를 찾을 수 없습니다');

      const timestamp = Date.now();

      const newCardObj = {
        id: timestamp,
        ...newCard,
        minus_balance: 0,
      };

      const newAccountObj = {
        id: timestamp,
        ...newAccount,
        balance: 0,
        type: '은행',
        group: '입출금',
      };

      const updatedUser = {
        ...user,
        card: [...(user.card || []), newCardObj],
        account: [...(user.account || []), newAccountObj],
      };

      const response = await axios.put(
        `${BASEURI}/users/${userId}`,
        updatedUser
      );
      if (response.status === 200) {
        await fetchUsers();
        if (successCallback) successCallback();
      } else {
        alert('카드 및 계좌 추가 실패');
      }
    } catch (error) {
      alert('에: ' + error.message);
    } finally {
      states.isLoading = false;
    }
  };

  return {
    users,
    bank,
    isLoading,
    fetchUsers,
    fetchBankList,
    addCardAndAccount,
  };
});
