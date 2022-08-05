import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
// import HomeView from "../views/Home.vue";

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home1',
    // component: HomeView,
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About1',
    component: () => import('../views/About.vue'),
    redirect: '/about/a/',
    children: [
      {
        path: 'a',
        name: 'A',
        component: () => import('../views/children/A.vue')
      },
      {
        path: 'b',
        name: 'B',
        component: () => import('../views/children/B.vue')
      },
      {
        path: 'c',
        component: () => import('../views/children/C.vue')
      }
    ]
    // component: About,
  },
  {
    path: '/test',
    name: 'Test',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Test.vue')
    // component: About,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: '/',
  routes
})

export default router
