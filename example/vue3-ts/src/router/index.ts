import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home1',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About1',
    component: () => import('../views/About.vue'),
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
        name: 'C',
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


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
