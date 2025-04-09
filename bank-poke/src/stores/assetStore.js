import { defineStore } from 'pinia';
import { reactive, ref, computed } from 'vue';
import axios from 'axios';

export const useAssetStore = defineStore('mockUser', () => {
  // 서버 주소
  const BASEURI = 'http://localhost:3000';

  // 상태 정의
  const states = reactive({
    users: [],
    bank: [],
    isLoading: false,
  });

  const selectedUserId = ref(null);

  // Getters
  const users = computed(() => states.users);
  const bank = computed(() => states.bank);
  const isLoading = computed(() => states.isLoading);

  // 선택된 사용자 가져오기
  const user = computed(() => {
    return states.users.find((u) => u.id === selectedUserId.value);
  });

  // 사용자 목록 불러오기
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

  // 특정 사용자 데이터 설정
  const getUserData = async (userId) => {
    selectedUserId.value = userId;

    // 이미 유저가 있으면 재요청 없이 끝냄
    if (states.users.length === 0) {
      await fetchUsers();
    }
  };

  // 카드 추가
  const addCard = async (userId, newCard, successCallback) => {
    states.isLoading = true;
    try {
      const user = states.users.find((u) => u.id == userId);
      if (!user) throw new Error('사용자를 찾을 수 없습니다');

      const assetGroup = user.asset_group || {};
      const currentCards = assetGroup.card || [];

      const newCardObj = {
        ...newCard,
        minus_balance: 0,
      };

      const updatedUser = {
        ...user,
        asset_group: {
          ...assetGroup,
          card: [...currentCards, newCardObj],
        },
      };

      const response = await axios.put(
        `${BASEURI}/users/${userId}`,
        updatedUser
      );
      if (response.status === 200) {
        await fetchUsers();
        if (successCallback) successCallback();
      } else {
        alert('카드 추가 실패');
      }
    } catch (error) {
      alert('에러: ' + error.message);
    } finally {
      states.isLoading = false;
    }
  };

  // 계좌 추가
  const addAccount = async (userId, newAccount, successCallback) => {
    states.isLoading = true;
    try {
      const user = states.users.find((u) => u.id == userId);
      if (!user) throw new Error('사용자를 찾을 수 없습니다');

      const assetGroup = user.asset_group || {};
      const currentAccounts = assetGroup.account || [];

      const newAccountObj = {
        ...newAccount,
        type: '은행',
        group: '입출금',
      };

      const updatedUser = {
        ...user,
        asset_group: {
          ...assetGroup,
          account: [...currentAccounts, newAccountObj],
        },
      };

      const response = await axios.put(
        `${BASEURI}/users/${userId}`,
        updatedUser
      );
      if (response.status === 200) {
        await fetchUsers();
        if (successCallback) successCallback();
      } else {
        alert('계좌 추가 실패');
      }
    } catch (error) {
      alert('에러: ' + error.message);
    } finally {
      states.isLoading = false;
    }
  };

  // 기타 자산 추가
  const addEtc = async (userId, newEtc, successCallback) => {
    states.isLoading = true;
    try {
      const user = states.users.find((u) => u.id == userId);
      if (!user) throw new Error('사용자를 찾을 수 없습니다');

      const assetGroup = user.asset_group || {};
      const currentEtc = assetGroup.etc || [];

      const updatedUser = {
        ...user,
        asset_group: {
          ...assetGroup,
          etc: [...currentEtc, newEtc],
        },
      };

      const response = await axios.put(
        `${BASEURI}/users/${userId}`,
        updatedUser
      );
      if (response.status === 200) {
        await fetchUsers();
        if (successCallback) successCallback();
      } else {
        alert('기타 자산 추가 실패');
      }
    } catch (error) {
      alert('에러: ' + error.message);
    } finally {
      states.isLoading = false;
    }
  };

  // 자산 삭제 및 연결된 거래내역 정리
  const deleteAsset = async (userId, assetType, assetId, successCallback) => {
    states.isLoading = true;
    try {
      const user = states.users.find((u) => u.id == userId);
      if (!user) throw new Error('사용자를 찾을 수 없습니다');

      const assetGroup = user.asset_group || {};
      const transactions = user.transactions || [];

      // 자산 삭제
      const updatedAssetGroup = {
        ...assetGroup,
        [assetType]: (assetGroup[assetType] || []).filter(
          (asset) => asset.id !== assetId
        ),
      };

      // 연결된 거래내역 수정
      const updatedTransactions = transactions.map((tx) => {
        if (tx.asset_type === assetType && tx.assetId === assetId) {
          return {
            ...tx,
            asset_type: null,
            assetId: null,
          };
        }
        return tx;
      });

      // 사용자 갱신
      const updatedUser = {
        ...user,
        asset_group: updatedAssetGroup,
        transactions: updatedTransactions,
      };

      const response = await axios.put(
        `${BASEURI}/users/${userId}`,
        updatedUser
      );
      if (response.status === 200) {
        await fetchUsers();
        if (successCallback) successCallback();
      } else {
        alert('자산 삭제 실패');
      }
    } catch (error) {
      alert('에러: ' + error.message);
    } finally {
      states.isLoading = false;
    }
  };

  return {
    // 상태
    users,
    bank,
    isLoading,

    // 선택된 사용자
    user,
    getUserData,

    // 기능
    fetchUsers,
    addCard,
    addAccount,
    addEtc,
    deleteAsset,
  };
});
