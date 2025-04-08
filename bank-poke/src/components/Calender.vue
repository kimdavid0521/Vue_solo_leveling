<template>
  <div class="container">
    <v-container class="milcho-calendar-container">
      <div class="text-center my-4">
        <h4>{{ currentMonth }}</h4>
        <p>
          총합:
          <strong>
            {{ handleMonthSummary.total.toLocaleString() }}
          </strong>
          수입:
          {{ handleMonthSummary.income.toLocaleString() }}
          지출:
          {{ handleMonthSummary.expense.toLocaleString() }}
        </p>
      </div>
      <FullCalendar
        :options="calendarOptions"
        class="milcho-custom-calendar"
        ref="calendarRef"
        :events="summarizedEvent"
      />       

      <div class="offcanvas offcanvas-end" id="demo">
        <div class="offcanvas-header">
          <h1 class="offcanvas-title">{{ selectedDate }}일의 지출 내역</h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div class="offcanvas-body">
          <!-- 선택된 날짜의 지출 내역이 없으면 해당 목록 반환 -->
          <div v-if="selectedDateEvents.length === 0">
            <p>지출 내역이 없습니다.</p>
          </div>
          <ul v-else class="list-group">
            <li
              class="list-group-item"
              v-for="event in selectedDateEvents"
              :key="event.id"
              :class="{
                'bg-danger': event.type === 'expense',
                'bg-primary': event.type === 'income',
              }"
            >
              {{
                new Date(event.start).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              }}
              - {{ event.name }} : {{ event.amount.toLocaleString() }}원
            </li>
          </ul>

          <!-- 지출 추가 버튼을 그냥 해당 날짜에 둠 -->
          <!-- 이게 더 보기 직관적이고 날짜를 설정할때 편할것같음 -->
          <button class="btn btn-primary mt-3" @click="addExpense">
            지출 추가
          </button>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid"; // 날짜
import timeGridPlugin from "@fullcalendar/timegrid"; // 시간 그리드 플러그인
import interactionPlugin from "@fullcalendar/interaction";
import { Offcanvas } from "bootstrap";
import AddExpenseModal from "../components/AddExpenseModal.vue";

const showModal = ref(false);

const saveExpense = (expense) => {
  console.log(expense);
};
const currentDate = ref(new Date());

const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = String(currentDate.value.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
});
const handleDatesSet = (info) => {
  console.log("handledataset", info);
  // 이 값이 바뀌면 month값도 변하게끔 만듬
  const viewDate = info.view.currentStart;
  currentDate.value = new Date(viewDate);
};

const handleMonthSummary = computed(() => {
  const summary = { income: 0, expense: 0 };

  for (const e of events.value) {
    if (e.start.startsWith(currentMonth.value)) {
      summary[e.type] += e.amount;
    }
  }

  return {
    ...summary,
    total: summary.income - summary.expense,
  };
});
// event 배열구조
// expense: 지출, income: 수입
const events = ref([
  {
    id: 1,
    name: "아빠 용돈",
    start: "2025-04-10T09:30:00",
    amount: 10000,
    type: "income",
    memo: "아빠한테 받은 용돈",
  },
  {
    id: 2,
    name: "점심",
    start: "2025-04-10T12:00:00",
    amount: 12000,
    type: "expense",
    memo: "점심 먹음",
  },
  {
    id: 3,
    name: "점심 값 제공",
    start: "2025-04-10T12:00:00",
    amount: 12000,
    type: "income",
    memo: "점심값 제공받음",
  },
  {
    id: 4,
    name: "편의점",
    start: "2025-04-12T20:30:00",
    amount: 3000,
    type: "expense",
    memo: "편의점 다녀옴",
  },
]);

// 월별 총합 금액 추출
// const monthSummarized = computed(() => {
//   const monthSummaryMap = new Map();
//   for (const event of events.value) {
//     const month = event.start.slice(0, 7); // 일별로 나누기
//     if (!monthSummaryMap.has(month)) {
//       monthSummaryMap.set(month, { income: 0, expense: 0 });
//     }
//     monthSummaryMap.get(month)[event.type] += event.amount;
//   }

//   return monthSummaryMap;
// });

//

// eventContent는 이벤트 하나에대해 한번씩만 실행되므로 3개의 지출이 있다면 함수가 3번이 실행돼서
// 현실적으로 총합계산이 불가능
const summarizedEvent = computed(() => {
  const summaryMap = new Map();

  for (const event of events.value) {
    const date = event.start.slice(0, 10); // 일별로 나누기
    if (!summaryMap.has(date)) {
      summaryMap.set(date, { income: 0, expense: 0 });
    }
    summaryMap.get(date)[event.type] += event.amount;
  }

  const summaryEvents = Array.from(summaryMap.entries()).map(([date, sums]) => {
    const total = sums.income - sums.expense;
    const incomeTotal = sums.income;
    const expenseTotal = sums.expense;

    return {
      id: `summary-${date}`,
      start: `${date}T00:00:00`,
      allDay: true,
      extendedProps: {
        total,
        incomeTotal,
        expenseTotal,
        isSummary: true,
      },
    };
  });

  return [...events.value, ...summaryEvents];
});

// 사용자가 클릭한 날짜
const selectedDate = ref("");

// 클릭한 날짜의 지출 내역
const selectedDateEvents = ref([]);

// 해당 날짜 클릭시 해당 날짜에 속한 지출 내역 시간순으로 정렬 후 출력
const handleDateClick = (info) => {
  selectedDate.value = info.dateStr;
  selectedDateEvents.value = events.value
    // 날짜 필터링 (dateStr은 클릭된 날짜 문자열 ex 2025-04-10)
    .filter((e) => e.start.startsWith(info.dateStr))
    // 일정 시간순으로 필터링
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  // 직접 부트스트랩 canvas열기
  const offcanvasElement = document.getElementById("demo");
  const offcanvasInstance = new Offcanvas(offcanvasElement);
  offcanvasInstance.show();
};

// 현재까지의 지출 id
let nextId = Math.max(...events.value.map((e) => e.id)) + 1;
// 지출 내역 추가 함수
const addExpense = () => {
  const time = prompt("시간 예(13:30)");
  const name = prompt("지출 이름:");
  const amount = parseInt(prompt("금액:"), 10);
  const type = prompt("지출: expense, 수입: income");
  const memo = prompt("지출 내역 메모");

  if (time && name && amount) {
    const start = `${selectedDate.value}T${time}:00`;
    events.value.push({
      id: nextId++,
      name,
      start,
      amount,
      type,
      memo,
    });

    // 목록 추가 후 다시 최신화(필터링)
    selectedDateEvents.value = events.value
      .filter((e) => e.start.startsWith(selectedDate.value))
      .sort((a, b) => new Date(a.start) - new Date(b.start));
  }
};

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    // 월별, 주별, 일별로 보기 버튼
    right: "dayGridMonth, timeGridWeek, timeGridDay",
  },
  views: {
    dayGridMonth: {
      buttonText: "월별",
    },
    timeGridWeek: {
      buttonText: "주별",
    },
    timeGridDay: {
      buttonText: "일별",
    },
  },
  // eventClick: handleEventClick,
  // 날짜 셀 클릭 이벤트를 dateClick으로 설정
  // 사용자가 날짜 클릭하면 해당 함수 실행
  dateClick: handleDateClick,
  // 원래 켈린더 옵션 안에 event 프로퍼티로 설정되어 보여지지만 굳이 이렇게 하는 이유는 우리가 만든 events배열을 여기에 배열로 넘기려하면
  // 리액티브하지 않는 문제가 발생하여 함수로 넘겨줌
  events: function (fetchInfo, successCallback, failureCallback) {
    // 현재 저장된 events를 넘겨줌
    successCallback(summarizedEvent.value);
  },

  dayMaxEvents: false,
  dayMaxEventRows: false,
  height: "auto",
  datesSet: handleDatesSet,
  // eventContent를 통해서 각 이벤트의 렌더링 방식 직접 지정 가능
  // eventContent: function (arg) {
  //   const title = arg.event.extendProps.name;
  //   const amount = arg.event.extendedProps.amount;

  //   //html 리턴
  //   return {
  //     html: `
  //     <div class="custom-event">
  //       <strong>${title}</strong><br/>
  //       <span class="amount">${amount.toLocaleString()}원</span>
  //       </div>
  //       `,
  //   };
  // },
  eventContent(arg) {
    // 총합 이벤트인 경우
    if (arg.event.extendedProps.isSummary) {
      const { total, incomeTotal, expenseTotal } = arg.event.extendedProps;

      // 총합계
      const container = document.createElement("div");
      container.style.fontWeight = "bold";
      container.style.backgroundColor = "white";
      const totalText = document.createElement("div");
      totalText.style.color = "black";
      totalText.textContent = `${total >= 0 ? "+" : "-"}${Math.abs(
        total
      ).toLocaleString()}`;

      // 총 수입
      const incomeText = document.createElement("div");
      incomeText.style.color = "blue";
      incomeText.textContent = `+${incomeTotal.toLocaleString()}`;

      // 총 지출
      const expenseText = document.createElement("div");
      expenseText.style.color = "red";
      expenseText.textContent = `-${expenseTotal.toLocaleString()}`;

      container.appendChild(totalText);
      container.appendChild(incomeText);
      container.appendChild(expenseText);

      return { domNodes: [container] };
    }
  },
};
</script>

<style scoped>
.milcho-custom-calendar {
  max-width: 800px;
  height: 600px;
  margin: 0 auto;
}
.fc-event {
  max-height: 25px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.custom-event {
  max-height: 25px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
