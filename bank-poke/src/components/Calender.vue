<template>
  <div class="container">
    <div class="milcho-calendar-container">
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid"; // 날짜
import timeGridPlugin from "@fullcalendar/timegrid"; // 시간 그리드 플러그인
import interactionPlugin from "@fullcalendar/interaction";
import { Offcanvas } from "bootstrap";
import axios from "axios";

const currentDate = ref(new Date());
// 사용자가 클릭한 날짜
const selectedDate = ref("");

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
const events = ref([]);

// 날짜 변경될때마다 일정 api 호출
onMounted(async () => {
  try {
    const response = await axios.get("http://localhost:3000/users/2");
    const transData = response.data.transactions;

    const convertedData = transData.map((t) => ({
      ...t,
      start: `${t.date}T${t.time}:00`,
    }));
    const plainData = JSON.parse(JSON.stringify(convertedData));
    events.value = plainData;
    if (selectedDate.value) {
      selectedDateEvents.value = events.value
        .filter((e) => e.start.startsWith(selectedDate.value))
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    }
  } catch (error) {
    console.error("API 연결 에러:", error);
  }
});

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

const selectedDateEvents = ref([]);

// 해당 날짜 클릭시 해당 날짜에 속한 지출 내역 시간순으로 정렬 후 출력
let offcanvasInstance = null;

const handleDateClick = (info) => {
  selectedDate.value = info.dateStr;
  selectedDateEvents.value = events.value
    .filter((e) => e.start.startsWith(info.dateStr))
    .sort((a, b) => new Date(a.start) - new Date(b.start));

  const offcanvasElement = document.getElementById("demo");

  // 기존 인스턴스를 닫고 새로 생성
  if (offcanvasInstance) {
    offcanvasInstance.hide();
  }

  offcanvasInstance = new Offcanvas(offcanvasElement);
  offcanvasInstance.show();
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
