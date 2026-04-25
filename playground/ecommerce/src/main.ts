import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('./layouts/TabLayout.vue'),
      children: [
        {
          path: '',
          name: 'Home',
          component: () => import('./pages/home/index.vue'),
          meta: { keep: { tabKey: 'home', constCache: true } },
        },
        {
          path: 'cart',
          name: 'Cart',
          component: () => import('./pages/cart/index.vue'),
          meta: { keep: { tabKey: 'cart', constCache: true } },
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('./pages/profile/index.vue'),
          meta: { keep: { tabKey: 'profile' } },
        },
      ],
    },
    { path: '/list/:category', name: 'List', component: () => import('./pages/list/index.vue') },
    { path: '/detail/:id', name: 'Detail', component: () => import('./pages/detail/index.vue') },
    { path: '/checkout', name: 'Checkout', component: () => import('./pages/checkout/index.vue') },
    {
      path: '/address/edit',
      name: 'AddressEdit',
      component: () => import('./pages/address/edit.vue'),
    },
    { path: '/pay/result', name: 'PayResult', component: () => import('./pages/pay/result.vue') },
  ],
})

const keepRouter = createKeepRouter({
  router,
  max: 10,
  transition: 'slide',
  scrollBehavior: 'auto',
})

const app = createApp(App)
app.use(router)
app.use(keepRouter)
app.mount('#app')
