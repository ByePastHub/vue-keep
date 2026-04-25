# @bye_past/vue-keep

> Vue 3 页面缓存库，复刻微信小程序页面栈体验 — 前进刷新、返回保留状态和滚动位置。

[![npm](https://img.shields.io/npm/v/@bye_past/vue-keep/alpha?color=cb3837&logo=npm)](https://www.npmjs.com/package/@bye_past/vue-keep)
[![bundle size](https://img.shields.io/bundlephobia/minzip/@bye_past/vue-keep?label=gzip)](https://bundlephobia.com/package/@bye_past/vue-keep)
[![license](https://img.shields.io/npm/l/@bye_past/vue-keep)](./LICENSE)

📘 [中文文档](https://bypasthub.github.io/vue-keep/zh/) · [English Docs](https://bypasthub.github.io/vue-keep/en/)
🎮 [在线 Demo](https://bypasthub.github.io/vue-keep/demo/) · ⚡ [StackBlitz](https://stackblitz.com/github/ByePastHub/vue-keep/tree/master/playground/showcase?file=src/main.ts)
🌐 [English README](https://github.com/ByePastHub/vue-keep/blob/master/README.en.md)

---

## 特性

- **页面栈管理** — `push` / `replace` / `back` / `reLaunch` / `switchTab` 五种导航
- **滚动恢复** — 自动检测滚动容器，返回时精确恢复（含懒加载图片撑高场景）
- **方向感知动画** — 内置 slide / fade / zoom，按需引入 CSS
- **页面通信** — `useEventChannel` 类似小程序 `EventChannel`
- **小程序生命周期** — `onPageShow` / `onPageHide`，`isFirstShow` 区分首次进入
- **constCache** — 常驻缓存，不被 LRU 淘汰
- **嵌套路由** — 多层 `<KeepRouterView>` 独立维护栈
- **TypeScript** — 完整类型，支持声明合并
- **轻量** — gzip < 5KB，Tree-shakable
- **DevTools** — Vue DevTools 集成

## 安装

```bash
# Alpha 阶段
pnpm add @bye_past/vue-keep@alpha
# or
npm install @bye_past/vue-keep@alpha
```

需要 `vue ^3.4.0` 和 `vue-router ^4.2.0` 作为 peerDependencies。

## 快速上手

```ts
// main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import '@bye_past/vue-keep/animations.css'
import App from './App.vue'

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
<!-- 使用导航与生命周期 -->
<script setup lang="ts">
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

onPageShow((ctx) => {
  if (!ctx.isFirstShow) console.log('从缓存恢复')
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

## 文档与资源

- [中文文档](https://bypasthub.github.io/vue-keep/zh/) · [English Docs](https://bypasthub.github.io/vue-keep/en/)
- [在线 Demo](https://bypasthub.github.io/vue-keep/demo/) · [StackBlitz](https://stackblitz.com/github/ByePastHub/vue-keep/tree/master/playground/showcase?file=src/main.ts)
- [GitHub 仓库](https://github.com/ByePastHub/vue-keep)
- [Changelog](https://github.com/ByePastHub/vue-keep/releases)

## License

[MIT](./LICENSE) © ByePast
