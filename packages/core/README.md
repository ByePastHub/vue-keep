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

- **页面栈管理** — `push` / `replace` / `back` / `reLaunch` / `switchTab` 五种导航，对齐 `wx.navigateTo` 等
- **滚动恢复** — 同步立即应用 + nextTick + ResizeObserver + 600ms 兜底，串行不冲突，懒加载图片撑高场景也精准
- **方向感知动画** — 内置 slide / fade / zoom，按需引入 CSS，前进左滑 / 返回右滑
- **页面通信** — `useEventChannel` 跨页面回传，对标小程序 `EventChannel`
- **小程序生命周期** — `onPageShow` / `onPageHide`，`isFirstShow` 区分首次进入
- **constCache 常驻缓存** — 不被 LRU 淘汰，支持 `meta.keep.constCache` 或运行时标记
- **嵌套路由** — 多层 `<KeepRouterView>` 各自维护独立栈，Tab + 子路由场景无忧
- **刷新恢复** — 默认基于 `history.state` 持久化，刷新页面栈不丢
- **TypeScript** — 全量类型，端到端推断，支持 `PageEventMap` 声明合并
- **轻量 SSR 安全** — gzip ~10KB，不劫持 History API，Tree-shakable
- **DevTools** — Vue DevTools 集成（Phase 3）

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
  max: 10, // 栈深上限，超出按 LRU 淘汰
  transition: 'slide', // 'slide' | 'fade' | 'zoom' | false | TransitionConfig
  scrollBehavior: 'auto', // 'auto' | 'always' | 'none' | ScrollBehaviorFn
  persist: true, // 是否启用刷新恢复，默认 true
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
  if (ctx.isFirstShow) {
    loadData() // 首次进入
  } else {
    refreshIfNeeded() // 从其他页面返回
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

## API 速查

### `createKeepRouter(options)`

| Option                   | 类型                                                       | 默认           | 说明                          |
| ------------------------ | ---------------------------------------------------------- | -------------- | ----------------------------- |
| `router`                 | `Router`                                                   | —              | Vue Router 实例（必填）       |
| `max`                    | `number \| Record<number, number>`                         | `10`           | 栈深上限，可按 depth 分层配置 |
| `exclude` / `include`    | `string \| RegExp \| Array \| Function`                    | —              | 全局缓存名单                  |
| `scrollBehavior`         | `'auto' \| 'always' \| 'none' \| ScrollBehaviorFn`         | `'auto'`       | 滚动恢复策略                  |
| `persist`                | `boolean`                                                  | `true`         | 刷新恢复                      |
| `transition`             | `false \| 'slide' \| 'fade' \| 'zoom' \| TransitionConfig` | `'slide'`      | 动画配置                      |
| `disableFirstTransition` | `boolean`                                                  | `true`         | 首屏跳过动画                  |
| `devtools`               | `boolean`                                                  | dev 默认 true  | Vue DevTools 集成             |
| `namespace`              | `string`                                                   | `'[vue-keep]'` | 日志命名空间                  |
| `onBeforeEvict`          | `(entry) => boolean \| void`                               | —              | LRU 淘汰前钩子                |

### `<KeepRouterView>` Props

| Prop               | 类型                                                       | 默认   | 说明                  |
| ------------------ | ---------------------------------------------------------- | ------ | --------------------- |
| `max`              | `number`                                                   | 同全局 | 栈深上限              |
| `cacheMax`         | `number`                                                   | 同 max | KeepAlive 缓存上限    |
| `exclude`          | `NameMatcher`                                              | —      | 当前容器排除规则      |
| `include`          | `NameMatcher`                                              | —      | 当前容器白名单规则    |
| `containerId`      | `string`                                                   | 自动   | 嵌套时手动指定容器 id |
| `transition`       | `false \| 'slide' \| 'fade' \| 'zoom' \| TransitionConfig` | 同全局 | 当前容器动画配置      |
| `scrollContainers` | `string[]`                                                 | —      | 额外滚动容器选择器    |

### `KeepRouter` 实例方法

```ts
keepRouter.push(to, options?)         // 入栈，新页面 mounted
keepRouter.replace(to, options?)      // 替换栈顶，旧页面 unmounted
keepRouter.back(delta?)               // 弹出 N 个，目标页 activated
keepRouter.reLaunch(to, options?)     // 清空全栈
keepRouter.switchTab(to, options?)    // 切换 Tab，保留各 Tab 子路由栈
keepRouter.destroy(target)            // 销毁缓存：name / name[] / 'ALL' / (entry) => boolean
keepRouter.beforeEach(guard)          // 注册导航守卫，返回 unregister
```

`KeepNavigateOptions`：

```ts
{
  cache?: boolean              // 是否缓存目标页（默认 true）
  constCache?: boolean         // 是否标记为常驻缓存
  destroy?: DestroyTarget      // 进入目标页前需要销毁的缓存
  events?: Record<string, fn>  // eventChannel 监听器（仅 push/replace）
  metadata?: Record<string, unknown> // 附加元数据
}
```

### Composables

```ts
import {
  useKeepRouter, // 获取 KeepRouter 实例
  usePageCache, // 当前页面缓存控制：isCached/markAsCached/setConstCache
  useNavigationDirection, // 响应式导航方向：'forward' | 'back' | 'none'
  usePageStack, // 只读栈快照（响应式）
  useEventChannel, // 当前页面 eventChannel
  useScrollRestoration, // 滚动恢复手动控制（pause/resume/capture/restore）
  onPageShow, // 页面显示（含首次）
  onPageHide, // 页面隐藏
} from '@bye_past/vue-keep'
```

### 路由 meta 扩展

```ts
{
  path: '/detail/:id',
  component: Detail,
  meta: {
    keep: {
      cache: true,        // 是否缓存（默认 true）
      constCache: false,  // 是否常驻缓存
      destroy: 'list',    // 进入此页面时销毁指定缓存
      tabKey: 'home',     // switchTab 用的稳定 tab 标识
      transition: 'fade', // 页面级动画
    }
  }
}
```

完整 API 请见 **[API 参考](https://bypasthub.github.io/vue-keep/zh/api/create-keep-router)**。

## 文档与资源

- [中文文档](https://bypasthub.github.io/vue-keep/zh/) · [English Docs](https://bypasthub.github.io/vue-keep/en/)
- [在线 Demo](https://bypasthub.github.io/vue-keep/demo/) · [StackBlitz](https://stackblitz.com/github/ByePastHub/vue-keep/tree/master/playground/showcase?file=src/main.ts)
- [GitHub 仓库](https://github.com/ByePastHub/vue-keep)
- [Changelog](https://github.com/ByePastHub/vue-keep/releases)

## License

[MIT](./LICENSE) © ByePast
