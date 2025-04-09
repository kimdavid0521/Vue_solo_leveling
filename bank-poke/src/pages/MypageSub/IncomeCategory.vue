<template>
  <div class="container mt-4">
    <h4 class="fw-bold mb-4 section-title">수입 카테고리 관리</h4>
    <div class="row">
      <!-- 왼쪽: 대분류 리스트 -->
      <div class="col-md-4">
        <h5>대분류 목록</h5>
        <ul class="list-group mb-3">
          <li
            v-for="(category, index) in incomeCategories"
            :key="index"
            class="list-group-item d-flex justify-content-between align-items-center"
            :class="{ active: selectedCategoryIndex === index }"
            @click="selectedCategoryIndex = index"
            style="cursor: pointer"
          >
            <span>{{ category.main_category || '이름 없음' }}</span>
            <button
              class="btn btn-sm btn-outline-danger"
              @click.stop="deleteCategory(index)"
            >
              삭제
            </button>
          </li>
        </ul>
        <button class="btn btn-primary w-100" @click="addCategory">
          대분류 추가
        </button>
      </div>

      <!-- 오른쪽: 선택된 대분류 상세 (서브 카테고리) -->
      <div class="col-md-8" v-if="selectedCategory">
        <h5>선택된 대분류 수정</h5>
        <input
          v-model="selectedCategory.main_category"
          class="form-control mb-3"
          placeholder="대분류 이름"
        />

        <h6>서브 카테고리</h6>
        <div
          v-for="(sub, subIndex) in selectedCategory.sub_categories"
          :key="subIndex"
          class="d-flex align-items-center mb-2"
        >
          <input
            v-model="selectedCategory.sub_categories[subIndex]"
            class="form-control me-2"
            placeholder="서브 카테고리"
          />
          <button
            class="btn btn-outline-danger btn-sm"
            @click="deleteSubCategory(selectedCategoryIndex, subIndex)"
          >
            삭제
          </button>
        </div>
        <button
          class="btn btn-outline-primary btn-sm mb-3"
          @click="addSubCategory(selectedCategoryIndex)"
        >
          서브 카테고리 추가
        </button>

        <div>
          <button class="btn btn-success" @click="saveCategories">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const userId = authStore.user?.id;
const incomeCategories = ref([]);
const selectedCategoryIndex = ref(null);

const selectedCategory = computed(() => {
  return incomeCategories.value[selectedCategoryIndex.value] || null;
});

// 데이터 로딩
onMounted(async () => {
  try {
    const res = await axios.get(`/api/users/${userId}`);
    incomeCategories.value = res.data.category?.income || [];
  } catch (error) {
    console.error('카테고리 불러오기 실패', error);
  }
});

// 새 카테고리 추가
const addCategory = () => {
  incomeCategories.value.push({ main_category: '', sub_categories: [] });
  selectedCategoryIndex.value = incomeCategories.value.length - 1;
};

// 서브 카테고리 추가
const addSubCategory = (index) => {
  incomeCategories.value[index].sub_categories.push('');
};

// 카테고리 삭제
const deleteCategory = (index) => {
  incomeCategories.value.splice(index, 1);
  if (selectedCategoryIndex.value === index) {
    selectedCategoryIndex.value = null;
  } else if (selectedCategoryIndex.value > index) {
    selectedCategoryIndex.value--;
  }
};

// 서브 카테고리 삭제
const deleteSubCategory = (categoryIndex, subIndex) => {
  incomeCategories.value[categoryIndex].sub_categories.splice(subIndex, 1);
};

// 저장
const saveCategories = async () => {
  try {
    await axios.patch(`/api/users/${userId}`, {
      category: {
        ...authStore.user.category,
        income: incomeCategories.value,
      },
    });
    alert('저장되었습니다.');
  } catch (error) {
    console.error('저장 실패', error);
    alert('저장에 실패했습니다.');
  }
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
}

.section-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #2b2b2b;
  margin-bottom: 2rem;
  border-left: 5px solid #ffd95a;
  padding-left: 0.75rem;
}

h4,
h5,
h6 {
  color: #2b2b2b;
  font-weight: bold;
}

.list-group-item {
  transition: background-color 0.2s ease;
}

.list-group-item.active {
  background-color: #ffd95a !important;
  border-color: #ffd95a;
  color: #2b2b2b;
  font-weight: bold;
}

.list-group-item:hover {
  background-color: #fff7db;
}

.btn {
  font-weight: 500;
  transition: 0.2s;
}

/* 추가/삭제 버튼 */
.btn-outline-danger,
.btn-outline-primary {
  border-radius: 6px;
  font-size: 0.85rem;
}

/* 저장 버튼 */
.btn-success {
  background-color: #28a745;
  border: none;
  font-weight: bold;
  padding: 0.5rem 1.2rem;
  border-radius: 8px;
}

.btn-success:hover {
  background-color: #218838;
}

/* 대분류 추가 버튼 */
.btn-primary {
  background-color: #ffd95a;
  border: none;
  font-weight: bold;
  color: #2b2b2b;
}

.btn-primary:hover {
  background-color: #ffc436;
}

/* 서브카테고리 추가 버튼 */
.btn-outline-primary {
  color: #2b2b2b;
  border-color: #ffd95a;
}

.btn-outline-primary:hover {
  background-color: #ffd95a;
  color: #2b2b2b;
}

/* 입력창 */
input.form-control {
  max-width: 300px;
  padding: 0.5rem 0.8rem;
  font-size: 0.95rem;
  border-radius: 6px;
}

input.form-control:focus {
  border-color: #ffd95a;
  box-shadow: 0 0 0 0.15rem rgba(255, 217, 90, 0.25);
  outline: none;
}

/* 서브카테고리 줄 정렬 */
.d-flex.align-items-center {
  gap: 0.5rem;
}

/* 구분선 느낌 */
hr {
  margin: 1.5rem 0;
  border-top: 1px solid #eee;
}
</style>
