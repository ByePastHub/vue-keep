import { createRouter, createWebHistory } from 'vue-router';
import { beforeEach } from '../../../../dist/vue-keep.esm';

const routes = [
  {
    path: '/',
    redirect: {
      name: 'user',
    },
  },
  {
    name: 'user',
    path: '/user',
    component: () => import('../views/user/index.vue'),
    meta: {
      title: '会员中心',
    },
  },
  {
    name: 'cart',
    path: '/cart',
    component: () => import('../views/cart/index.vue'),
    meta: {
      title: '购物车',
    },
  },
  {
    name: 'goods',
    path: '/goods',
    component: () => import('../views/goods/index.vue'),
    meta: {
      title: '商品详情',
    },
  }
];

const router = createRouter({
  routes,
  history: createWebHistory('/example/'),
});

// setTimeout(() => {
//   router.addRoute({
//     name: 'goods',
//     path: '/goods',
//     component: () => import('../views/goods/index.vue'),
//     meta: {
//       title: '商品详情',
//     },
//   });
// }, 1000);

router.beforeEach((to, from, next) => {
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});

export default router;
