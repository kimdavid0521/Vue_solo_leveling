<template>
  <h5 class="my-3">거래 내역</h5>
  <!-- 거래 내역 헤더: 년월 이동 pagination + '이번달' 버튼 + 검색 버튼 -->
  <div class="d-flex justify-content-between mb-3">
    <div class="d-flex">
      <!-- 년월 이동 pagination -->
      <ul class="pagination pagination-sm mb-0 me-2 custom-pagination">
        <li class="page-item">
          <a class="page-link" href="#"
            ><i class="fa-solid fa-angles-left"></i
          ></a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#"
            ><i class="fa-solid fa-angle-left"></i
          ></a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#">2025-04</a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#"
            ><i class="fa-solid fa-angle-right"></i
          ></a>
        </li>
        <li class="page-item">
          <a class="page-link" href="#"
            ><i class="fa-solid fa-angles-right"></i
          ></a>
        </li>
      </ul>
      <!-- '이번달' 버튼 -->
      <button class="btn btn-sm rounded-3 custom-btn">이번달</button>
    </div>
    <!-- 검색 버튼 -->
    <button class="btn btn-sm rounded-circle custom-btn">
      <i class="fa-solid fa-magnifying-glass"></i>
    </button>
  </div>
  <!-- 거래 내역 테이블 -->
  <TableLayout :tabs="tabs">
    <template>
      <table class="table table-hover mb-0">
        <thead>
          <tr>
            <th>
              <input type="checkbox" />
            </th>
            <th>날짜</th>
            <th>자산</th>
            <th>분류</th>
            <th>내용</th>
            <th>금액</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input type="checkbox" />
            </td>
            <td>2025-04-08</td>
            <td>카드</td>
            <td>식비</td>
            <td>버거킹</td>
            <td>11,000원</td>
          </tr>
        </tbody>
      </table>
    </template>
  </TableLayout>
</template>

<script setup>
import TableLayout from '@/components/TableLayout.vue';

// 탭 테스트 데이터
const tabs = [
  {
    name: '전체',
    count: 0,
    amount: 0,
  },
  {
    name: '수입',
    count: 0,
    amount: 0,
  },
  {
    name: '지출',
    count: 0,
    amount: 0,
  },
];
</script>

<style scoped>
/* pagination 스타일 조정 */
.custom-pagination .page-link {
  color: #333;
  border: 1px solid #6c757d;
  padding: 5px 10px;
  font-size: 0.9rem;
}
.page-item:first-child .page-link {
  border-radius: 0.5rem 0 0 0.5rem;
}
.page-item:last-child .page-link {
  border-radius: 0 0.5rem 0.5rem 0;
}
/* 버튼 스타일 조정 */
.custom-btn {
  border: 1px solid #6c757d;
}
.custom-btn:hover {
  background-color: #f1f1f1;
}
</style>
