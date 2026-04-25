# @bye_past/vue-keep

Vue 3 页面缓存库，复刻微信小程序页面栈体验 — 前进刷新、返回保留状态和滚动位置。

## 特性

- **页面栈管理** — push / replace / back / reLaunch / switchTab 五种导航方法
- **滚动恢复** — 自动检测滚动容器，返回时精确恢复滚动位置
- **方向感知动画** — 内置 slide / fade / zoom 预设，根据导航方向自动切换
- **页面通信** — EventChannel 机制，类似微信小程序 `wx.navigateTo` 的 events 参数
- **constCache** — 常驻缓存保护，不被 LRU 淘汰
- **嵌套路由** — 多层 KeepRouterView 独立管理
- **TypeScript** — 完整类型定义，支持声明合并
- **轻量** — gzip < 5KB，Tree-shakable，零运行时依赖
- **DevTools** — Vue DevTools 集成

## 安装

```bash
pnpm add @bye_past/vue-keep
```

## 快速上手

```ts
// main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import '@bye_past/vue-keep/animations.css'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    /* ... */
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
```

```vue
<!-- App.vue -->
<template>
  <KeepRouterView />
</template>
```

```vue
<!-- 使用导航方法 -->
<script setup lang="ts">
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

onPageShow((ctx) => {
  if (!ctx.isFirstShow) {
    console.log('从缓存恢复')
  }
})

keepRouter.push('/detail/1')
keepRouter.back()
keepRouter.reLaunch('/')
</script>
```

## 与微信小程序对比

| 微信小程序          | Vue Keep                    |
| ------------------- | --------------------------- |
| `wx.navigateTo`     | `keepRouter.push`           |
| `wx.redirectTo`     | `keepRouter.replace`        |
| `wx.navigateBack`   | `keepRouter.back`           |
| `wx.reLaunch`       | `keepRouter.reLaunch`       |
| `wx.switchTab`      | `keepRouter.switchTab`      |
| `onShow` / `onHide` | `onPageShow` / `onPageHide` |
| `EventChannel`      | `useEventChannel`           |

## 文档

- [中文文档](https://vue-keep.netlify.app/zh/)
- [English Docs](https://vue-keep.netlify.app/en/)

## License

[MIT](./LICENSE)
