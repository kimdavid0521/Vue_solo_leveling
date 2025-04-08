import { createRouter, createWebHistory } from "vue-router";
import Login from "../pages/Login.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  /* 라우팅 테이블 */
  routes: [
    // 로그인 페이지
    {
      path: "/",
      name: "login",
      component: Login,
    },
    // 메인 페이지
    {
      path: "/main",
      name: "main",
      component: () => import("../pages/Main.vue"),
    },
    // 거래 내역 목록 페이지
    {
      path: "/transaction-list",
      name: "transaction-list",
      component: () => import("../pages/TransactionList.vue"),
    },

    // 분석 페이지
    {
      path: "/analyze",
      name: "analyze",
      component: () => import("../pages/Analyze.vue"),
    },

    // 나의 자산 페이지
    {
      path: "/asset",
      name: "asset",
      component: () => import("../pages/Asset.vue"),
    },

    // 마이 페이지
    {
      path: "/mypage",
      name: "mypage",
      component: () => import("../pages/Mypage.vue"),
    },

    // 설정 페이지
    {
      path: "/settings",
      name: "settings",
      component: () => import("../pages/Settings.vue"),
    },

    /* 404 not found 페이지 */
    {
      path: "/:paths(.*)*",
      name: "notFound",
      component: () => import("../pages/NotFound.vue"),
    },
  ],
});

export default router;
