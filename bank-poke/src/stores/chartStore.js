import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import { useAuthStore } from '@/stores/auth';
import { useAssetStore } from '@/stores/assetStore';

export const useChartStore = defineStore('chart', () => {
  // 차트 데이터 상태 정의
  const chartData = ref(null);
  const totalExpense = ref(0);
  const averageExpense = ref(0);
  const transactionCount = ref(0);

  const incomeChartData = ref(null);
  const incomeCategorySummary = ref({});
  const expenseChartData = ref(null);
  const expenseCategorySummary = ref({});

  const totalBudget = ref(0);
  const usedPercent = ref(0);
  const remaining = ref(0);

  // 스토어 참조
  const authStore = useAuthStore();
  const assetStore = useAssetStore();

  const userId = computed(() => authStore.user?.id);
  const user = computed(
    () => assetStore.users.find((u) => u.id === userId.value) || null
  );

  // 카테고리 매핑 함수
  const mapToMainCategory = (categories, type) => {
    const map = {};
    categories?.forEach((main) => {
      main.sub_categories.forEach((sub) => {
        map[sub] = main.main_category;
      });
    });
    return map;
  };

  // 컬러 생성 함수
  const generateColors = (count, baseHue) =>
    Array.from(
      { length: count },
      (_, i) => `hsl(${(baseHue + i * 30) % 360}, 100%, 60%)`
    );

  // 데이터 필터링 함수
  const filterTransactions = (type, year, month) => {
    return (user.value?.transactions ?? []).filter((tx) => {
      const date = dayjs(tx.date);
      return tx.type === type && date.year() === year && date.month() === month;
    });
  };

  // 수입 차트 생성
  const fetchIncomeData = async (year, month) => {
    try {
      const filtered = filterTransactions('income', year, month);
      const map = mapToMainCategory(user.value?.category?.income);

      const mainTotals = {};
      filtered.forEach((tx) => {
        const main = map[tx.category] || tx.category;
        mainTotals[main] = (mainTotals[main] || 0) + tx.amount;
      });
      incomeCategorySummary.value = mainTotals;

      const labels = Object.keys(mainTotals);
      const data = Object.values(mainTotals);
      incomeChartData.value =
        labels.length && data.some((val) => val > 0)
          ? {
              labels,
              datasets: [
                {
                  label: '수입 금액',
                  data,
                  backgroundColor: generateColors(labels.length, 200),
                  borderWidth: 0,
                },
              ],
            }
          : {
              labels: ['수입 없음'],
              datasets: [
                {
                  label: '수입 금액',
                  data: [1],
                  backgroundColor: ['#d3d3d3'],
                  borderWidth: 0,
                },
              ],
            };
    } catch (err) {
      console.error('수입 데이터 로딩 실패:', err);
    }
  };

  // 지출 차트 생성
  const fetchExpenseData = async (year, month) => {
    try {
      const filtered = filterTransactions('expense', year, month);
      const map = mapToMainCategory(user.value?.category?.expense);

      totalExpense.value = filtered.reduce((sum, tx) => sum + tx.amount, 0);
      transactionCount.value = filtered.length;
      averageExpense.value = transactionCount.value
        ? Math.round(totalExpense.value / transactionCount.value)
        : 0;

      const mainTotals = {};
      filtered.forEach((tx) => {
        const main = map[tx.category] || tx.category;
        mainTotals[main] = (mainTotals[main] || 0) + tx.amount;
      });
      expenseCategorySummary.value = mainTotals;

      const labels = Object.keys(mainTotals);
      const data = Object.values(mainTotals);
      expenseChartData.value =
        labels.length && data.some((val) => val > 0)
          ? {
              labels,
              datasets: [
                {
                  label: '지출 금액',
                  data,
                  backgroundColor: generateColors(labels.length, 300),
                },
              ],
            }
          : {
              labels: ['지출 없음'],
              datasets: [
                { label: '지출 금액', data: [1], backgroundColor: ['#d3d3d3'] },
              ],
            };
    } catch (err) {
      console.error('지출 데이터 로딩 실패:', err);
    }
  };

  // 예산 데이터 계산
  const fetchBudgetData = async (year, month) => {
    try {
      const budgetObj = user.value?.setting?.[0]?.monthlyBudget ?? {};
      const monthStr = dayjs(`${year}-${month + 1}-01`).format('MMM');
      const budget = budgetObj[monthStr] || 0;
      totalBudget.value = budget;

      const expenses = filterTransactions('expense', year, month);
      const total = expenses.reduce((sum, tx) => sum + tx.amount, 0);

      usedPercent.value =
        budget > 0 ? Math.min(100, Math.round((total / budget) * 100)) : 0;
      remaining.value = Math.max(0, budget - total);
    } catch (err) {
      console.error('예산 정보 로딩 실패:', err);
    }
  };

  // 일별 지출 차트 생성
  const fetchDailyExpenseData = async (year, month) => {
    try {
      const filtered = filterTransactions('expense', year, month);
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dailyTotals = Array(daysInMonth).fill(0);

      filtered.forEach((tx) => {
        const day = dayjs(tx.date).date();
        dailyTotals[day - 1] += tx.amount;
      });

      chartData.value = {
        labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}일`),
        datasets: [
          {
            label: '지출',
            data: dailyTotals,
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.2)',
            tension: 0.3,
            fill: true,
          },
        ],
      };

      totalExpense.value = filtered.reduce((sum, tx) => sum + tx.amount, 0);
      transactionCount.value = filtered.length;
      averageExpense.value = transactionCount.value
        ? Math.round(totalExpense.value / transactionCount.value)
        : 0;
    } catch (err) {
      console.error('일별 지출 데이터 로딩 실패:', err);
    }
  };

  // 외부로 반환
  return {
    chartData,
    totalExpense,
    averageExpense,
    transactionCount,
    incomeChartData,
    incomeCategorySummary,
    expenseChartData,
    expenseCategorySummary,
    totalBudget,
    usedPercent,
    remaining,
    fetchIncomeData,
    fetchExpenseData,
    fetchBudgetData,
    fetchDailyExpenseData,
  };
});
