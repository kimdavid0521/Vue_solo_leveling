<template>
  <div class="container">
    <div class="milcho-calendar-container">
      <!-- ✅ 월 요약 -->
      <!-- <div class="text-center my-4"> -->
      <!-- <h4>{{ currentMonth }}</h4> -->

      <!-- 전체 -->
      <!-- <p v-if="pageProps.currentPage === '전체'">
          총합:
          <strong>{{ handleMonthSummary.total.toLocaleString() }}</strong>
          수입:
          {{ handleMonthSummary.income.toLocaleString() }}
          지출:
          {{ handleMonthSummary.expense.toLocaleString() }}
        </p> -->

      <!-- 수입만 -->
      <!-- <p v-else-if="pageProps.currentPage === '수입'">
          총 수입:
          <strong>{{ handleMonthSummary.income.toLocaleString() }}</strong>
        </p> -->

      <!-- 지출만 -->
      <!-- <p v-else-if="pageProps.currentPage === '지출'">
          총 지출:
          <strong>{{ handleMonthSummary.expense.toLocaleString() }}</strong>
        </p> -->
      <!-- </div> -->

      <!-- ✅ 달력 -->
      <FullCalendar
        :options="calendarOptions"
        class="milcho-custom-calendar"
        ref="calendarRef"
        :events="filteredEvents"
        :key="currentPage"
      />

      <!-- ✅ 선택 날짜 상세 -->
      <div class="offcanvas offcanvas-end" id="demo">
        <div class="offcanvas-header">
          <h1 class="offcanvas-title">
            {{ selectedDate }}일의
            {{
              pageProps.currentPage === '수입'
                ? '수입'
                : pageProps.currentPage === '지출'
                ? '지출'
                : '내역'
            }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>
        <div class="offcanvas-body">
          <div v-if="filteredSelectedDateEvents.length === 0">
            <p>
              {{
                pageProps.currentPage === '수입'
                  ? '수입 내역이 없습니다.'
                  : pageProps.currentPage === '지출'
                  ? '지출 내역이 없습니다.'
                  : '내역이 없습니다.'
              }}
            </p>
          </div>

          <ul v-else class="list-group">
            <li
              v-for="event in filteredSelectedDateEvents"
              :key="event.id"
              class="list-group-item d-flex justify-content-between align-items-center"
              :class="{
                'bg-danger': event.type === 'expense',
                'bg-primary': event.type === 'income',
              }"
            >
              <div>
                {{
                  new Date(event.start).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                }}
                - {{ event.name }} : {{ event.amount.toLocaleString() }}원
              </div>
              <div class="btn-group">
                <button
                  class="btn btn-light btn-sm"
                  @click="openEditModal(event)"
                >
                  수정
                </button>
                <button
                  class="btn btn-danger btn-sm"
                  @click="deleteEvent(event.id)"
                >
                  삭제
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 모달 -->
    <!-- ✅ 수정 모달 -->
    <div
      class="modal fade"
      id="editModal"
      tabindex="-1"
      aria-labelledby="editModalLabel"
      aria-hidden="true"
      ref="editModalRef"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="editModalLabel">내역 수정</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label>이름</label>
              <input v-model="editEvent.name" class="form-control" />
            </div>
            <div class="mb-3">
              <label>금액</label>
              <input
                v-model.number="editEvent.amount"
                type="number"
                class="form-control"
              />
            </div>
            <div class="mb-3">
              <label>시간</label>
              <input
                v-model="editEvent.start"
                type="datetime-local"
                class="form-control"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" data-bs-dismiss="modal">
              취소
            </button>
            <button class="btn btn-primary" @click="submitEdit">저장</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect, watch } from 'vue';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid'; // 날짜
import timeGridPlugin from '@fullcalendar/timegrid'; // 시간 그리드 플러그인
import interactionPlugin from '@fullcalendar/interaction';
import { Offcanvas } from 'bootstrap';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import { Modal } from 'bootstrap';

const userAuth = useAuthStore();

const editEvent = ref({
  id: null,
  name: '',
  amount: 0,
  start: '',
});

const editModalRef = ref(null);
let editModalInstance = null;

onMounted(() => {
  editModalInstance = new Modal(editModalRef.value);
});

const openEditModal = (event) => {
  editEvent.value = { ...event };
  editEvent.value.start = new Date(event.start).toISOString().slice(0, 16);
  editModalInstance.show();
};

// 내역 업데이트 함수
const submitEdit = async () => {
  const userId = userAuth.user?.id;
  if (!userId) {
    console.log("유저 정보가 없습니다");
    return;
  }
  try {
    const userResponse = await axios.get(
      `http://localhost:3000/users/${userId}`
    );
    const user = userResponse.data;

    // 해당 트랜잭션 수정
    const updateTransactions = user.transactions.map((t) => {
      if (t.id == editEvent.value.id) {
        return {
          ...t,
          name: editEvent.value.name,
          amount: editEvent.value.amount,
          date: new Date(editEvent.value.start).toISOString().slice(0, 10),
          time: new Date(editEvent.value.start).toTimeString().slice(0, 5),
        };
      }
      return t;
    });

    await axios.patch(`http://localhost:3000/users/${userId}`, {
      transactions: updateTransactions,
    });

    editModalInstance.hide();
    await fetchEvents(); // 이벤트 목록 다시 가져오기
  } catch (err) {
    console.error('수정 실패', err);
  }
};

// 내역 삭제 함수
const deleteEvent = async (transactionId) => {
  const userId = userAuth.user?.id;
  if (!userId) {
    console.log("유저 정보가 없습니다");
    return;
  }

  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const userResponse = await axios.get(
      `http://localhost:3000/users/${userId}`
    );
    const user = userResponse.data;

    // 트랜잭션에서 해당 항목 제거하기
    const updateTransactions = user.transactions.filter(
      (t) => t.id !== transactionId
    );

    // 변경된 transaction으로 patch 요청
    await axios.patch(`http://localhost:3000/users/${userId}`, {
      transactions: updateTransactions,
    });

    await fetchEvents();
  } catch (err) {
    console.error('삭제 실패', err);
  }
};
// 유저 id(정보) 가져오기
const authStore = useAuthStore();

const calendarRef = ref(false);
// 현재 페이지 변수 받아오기
const pageProps = defineProps({
  currentPage: String,
});

const currentDate = ref(new Date());
// 사용자가 클릭한 날짜
const selectedDate = ref('');

const currentMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = String(currentDate.value.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});
const handleDatesSet = (info) => {
  console.log('handledataset', info);
  // 이 값이 바뀌면 month값도 변하게끔 만듬
  const viewDate = info.view.currentStart;
  currentDate.value = new Date(viewDate);
};

// 총 정산 구하는 함수
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

// 총 내역 갯수 구하는 함수
const handleMonthCountSummary = computed(() => {
  const countSummary = { incomeCount: 0, expenseCount: 0 };

  for (const e of events.value) {
    if (e.start.startsWith(currentMonth.value)) {
      countSummary[`${e.type}Count`] += 1;
    }
  }

  return {
    ...countSummary,
    totalCount: countSummary.incomeCount + countSummary.expenseCount,
  };
});

// event 배열구조
// expense: 지출, income: 수입
const events = ref([]);

// 날짜 변경될때마다 일정 api 호출
onMounted(async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      console.log('유저 정보가 없습니다');
      return;
    }
    const response = await axios.get(`http://localhost:3000/users/${userId}`);
    const transData = response.data.transactions;

    const convertedData = transData.map((t) => ({
      ...t,
      start: `${t.date}T${t.time}:00`,
    }));
    const plainData = JSON.parse(JSON.stringify(convertedData));
    events.value = plainData;

    // 캘린더 새로고침시 데이터 받아오기
    if (calendarRef.value) {
      calendarRef.value.getApi().refetchEvents();
    }

    if (selectedDate.value) {
      selectedDateEvents.value = events.value
        .filter((e) => e.start.startsWith(selectedDate.value))
        .sort((a, b) => new Date(a.start) - new Date(b.start));
    }
  } catch (error) {
    console.error('API 연결 에러:', error);
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

  const offcanvasElement = document.getElementById('demo');

  // 기존 인스턴스를 닫고 새로 생성
  if (offcanvasInstance) {
    offcanvasInstance.hide();
  }

  offcanvasInstance = new Offcanvas(offcanvasElement);
  offcanvasInstance.show();
};

const calendarOptions = {
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  headerToolbar: {
    left: 'prev,next',
    center: 'title',
    right: 'today',
    // 월별, 주별, 일별로 보기 버튼
  },
  // views: {
  //   dayGridMonth: {
  //     buttonText: "월별",
  //   },
  //   // timeGridWeek: {
  //   //   buttonText: "주별",
  //   // },
  //   // timeGridDay: {
  //   //   buttonText: "일별",
  //   // },
  // },
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
  height: 'auto',
  datesSet: handleDatesSet,

  eventContent(arg) {
    if (arg.event.extendedProps.isSummary) {
      const { total, incomeTotal, expenseTotal } = arg.event.extendedProps;

      const container = document.createElement('div');
      container.style.fontWeight = 'bold';
      container.style.backgroundColor = 'white';

      const currentPage = pageProps.currentPage;

      if (currentPage === '전체') {
        const totalText = document.createElement('div');
        totalText.style.color = 'black';
        totalText.textContent = `${total >= 0 ? '+' : '-'}${Math.abs(
          total
        ).toLocaleString()}`;

        const incomeText = document.createElement('div');
        incomeText.style.color = 'blue';
        incomeText.textContent = `+${incomeTotal.toLocaleString()}`;

        const expenseText = document.createElement('div');
        expenseText.style.color = 'red';
        expenseText.textContent = `-${expenseTotal.toLocaleString()}`;

        container.appendChild(totalText);
        container.appendChild(incomeText);
        container.appendChild(expenseText);
      } else if (currentPage === '수입') {
        if (incomeTotal > 0) {
          const incomeText = document.createElement('div');
          incomeText.style.color = 'blue';
          incomeText.textContent = `+${incomeTotal.toLocaleString()}`;
          container.appendChild(incomeText);
        }
      } else if (currentPage === '지출') {
        if (expenseTotal > 0) {
          const expenseText = document.createElement('div');
          expenseText.style.color = 'red';
          expenseText.textContent = `-${expenseTotal.toLocaleString()}`;
          container.appendChild(expenseText);
        }
      }

      return { domNodes: [container] };
    }
  },
};

// 총합을 상위 컴포넌트로 전달
const emit = defineEmits(['update-summary']);

// 처음 마운트 되었을때나 값이 변경될때 emit
watchEffect(() => {
  emit('update-summary', {
    summary: handleMonthSummary.value,
    countSummary: handleMonthCountSummary.value,
  });
});

// ✨ 선택된 날짜의 필터링된 수입/지출 이벤트만 보여주기
const filteredSelectedDateEvents = computed(() => {
  if (!selectedDate.value) return [];

  let filtered = selectedDateEvents.value;

  if (pageProps.currentPage === '수입') {
    filtered = filtered.filter((e) => e.type === 'income');
  } else if (pageProps.currentPage === '지출') {
    filtered = filtered.filter((e) => e.type === 'expense');
  }

  return filtered;
});
</script>

<!-- /* .milcho-custom-calendar {
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
} */ -->
<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Noto Sans KR', sans-serif;
}

.milcho-calendar-container {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.text-center h4 {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: bold;
}

.text-center p {
  font-size: 1.1rem;
  margin-bottom: 0;
  color: #666;
}

.text-center strong {
  color: #000;
  font-weight: bold;
}

/* ✅ FullCalendar 스타일 커스터마이징 */
.milcho-custom-calendar {
  margin-top: 1.5rem;
}

.fc-daygrid-event {
  font-size: 0.85rem;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 600;
}

.fc-event-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fc-event {
  border: none;
}

/* ✅ 수입 색상 */
.fc-event.income {
  background-color: #3498db !important;
  color: #fff !important;
}

/* ✅ 지출 색상 */
.fc-event.expense {
  background-color: #e74c3c !important;
  color: #fff !important;
}

/* ✅ Offcanvas 스타일 */
.offcanvas {
  width: 400px;
  background-color: #fff;
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
}

.offcanvas-header {
  background-color: #f0f0f0;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ddd;
}

.offcanvas-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
}

.offcanvas-body {
  padding: 1.5rem;
}

.list-group {
  border-radius: 0.5rem;
  overflow: hidden;
}

.list-group-item {
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  border: none;
  margin-bottom: 0.5rem;
  padding: 0.75rem 1rem;
  transition: transform 0.2s ease;
}

.list-group-item.bg-danger {
  background-color: #e74c3c !important;
}

.list-group-item.bg-primary {
  background-color: #3498db !important;
}

.list-group-item:hover {
  transform: translateX(5px);
}
</style>

<!-- </style> -->
