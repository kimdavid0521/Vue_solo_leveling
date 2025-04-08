import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import NotFound from '../pages/NotFound.vue';
import Main from '../pages/Main.vue';
import TransactionList from '../pages/TransactionList.vue';
import Analyze from '../pages/Analyze.vue';
import Asset from '../pages/Asset.vue';
import Mypage from '../pages/Mypage.vue';
import Settings from '../pages/Settings.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),

  /* 라우팅 테이블 */
  routes: [
    // 로그인 페이지
    {
      path: '/',
      name: 'login',
      component: Login,
    },
    // 메인 페이지
    {
      path: '/main',
      name: 'main',
      component: () => import('../pages/Main.vue'),
    },

    // 거래 내역 목록 페이지
    {
      path: '/transaction-list',
      name: 'transaction-list',
      component: () => import('../pages/TransactionList.vue'),
    },

    // 분석 페이지
    {
      path: '/analyze',
      name: 'analyze',
      component: () => import('../pages/Analyze.vue'),
    },

    // 나의 자산 페이지
    {
      path: '/asset',
      name: 'asset',
      component: () => import('../pages/Asset.vue'),
    },

    // 마이 페이지
    {
      path: '/mypage',
      name: 'mypage',
      component: () => import('../pages/Mypage.vue'),
      children: [
        {
          path: 'edit-profile',
          component: () => import('../pages/EditProfile.vue'), // 비밀번호 인증
        },
        {
          path: 'premium',
          component: () => import('../pages/Premium.vue'), // 프리미엄 설정
        },
      ],
    },

    // 설정 페이지
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../pages/Settings.vue'),
    },

    /* 404 not found 페이지 */
    {
      path: '/:paths(.*)*',
      name: 'notFound',
      component: () => import('../pages/NotFound.vue'),
    },
  ],
});

export default router;
