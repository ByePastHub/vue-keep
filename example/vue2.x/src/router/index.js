import Vue from "vue";
import VueRouter from "vue-router";
import { beforeEach } from "../../../../dist/vue-keep.cjs";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: {
      name: "user",
    },
  },
  {
    name: "user",
    path: "/user",
    component: () => import("../views/user/index.vue"),
    meta: {
      title: "会员中心",
    },
  },
  {
    name: "cart",
    path: "/cart",
    component: () => import("../views/cart/index.vue"),
    meta: {
      title: "购物车",
    },
  },
  {
    name: "goods",
    path: "/goods",
    component: () => import("../views/goods/index.vue"),
    meta: {
      title: "商品详情",
    },
  },
];

const router = new VueRouter({
  routes,
  base: '/example',
  // mode: 'history'
});

beforeEach((to, from) => {
  console.log('keepBeforeEach', to, from)
})

router.beforeEach(async (to, from, next) => {
  console.log('router.beforeEach')
  const title = to.meta && to.meta.title;
  if (title) {
    document.title = title;
  }
  next();
});



export default router;
