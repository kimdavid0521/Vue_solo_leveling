<template>
  <div class="container mt-4">
    <h4 class="fw-bold mb-4">지출 카테고리 관리</h4>
    <div class="row">
      <!-- 왼쪽: 대분류 리스트 -->
      <div class="col-md-4">
        <h5>대분류 목록</h5>
        <ul class="list-group mb-3">
          <li
            v-for="(category, index) in expenseCategories"
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
const expenseCategories = ref([]);
const selectedCategoryIndex = ref(null);

const selectedCategory = computed(() => {
  return expenseCategories.value[selectedCategoryIndex.value] || null;
});

// 데이터 로딩
onMounted(async () => {
  try {
    const res = await axios.get(`/api/users/${userId}`);
    expenseCategories.value = res.data.category?.expense || [];
  } catch (error) {
    console.error('카테고리 불러오기 실패', error);
  }
});

// 새 카테고리 추가
const addCategory = () => {
  expenseCategories.value.push({ main_category: '', sub_categories: [] });
  selectedCategoryIndex.value = expenseCategories.value.length - 1;
};

// 서브 카테고리 추가
const addSubCategory = (index) => {
  expenseCategories.value[index].sub_categories.push('');
};

// 카테고리 삭제
const deleteCategory = (index) => {
  expenseCategories.value.splice(index, 1);
  if (selectedCategoryIndex.value === index) {
    selectedCategoryIndex.value = null;
  } else if (selectedCategoryIndex.value > index) {
    selectedCategoryIndex.value--;
  }
};

// 서브 카테고리 삭제
const deleteSubCategory = (categoryIndex, subIndex) => {
  expenseCategories.value[categoryIndex].sub_categories.splice(subIndex, 1);
};

// 저장
const saveCategories = async () => {
  try {
    await axios.patch(`/api/users/${userId}`, {
      category: {
        ...authStore.user.category,
        expense: expenseCategories.value,
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
input.form-control {
  max-width: 300px;
}
</style>
