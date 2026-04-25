import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('./pages/Home.vue') },
    { path: '/list', name: 'List', component: () => import('./pages/List.vue') },
    { path: '/detail/:id', name: 'Detail', component: () => import('./pages/Detail.vue') },
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
