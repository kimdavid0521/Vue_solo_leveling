<template>
  <nav class="navbar navbar-expand-sm bg-primary navbar-dark">
    <div class="container-fluid">
      <ul class="navbar-nav d-flex" style="gap: 30px; font-size: larger">
        <li class="nav-item">
          <RouterLink to="/main" class="nav-link active">홈</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/analyze" class="nav-link">지출 분석</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/transaction-list" class="nav-link"
            >거래 내역</RouterLink
          >
        </li>
        <li class="nav-item">
          <RouterLink to="/asset" class="nav-link">내 자산</RouterLink>
        </li>
        <li class="nav-item">
          <RouterLink to="/mypage" class="nav-link">마이 페이지</RouterLink>
        </li>

        <!-- 이건 나중에 지출 분석에 사용할 것 -->
        <!-- <li class="nav-item">
          <a class="nav-link disabled" href="#">Disabled</a>
        </li> -->
      </ul>
    </div>
  </nav>
</template>

<script setup>
</script>
