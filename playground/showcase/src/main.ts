import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import '@bye_past/vue-keep/animations.css'
import App from './App.vue'
import './styles/global.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', component: () => import('./pages/home/index.vue') },
    {
      path: '/nav/stack',
      name: 'NavStack',
      component: () => import('./pages/navigation/stack-demo.vue'),
    },
    {
      path: '/scroll/list',
      name: 'ScrollList',
      component: () => import('./pages/scroll/list.vue'),
    },
    {
      path: '/scroll/detail/:id',
      name: 'ScrollDetail',
      component: () => import('./pages/scroll/detail.vue'),
    },
    {
      path: '/animation',
      name: 'Animation',
      component: () => import('./pages/animation/gallery.vue'),
    },
    {
      path: '/animation/sub/slide',
      name: 'AnimSubSlide',
      component: () => import('./pages/animation/sub.vue'),
      meta: { keep: { transition: 'slide' } },
    },
    {
      path: '/animation/sub/fade',
      name: 'AnimSubFade',
      component: () => import('./pages/animation/sub.vue'),
      meta: { keep: { transition: 'fade' } },
    },
    {
      path: '/animation/sub/zoom',
      name: 'AnimSubZoom',
      component: () => import('./pages/animation/sub.vue'),
      meta: { keep: { transition: 'zoom' } },
    },
    {
      path: '/channel',
      name: 'Channel',
      component: () => import('./pages/event-channel/sender.vue'),
    },
    {
      path: '/channel/form',
      name: 'ChannelForm',
      component: () => import('./pages/event-channel/form.vue'),
    },
    { path: '/cache', name: 'Cache', component: () => import('./pages/cache/control.vue') },
    { path: '/cache/sub/:id', name: 'CacheSub', component: () => import('./pages/cache/sub.vue') },
    {
      path: '/tabs',
      name: 'TabHome',
      component: () => import('./pages/tabs/tab-home.vue'),
      meta: { keep: { tabKey: 'home' } },
    },
    {
      path: '/tabs/explore',
      name: 'TabExplore',
      component: () => import('./pages/tabs/tab-explore.vue'),
      meta: { keep: { tabKey: 'explore' } },
    },
    {
      path: '/tabs/profile',
      name: 'TabProfile',
      component: () => import('./pages/tabs/tab-profile.vue'),
      meta: { keep: { tabKey: 'profile' } },
    },
    {
      path: '/lifecycle',
      name: 'Lifecycle',
      component: () => import('./pages/lifecycle/index.vue'),
    },
    {
      path: '/lifecycle/sub',
      name: 'LifecycleSub',
      component: () => import('./pages/lifecycle/sub.vue'),
    },
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
