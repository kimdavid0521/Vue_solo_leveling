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

      <div class="offcanvas offcanvas-end" id="demo">
        <div class="offcanvas-header">
          <h1 class="offcanvas-title">
            <i class="fa-solid fa-calendar-days me-2"></i>
            {{ selectedDate }}일의
            {{
              pageProps.currentPage === "수입"
                ? "수입"
                : pageProps.currentPage === "지출"
                ? "지출"
                : "내역"
            }}
          </h1>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="offcanvas"
          ></button>
        </div>

        <div class="offcanvas-body">
          <div
            v-if="filteredSelectedDateEvents.length === 0"
            class="no-events-message"
          >
            <p>
              <i class="fas fa-info-circle me-2"></i>
              {{
                pageProps.currentPage === "수입"
                  ? "수입 내역이 없습니다."
                  : pageProps.currentPage === "지출"
                  ? "지출 내역이 없습니다."
                  : "내역이 없습니다."
              }}
            </p>
          </div>

          <ul v-else class="event-list">
            <li
              v-for="event in filteredSelectedDateEvents"
              :key="event.id"
              class="event-card"
              :class="{
                income: event.type === 'income',
                expense: event.type === 'expense',
              }"
            >
              <div class="event-content">
                <div class="event-time">
                  <i class="fas fa-clock me-1"></i>
                  {{
                    new Date(event.start).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }}
                </div>
                <div class="event-detail">
                  <span class="fw-bold">{{ event.name }}</span>
                  <span class="event-amount">
                    {{ event.amount.toLocaleString() }}원
                  </span>
                </div>
              </div>

              <div class="event-actions">
                <button class="btn btn-outline-secondary btn-sm" disabled>
                  {{ event.sub_category }}
                </button>
                <button
                  class="btn btn-outline-secondary btn-sm"
                  @click="openEditModal(event)"
                >
                  <i class="fas fa-edit me-1"></i>수정
                </button>
                <button
                  class="btn btn-outline-danger btn-sm"
                  @click="deleteEvent(event)"
                >
                  <i class="fas fa-trash-alt me-1"></i>삭제
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

            <!-- 자산 타입 -->
            <div>
              <!-- 자산 타입 -->
              <div class="mb-3">
                <label class="form-label">자산 타입</label>
                <select v-model="selectedAssetType" class="form-select">
                  <option disabled value="">자산 타입 선택</option>
                  <option value="card">카드</option>
                  <option value="account">계좌</option>
                  <option value="etc">기타</option>
                </select>
              </div>

              <!-- 자산 선택 -->
              <div class="mb-3">
                <label class="form-label">자산 선택</label>
                <select v-model="selectedAssetId" class="form-select">
                  <option disabled value="">자산 선택</option>
                  <option
                    v-for="asset in filteredAssets"
                    :key="asset.id"
                    :value="asset.id"
                  >
                    {{ asset.name }}
                  </option>
                </select>
              </div>

              <!-- 소비 타입 -->
              <div class="mb-3">
                <label class="form-label">소비 타입</label>
                <select v-model="selectedPayType" class="form-select">
                  <option disabled value="">소비 타입 선택</option>
                  <option value="expense">소비</option>
                  <option value="income">입금</option>
                </select>
              </div>

              <!-- 상위 카테고리 -->
              <div class="mb-3">
                <label class="form-label">상위 카테고리 선택</label>
                <select v-model="selectedCategoryType" class="form-select">
                  <option disabled value="">상위 카테고리 선택</option>
                  <option
                    v-for="category in filterCategory"
                    :key="category.id"
                    :value="category.id"
                  >
                    {{ category.main_category }}
                  </option>
                </select>
              </div>

              <!-- 하위 카테고리 -->
              <div class="mb-3">
                <label class="form-label">하위 카테고리 선택</label>
                <select v-model="selectedSubCategory" class="form-select">
                  <option disabled value="">하위 카테고리 선택</option>
                  <option
                    v-for="subcategory in subCategoryOptions"
                    :key="subcategory"
                    :value="subcategory"
                  >
                    {{ subcategory }}
                  </option>
                </select>
              </div>
            </div>

            <!-- 메모 -->
            <div class="mb-3">
              <label class="form-label">메모</label>
              <input v-model="memo" type="text" class="form-control" />
            </div>

            <!-- 내역에 추가할지 -->
            <div class="mb-3">
              <label class="form-label">내역에 추가할지</label>
              <input
                v-model="inInclude"
                type="checkbox"
                class="form-check-input"
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
import { ref, computed, onMounted, watchEffect, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid"; // 날짜
import timeGridPlugin from "@fullcalendar/timegrid"; // 시간 그리드 플러그인
import interactionPlugin from "@fullcalendar/interaction";
import { Offcanvas } from "bootstrap";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { Modal } from "bootstrap";

const userAuth = useAuthStore();
const calendarRef = ref();
const editEvent = ref({
  id: null,
  name: "",
  amount: 0,
  start: "",
});

const selectedAssetType = ref("");
const selectedAssetId = ref("");
const selectedPayType = ref("");
const selectedCategoryType = ref("");
const selectedSubCategory = ref("");
const memo = ref("");
const inInclude = ref(true);
const originalName = ref(""); // 판별용 원본 이름

// API로부터 받아올 데이터
const assetGroup = ref({});
const categoryGroup = ref({});

// 마운트 시 데이터 가져오기
onMounted(async () => {
  try {
    const userId = authStore.user?.id;
    if (!userId) {
      console.log("유저 정보가 없습니다");
      return;
    }

    const res = await axios.get(`/api/users/${userId}`);
    assetGroup.value = res.data.asset_group;
    categoryGroup.value = res.data.category;
  } catch (err) {
    console.error("데이터 불러오기 실패:", err);
  }
});

// 자산 타입에 따라 자산 목록 필터링
const filteredAssets = computed(() => {
  return assetGroup.value[selectedAssetType.value] || [];
});

// 소비/입금 타입에 따라 카테고리 필터링
const filterCategory = computed(() => {
  return categoryGroup.value[selectedPayType.value] || [];
});

// 상위 카테고리에 따라 하위 카테고리 필터링
const subCategoryOptions = computed(() => {
  const selected = filterCategory.value.find(
    (c) => c.id === Number(selectedCategoryType.value)
  );
  return selected ? selected.sub_categories : [];
});

const editModalRef = ref(null);
let editModalInstance = null;

onMounted(() => {
  editModalInstance = new Modal(editModalRef.value);
});

const openEditModal = (event) => {
  originalName.value = event.name;
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
    const userResponse = await axios.get(`/api/users/${userId}`);
    const user = userResponse.data;

    const isRepeat = editEvent.value.isRepeat;
    const original = originalName.value;

    const updateTransactions = user.transactions.map((t) => {
      const updateType = isRepeat
        ? t.name === original
        : t.id === editEvent.value.id;

      if (updateType) {
        const newEventDate = new Date(editEvent.value.start);
        let updatedDate;

        if (isRepeat) {
          // 원래 날짜 유지하면서 시간만 수정
          updatedDate = new Date(`${t.date}T${t.time}`);
          updatedDate.setHours(newEventDate.getHours());
          updatedDate.setMinutes(newEventDate.getMinutes());
        } else {
          // 날짜와 시간 모두 수정
          updatedDate = newEventDate;
        }

        return {
          ...t,
          name: editEvent.value.name,
          amount: editEvent.value.amount,
          date: updatedDate.toISOString().slice(0, 10),
          time: updatedDate.toTimeString().slice(0, 5),
          assetType: selectedAssetType.value,
          assetId: selectedAssetId.value,
          payType: selectedPayType.value,
          categoryType: selectedCategoryType.value,
          subCategory: selectedSubCategory.value,
          memo: memo.value,
          include: inInclude.value,
        };
      }

      return t;
    });

    await axios.patch(`/api/users/${userId}`, {
      transactions: updateTransactions,
    });

    // store에 반영 후 새로고침 없이 갱신 가능
    // await userAuth.fetchUser();
    // editModalInstance.hide();
    // toast.success("수정 완료!");

    window.location.reload();
  } catch (err) {
    console.error("수정 실패", err);
  }
};

// 내역 삭제 함수
const deleteEvent = async (transaction) => {
  const userId = userAuth.user?.id;
  if (!userId) {
    console.log("유저 정보가 없습니다");
    return;
  }

  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const userResponse = await axios.get(`/api/users/${userId}`);
    const user = userResponse.data;

    const isRepeat = transaction.isRepeat;
    const targetName = transaction.name;
    const today = new Date().toISOString().slice(0, 10);

    let updateTransactions;
    if (isRepeat) {
      updateTransactions = user.transactions.filter((t) => {
        // 현재 날짜 이후로 생성되어있는 같은 이름의 고정지출 항목 제거
        const isSameName = t.name === targetName;
        const isFuture = t.date >= today;
        return !(isSameName && isFuture);
      });
    } else {
      updateTransactions = user.transactions.filter(
        (t) => t.id !== transaction.id
      );
    }

    // 트랜잭션에서 해당 항목 제거하기(구 버전 고정지출 여부 미반영)
    // const updateTransactions = user.transactions.filter(
    //   (t) => t.id !== transactionId
    // );

    // 변경된 transaction으로 patch 요청
    await axios.patch(`/api/users/${userId}`, {
      transactions: updateTransactions,
    });

    window.location.reload();
  } catch (err) {
    console.error("삭제 실패", err);
  }
};
// 유저 id(정보) 가져오기
const authStore = useAuthStore();

// 현재 페이지 변수 받아오기
const pageProps = defineProps({
  currentPage: String,
});

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
      console.log("유저 정보가 없습니다");
      return;
    }
    const response = await axios.get(`/api/users/${userId}`);
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
    left: "prev,next",
    center: "title",
    right: "today",
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
  height: "auto",
  datesSet: handleDatesSet,
  expandRows: true,
  eventContent(arg) {
    if (arg.event.extendedProps.isSummary) {
      const { total, incomeTotal, expenseTotal } = arg.event.extendedProps;

      const container = document.createElement("div");
      container.style.fontWeight = "bold";
      container.style.backgroundColor = "white";

      const currentPage = pageProps.currentPage;

      if (currentPage === "전체") {
        const totalText = document.createElement("div");
        totalText.style.color = "black";
        totalText.textContent = `${total >= 0 ? "+" : "-"}${Math.abs(
          total
        ).toLocaleString()}`;

        const incomeText = document.createElement("div");
        incomeText.style.color = "blue";
        incomeText.textContent = `+${incomeTotal.toLocaleString()}`;

        const expenseText = document.createElement("div");
        expenseText.style.color = "red";
        expenseText.textContent = `-${expenseTotal.toLocaleString()}`;

        container.appendChild(totalText);
        container.appendChild(incomeText);
        container.appendChild(expenseText);
      } else if (currentPage === "수입") {
        if (incomeTotal > 0) {
          const incomeText = document.createElement("div");
          incomeText.style.color = "blue";
          incomeText.textContent = `+${incomeTotal.toLocaleString()}`;
          container.appendChild(incomeText);
        }
      } else if (currentPage === "지출") {
        if (expenseTotal > 0) {
          const expenseText = document.createElement("div");
          expenseText.style.color = "red";
          expenseText.textContent = `-${expenseTotal.toLocaleString()}`;
          container.appendChild(expenseText);
        }
      }

      return { domNodes: [container] };
    }
  },
};

// 총합을 상위 컴포넌트로 전달
const emit = defineEmits(["update-summary"]);

// 처음 마운트 되었을때나 값이 변경될때 emit
watchEffect(() => {
  emit("update-summary", {
    summary: handleMonthSummary.value,
    countSummary: handleMonthCountSummary.value,
  });
});

// 선택된 날짜의 필터링된 수입/지출 이벤트만 보여주기
const filteredSelectedDateEvents = computed(() => {
  if (!selectedDate.value) return [];

  let filtered = selectedDateEvents.value;

  if (pageProps.currentPage === "수입") {
    filtered = filtered.filter((e) => e.type === "income");
  } else if (pageProps.currentPage === "지출") {
    filtered = filtered.filter((e) => e.type === "expense");
  }

  return filtered;
});

// 켈린더 api 데이터 베이스 다시 불러오기
function refreshCalendar() {
  const calendarApi = calendarRef.value?.getApi?.();
  if (calendarApi) {
    calendarApi.refetchEvents();
  }
}

defineExpose({
  refreshCalendar,
});
</script>

<style scoped>
.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  font-family: "Noto Sans KR", sans-serif;
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

.milcho-custom-calendar {
  margin-top: 3rem;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  border: none;
  margin-bottom: 0.75rem;
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.list-group-item.bg-danger {
  background-color: #e74c3c !important;
}

.list-group-item.bg-primary {
  background-color: #3498db !important;
}

.list-group-item:hover {
  transform: scale(1.02);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.list-group-item > div:first-child {
  flex: 1;
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.btn-group {
  flex-shrink: 0;
  display: flex;
  gap: 0.5rem;
}

.btn-group .btn {
  padding: 0.4rem 0.75rem;
  font-size: 0.875rem;
  border-radius: 0.375rem;
  transition: background-color 0.2s ease;
}

.btn-group .btn:hover {
  filter: brightness(90%);
}

.event-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.event-card {
  background-color: #fff;
  border-left: 6px solid #ccc;
  padding: 1rem;
  border-radius: 10px;
  transition: all 0.3s ease;
  word-break: break-word;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.event-card.income {
  border-left-color: #3498db;
}

.event-card.expense {
  border-left-color: #e74c3c;
}

.event-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.event-time {
  font-size: 0.9rem;
  color: #555;
}

.event-detail {
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #333;
}

.event-amount {
  margin-left: 1rem;
  font-weight: bold;
  color: #000;
  white-space: nowrap;
}

.event-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.75rem;
}

.no-events-message {
  color: #777;
  font-style: italic;
  display: flex;
  align-items: center;
  font-size: 1rem;
}

.modal-content {
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 1rem;
  background-color: #fdfdfd;
}

.modal-header {
  border-bottom: none;
  padding-bottom: 0;
}

.modal-title {
  font-weight: bold;
  font-size: 1.3rem;
}

.form-label,
label {
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: block;
  color: #333;
}

.form-control,
.form-select {
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
}

.form-control:focus,
.form-select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 0 0.2rem rgba(74, 144, 226, 0.25);
}

.modal-footer {
  border-top: none;
  padding-top: 0;
}

.btn-primary {
  background-color: #4a90e2;
  border-color: #4a90e2;
  transition: background-color 0.2s ease;
}

.btn-primary:hover {
  background-color: #3b78c5;
}

.btn-secondary:hover {
  background-color: #6c757d;
  opacity: 0.9;
}

input[type="checkbox"].form-check-input {
  transform: scale(1.3);
  margin-left: 0.5rem;
}
</style>

<style>
/* 전체 캘린더 배경 및 기본 폰트 */
.milcho-custom-calendar .fc {
  background-color: #fff;
  font-family: "Pretendard", sans-serif;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* 타이틀 커스텀 (예: 2025 April) */
.milcho-custom-calendar .fc-toolbar-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #2e2e2e;
}

/* 이전/다음 버튼 커스텀 */
.milcho-custom-calendar .fc-button {
  background-color: #4a90e2;
  border: none;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  font-weight: 600;
}

.milcho-custom-calendar .fc-button:hover {
  background-color: #3a78c2;
}

/* 요일 헤더 */
.milcho-custom-calendar .fc-col-header-cell {
  background-color: #f6f8fa;
  font-weight: 600;
  padding: 0.75rem 0;
  color: #555;
  border: none;
}

/* 날짜 셀 */
.milcho-custom-calendar .fc-daygrid-day {
  border: none;
  transition: background 0.2s;
}

.milcho-custom-calendar .fc-day-today {
  background-color: #e3f2fd !important;
  border-radius: 10px;
}

/* 이벤트 커스텀 */
.milcho-custom-calendar .fc-event {
  background-color: #fff;
  border: none;
  color: #333;
  font-size: 0.85rem;
  padding: 2px 6px;
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease;
}

.milcho-custom-calendar .fc-event:hover {
  transform: scale(1.03);
}

/* 월간 날짜 상단 숫자 */
.milcho-custom-calendar .fc-daygrid-day-number {
  font-weight: 500;
  color: #333;
  padding: 0.2rem;
}
</style>
