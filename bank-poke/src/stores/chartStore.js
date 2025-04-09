import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import dayjs from 'dayjs';

export const useChartStore = defineStore('chart', () => {
  const userId = 1;

  // 기존 상태
  const chartData = ref(null);
  const totalExpense = ref(0);
  const averageExpense = ref(0);
  const transactionCount = ref(0);

  // 새로운 상태
  const incomeChartData = ref(null);
  const incomeCategorySummary = ref({});
  const expenseChartData = ref(null);
  const expenseCategorySummary = ref({});

  const totalBudget = ref(0);
  const usedPercent = ref(0);
  const remaining = ref(0);

  function generateDynamicColors(count, baseHue) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (baseHue + i * 30) % 360; // 기본 색상에서 일정 간격으로 색상 분배
      colors.push(`hsl(${hue}, 100%, 60%)`);
    }
    return colors;
  }

  // 수입 데이터 가져오기
  async function fetchIncomeData(year, month) {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      const transactions = res.data.transactions ?? [];
      const incomeCategories = res.data.category?.income ?? [];

      const subToMainMap = {};
      incomeCategories.forEach((main) => {
        main.sub_categories.forEach((sub) => {
          subToMainMap[sub] = main.main_category;
        });
      });

      const filtered = transactions.filter((tx) => {
        const date = dayjs(tx.date);
        return (
          tx.type === 'income' && date.year() === year && date.month() === month
        );
      });

      const mainTotals = {};
      filtered.forEach((tx) => {
        const mainCategory = subToMainMap[tx.category] || tx.category;
        if (!mainTotals[mainCategory]) {
          mainTotals[mainCategory] = 0;
        }
        mainTotals[mainCategory] += tx.amount;
      });

      incomeCategorySummary.value = mainTotals;

      const labels = Object.keys(mainTotals);
      const data = Object.values(mainTotals);
      const hasData = labels.length > 0 && data.some((val) => val > 0);

      incomeChartData.value = hasData
        ? {
            labels,
            datasets: [
              {
                label: '수입 금액',
                data,
                backgroundColor: generateDynamicColors(labels.length, 200),
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
      incomeChartData.value = {
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
      incomeCategorySummary.value = {};
    }
  }

  // 카테고리별 지출 데이터 가져오기
  async function fetchExpenseData(year, month) {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      const transactions = res.data.transactions ?? [];
      const expenseCategories = res.data.category?.expense ?? [];

      const subToMainMap = {};
      expenseCategories.forEach((main) => {
        main.sub_categories.forEach((sub) => {
          subToMainMap[sub] = main.main_category;
        });
      });

      const filtered = transactions.filter((tx) => {
        const date = dayjs(tx.date);
        return (
          tx.type === 'expense' &&
          date.year() === year &&
          date.month() === month
        );
      });

      totalExpense.value = filtered.reduce((sum, tx) => sum + tx.amount, 0);
      transactionCount.value = filtered.length;
      averageExpense.value = transactionCount.value
        ? Math.round(totalExpense.value / transactionCount.value)
        : 0;

      const mainTotals = {};
      filtered.forEach((tx) => {
        const mainCategory = subToMainMap[tx.category] || tx.category;
        if (!mainTotals[mainCategory]) {
          mainTotals[mainCategory] = 0;
        }
        mainTotals[mainCategory] += tx.amount;
      });

      expenseCategorySummary.value = mainTotals;

      const labels = Object.keys(mainTotals);
      const data = Object.values(mainTotals);
      const hasData = labels.length > 0 && data.some((val) => val > 0);

      expenseChartData.value = hasData
        ? {
            labels,
            datasets: [
              {
                label: '지출 금액',
                data,
                backgroundColor: generateDynamicColors(labels.length, 300),
              },
            ],
          }
        : {
            labels: ['지출 없음'],
            datasets: [
              {
                label: '지출 금액',
                data: [1],
                backgroundColor: ['#d3d3d3'],
              },
            ],
          };
    } catch (err) {
      console.error('카테고리 지출 로딩 실패:', err);
      expenseChartData.value = {
        labels: ['지출 없음'],
        datasets: [
          {
            label: '지출 금액',
            data: [1],
            backgroundColor: ['#d3d3d3'],
          },
        ],
      };
      totalExpense.value = 0;
      averageExpense.value = 0;
      transactionCount.value = 0;
      expenseCategorySummary.value = {};
    }
  }

  async function fetchBudgetData(year, month) {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      const user = res.data;
      const budgetObj = user.setting?.[0]?.monthlyBudget ?? {};
      const monthStr = dayjs(`${year}-${month + 1}-01`).format('MMM');
      const budget = budgetObj[monthStr] || 0;
      totalBudget.value = budget;

      const transactions = user.transactions ?? [];

      const monthlyExpenses = transactions
        .filter((tx) => {
          const date = dayjs(tx.date);
          return (
            tx.type === 'expense' &&
            date.year() === year &&
            date.month() === month
          );
        })
        .reduce((sum, tx) => sum + tx.amount, 0);

      const percent =
        budget > 0
          ? Math.min(100, Math.round((monthlyExpenses / budget) * 100))
          : 0;
      const remain = Math.max(0, budget - monthlyExpenses);

      usedPercent.value = percent;
      remaining.value = remain;
    } catch (err) {
      console.error('예산 정보 로딩 실패:', err);
      usedPercent.value = 0;
      remaining.value = 0;
      totalBudget.value = 0;
    }
  }

  async function fetchDailyExpenseData(year, month) {
    try {
      const res = await axios.get(`/api/users/${userId}`);
      const transactions = res.data.transactions ?? [];

      const daysInMonth = dayjs(`${year}-${month + 1}`).daysInMonth();
      const dailyTotals = Array(daysInMonth).fill(0);

      const filtered = transactions.filter((tx) => {
        const date = dayjs(tx.date);
        return (
          tx.type === 'expense' &&
          date.year() === year &&
          date.month() === month
        );
      });

      // 분석용 데이터 계산
      totalExpense.value = filtered.reduce((sum, tx) => sum + tx.amount, 0);
      transactionCount.value = filtered.length;
      averageExpense.value = transactionCount.value
        ? Math.round(totalExpense.value / transactionCount.value)
        : 0;

      // 일별 누적 계산
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
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      const daysInMonth = dayjs(`${year}-${month + 1}`).daysInMonth();

      chartData.value = {
        labels: Array.from({ length: daysInMonth }, (_, i) => `${i + 1}일`),
        datasets: [
          {
            label: '지출',
            data: Array(daysInMonth).fill(0),
            borderColor: '#0d6efd',
            backgroundColor: 'rgba(13, 110, 253, 0.2)',
            tension: 0.3,
            fill: true,
          },
        ],
      };

      // 실패 시 분석값 초기화
      totalExpense.value = 0;
      averageExpense.value = 0;
      transactionCount.value = 0;
    }
  }

  return {
    chartData,
    totalExpense,
    averageExpense,
    transactionCount,
    incomeChartData,
    incomeCategorySummary,
    expenseChartData,
    expenseCategorySummary,
    fetchIncomeData,
    fetchExpenseData,
    fetchBudgetData,
    fetchDailyExpenseData,
    totalBudget,
    usedPercent,
    remaining,
  };
});
