# Tab 切换保持

## 场景

底部 Tab 栏应用，切换 Tab 时保留各 Tab 的页面状态和子栈。

## 路由配置

```ts
const routes = [
  {
    path: '/',
    component: TabLayout,
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('./pages/Home.vue'),
        meta: { keep: { tabKey: 'home', constCache: true } },
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('./pages/Category.vue'),
        meta: { keep: { tabKey: 'category' } },
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('./pages/Cart.vue'),
        meta: { keep: { tabKey: 'cart' } },
      },
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('./pages/Profile.vue'),
        meta: { keep: { tabKey: 'profile' } },
      },
    ],
  },
  // Tab 内的子页面
  { path: '/detail/:id', component: () => import('./pages/Detail.vue') },
  { path: '/settings', component: () => import('./pages/Settings.vue') },
]
```

## Tab 栏组件

```vue
<!-- TabLayout.vue -->
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import { useRoute } from 'vue-router'

const keepRouter = useKeepRouter()
const route = useRoute()

const tabs = [
  { key: 'home', path: '/', icon: 'home', label: '首页' },
  { key: 'category', path: '/category', icon: 'grid', label: '分类' },
  { key: 'cart', path: '/cart', icon: 'cart', label: '购物车' },
  { key: 'profile', path: '/profile', icon: 'user', label: '我的' },
]

function switchTo(path: string) {
  keepRouter.switchTab(path)
}
</script>

<template>
  <div class="tab-layout">
    <main class="tab-content">
      <KeepRouterView />
    </main>
    <nav class="tab-bar">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: route.path === tab.path }"
        @click="switchTo(tab.path)"
      >
        {{ tab.label }}
      </button>
    </nav>
  </div>
</template>
```

## 工作原理

- `switchTab` 会保留目标 Tab 的子栈状态
- 从 Tab 页 push 进入子页面，再 back 回来，Tab 状态保持
- 每个 Tab 的 `constCache: true` 确保不被 LRU 淘汰
