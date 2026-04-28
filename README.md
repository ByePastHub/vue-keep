<div align="right">

**简体中文** | [English](./README.en.md)

</div>

<h1 align="center">@bye_past/vue-keep</h1>

<p align="center">
  <strong>Vue 3 页面缓存库 — 复刻微信小程序页面栈体验</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@bye_past/vue-keep"><img src="https://img.shields.io/npm/v/@bye_past/vue-keep/alpha?color=cb3837&label=npm%20alpha&logo=npm" alt="npm version"></a>
  <a href="https://github.com/ByePastHub/vue-keep/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/ByePastHub/vue-keep/ci.yml?branch=master&label=CI" alt="CI"></a>
  <a href="https://bundlephobia.com/package/@bye_past/vue-keep"><img src="https://img.shields.io/bundlephobia/minzip/@bye_past/vue-keep?label=gzip" alt="bundle size"></a>
  <a href="./LICENSE"><img src="https://img.shields.io/npm/l/@bye_past/vue-keep" alt="license"></a>
  <img src="https://img.shields.io/badge/Vue-3.4%2B-42b883?logo=vue.js" alt="Vue 3.4+">
  <img src="https://img.shields.io/badge/Vue%20Router-4.2%2B-42b883" alt="Vue Router 4.2+">
</p>

<p align="center">
  <a href="https://bypasthub.github.io/vue-keep/zh/">📘 中文文档</a> ·
  <a href="https://bypasthub.github.io/vue-keep/demo/">🎮 在线 Demo</a> ·
  <a href="https://stackblitz.com/github/ByePastHub/vue-keep/tree/master/playground/showcase?file=src/main.ts">⚡ StackBlitz</a> ·
  <a href="./README.en.md">🌐 English</a>
</p>

---

## 📖 简介

`@bye_past/vue-keep` 是一个 Vue 3 + Vue Router 4 的页面缓存库，把微信小程序的页面栈体验带到 Web：

- **前进刷新** — 进入新页面正常 mounted、加载数据
- **返回保留** — 回退时保留页面状态、表单输入、滚动位置（包括容器内滚动）
- **方向感知动画** — 内置 slide / fade / zoom，前进左滑、返回右滑
- **不污染全局** — 不劫持 History API、SSR 安全、Tree-shakable
- **类型安全** — 全量 TypeScript，端到端推断

> 替换一个组件 (`<router-view>` → `<KeepRouterView>`)，整套体验就接管。

### ✨ 特性一览

| 能力              | 说明                                                                            |
| ----------------- | ------------------------------------------------------------------------------- |
| 🧭 五种导航       | `push` / `replace` / `back` / `reLaunch` / `switchTab`，对齐 `wx.navigateTo` 等 |
| 🗂️ 页面栈管理     | LRU 淘汰、`max` 上限、`constCache` 常驻保护                                     |
| 📜 滚动恢复       | 三道防线：同步 + nextTick + ResizeObserver + 600ms 兜底，串行不冲突             |
| 🎬 方向感知动画   | 根据导航方向自动切换过渡，按需引入 CSS                                          |
| 📡 页面通信       | `useEventChannel` 数据回传，对标小程序 EventChannel                             |
| 🪝 小程序生命周期 | `onPageShow` / `onPageHide`，`isFirstShow` 区分首次进入                         |
| 🪜 嵌套缓存       | 多层 `<KeepRouterView>`，每层独立栈，Tab + 子路由场景无忧                       |
| 🛠️ DevTools       | Vue DevTools 集成，可视化页面栈（Phase 3）                                      |
| 📦 极致体积       | gzip ~9KB（不含 CSS）                                                           |

---

## 🚀 快速上手

### 安装

```bash
# Alpha 阶段
pnpm add @bye_past/vue-keep@alpha
# or
npm install @bye_past/vue-keep@alpha
# or
yarn add @bye_past/vue-keep@alpha
```

需要 `vue ^3.4.0` 与 `vue-router ^4.2.0` 作为 peerDependencies。

### 三步集成

#### 1. 注册插件

```ts
// main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import '@bye_past/vue-keep/animations.css' // 按需引入内置动画 CSS
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/detail/:id', component: () => import('./pages/Detail.vue') },
  ],
})

const keepRouter = createKeepRouter({
  router,
  max: 10, // 栈深上限，超出按 LRU 淘汰
  transition: 'slide', // 'slide' | 'fade' | 'zoom' | false
  scrollBehavior: 'auto', // 'auto' | 'none'
})

const app = createApp(App)
app.use(router)
app.use(keepRouter)
app.mount('#app')
```

#### 2. 替换 `<router-view>`

```vue
<!-- App.vue -->
<template>
  <KeepRouterView />
</template>
```

#### 3. 用导航方法

```vue
<script setup lang="ts">
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

// 小程序风格生命周期
onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    loadData() // 首次进入
  } else {
    refreshIfNeeded() // 从其他页面返回
  }
})

function gotoDetail(id: number) {
  keepRouter.push(`/detail/${id}`) // 入栈
}
function goBack() {
  keepRouter.back() // 返回上一页（保留状态）
}
function logout() {
  keepRouter.reLaunch('/login') // 清空栈
}
</script>
```

普通 JS / TS 模块中也可以在插件安装后调用：

```ts
import { useKeepRouter } from '@bye_past/vue-keep'

export async function navigateToLogin() {
  const keepRouter = useKeepRouter()
  await keepRouter.push('/login')
}
```

完成。后续所有页面自动获得「前进刷新、返回保留状态和滚动位置」的能力。

---

## 🧭 导航方法对照

完全对齐微信小程序导航语义：

| 微信小程序          | vue-keep                     | 栈行为         | 旧页面              | 新页面            |
| ------------------- | ---------------------------- | -------------- | ------------------- | ----------------- |
| `wx.navigateTo`     | `keepRouter.push(path)`      | 新页面入栈     | deactivated（保留） | mounted           |
| `wx.redirectTo`     | `keepRouter.replace(path)`   | 替换栈顶       | unmounted（销毁）   | mounted           |
| `wx.navigateBack`   | `keepRouter.back(n?)`        | 弹出栈顶 n 个  | unmounted           | activated         |
| `wx.reLaunch`       | `keepRouter.reLaunch(path)`  | 清空所有栈     | 全部 unmounted      | mounted           |
| `wx.switchTab`      | `keepRouter.switchTab(path)` | 顶层栈切换     | deactivated         | activated/mounted |
| `EventChannel`      | `useEventChannel()`          | 跨页面回传数据 | —                   | —                 |
| `onShow` / `onHide` | `onPageShow` / `onPageHide`  | 生命周期       | —                   | —                 |

---

## 🛠️ 典型场景

### 场景 1：列表 → 详情 → 返回

列表页滚动到第 50 条，进详情看完返回 — 列表页保持原位置和数据，无需重新加载。

```vue
<!-- 列表页：什么都不用做，开箱即用 -->
<script setup>
import { useKeepRouter } from '@bye_past/vue-keep'
const keepRouter = useKeepRouter()
</script>

<template>
  <ul>
    <li v-for="item in list" :key="item.id" @click="keepRouter.push(`/detail/${item.id}`)">
      {{ item.title }}
    </li>
  </ul>
</template>
```

### 场景 2：支付成功，返回时刷新列表

```ts
// 支付结果页
const keepRouter = useKeepRouter()
keepRouter.destroy('orderList') // 销毁列表缓存
keepRouter.back() // 返回时列表页会重新 mounted
```

### 场景 3：筛选页数据回传

```ts
// 列表页
keepRouter.push('/filter', {
  events: {
    applyFilter: (filter) => {
      query.value = filter
      reload()
    },
  },
})

// 筛选页
import { useEventChannel } from '@bye_past/vue-keep'
const channel = useEventChannel<{ applyFilter: { tag: string } }>()
channel.emit('applyFilter', { tag: 'newest' })
keepRouter.back()
```

### 场景 4：Tab + 子路由

底部 Tab 切换不丢子路由栈：

```vue
<!-- App.vue -->
<KeepRouterView />
<!-- 顶层：管理 Tab 级缓存 -->

<!-- TabHome.vue -->
<KeepRouterView />
<!-- 子层：管理 Tab 内部子路由栈 -->
```

### 场景 5：常驻缓存

某些页面（购物车、个人中心）希望永远在缓存里，不被 LRU 淘汰：

```ts
// 路由配置
{
  path: '/cart',
  component: Cart,
  meta: { keep: { constCache: true } }
}
```

更多场景见 **[Cookbook](https://bypasthub.github.io/vue-keep/zh/cookbook/scroll-restoration)**。

---

## 📚 API 速查

### `<KeepRouterView>` Props

| Prop               | 类型                                                       | 默认      | 说明               |
| ------------------ | ---------------------------------------------------------- | --------- | ------------------ |
| `max`              | `number`                                                   | `10`      | 栈深上限           |
| `cacheMax`         | `number`                                                   | 同 max    | KeepAlive 缓存上限 |
| `exclude`          | `string \| RegExp \| Array \| Function`                    | —         | 不缓存的组件       |
| `include`          | `string \| RegExp \| Array \| Function`                    | —         | 只缓存的组件       |
| `containerId`      | `string`                                                   | 自动      | 嵌套时手动指定     |
| `transition`       | `false \| 'slide' \| 'fade' \| 'zoom' \| TransitionConfig` | `'slide'` | 过渡动画           |
| `scrollContainers` | `string[]`                                                 | —         | 额外滚动容器选择器 |

### Composables

```ts
import {
  useKeepRouter, // 导航控制：push/replace/back/reLaunch/switchTab/destroy
  usePageCache, // 当前页面缓存控制：isCached/markAsCached/setConstCache
  useNavigationDirection, // 响应式导航方向 ('forward' | 'back' | 'none')
  useEventChannel, // 页面间事件通道
  useScrollRestoration, // 滚动恢复手动控制
  usePageStack, // 只读栈快照
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
      constCache: false,  // 是否常驻
      destroy: 'list',    // 进入此页面时销毁指定缓存
      tabKey: 'home',     // switchTab 用的 tab 标识
      transition: 'fade', // 页面级动画
    }
  }
}
```

完整 API 请见 **[API 参考](https://bypasthub.github.io/vue-keep/zh/api/create-keep-router)**。

---

## 🆚 与同类库对比

| 维度                  | vue-keep 2.0 | vue-page-stack | stack-keep-alive |
| --------------------- | ------------ | -------------- | ---------------- |
| 不污染 History API    | ✅           | ❌             | ❌               |
| 内置方向感知动画      | ✅           | ❌             | ❌               |
| eventChannel 数据回传 | ✅           | ❌             | ❌               |
| 滚动恢复（含容器）    | ✅           | ⚠️ 仅文档级    | ⚠️               |
| 嵌套路由独立栈        | ✅           | ❌             | ✅               |
| TypeScript 全量类型   | ✅           | ⚠️             | ⚠️               |
| SSR 安全              | ✅           | ❌             | ❌               |
| gzip 体积             | ~9KB         | ~12KB          | ~8KB             |
| Vue DevTools 集成     | ✅           | ❌             | ❌               |

---

## 🌍 浏览器与环境支持

- 现代浏览器（支持 ES2020）
- Vue 3.4+，Vue Router 4.2+（依赖 `history.listen` info）
- SSR 安全（Nuxt 3 场景不报错）
- iOS Safari 弹性滚动已 clamp 处理

---

## 🔗 相关链接

- 📘 **[中文文档](https://bypasthub.github.io/vue-keep/zh/)** · **[English Docs](https://bypasthub.github.io/vue-keep/en/)**
- 🎮 **[在线 Demo（showcase）](https://bypasthub.github.io/vue-keep/demo/)**
- ⚡ **[StackBlitz Edit-in-browser](https://stackblitz.com/github/ByePastHub/vue-keep/tree/master/playground/showcase?file=src/main.ts)**
- 📋 **[产品需求文档（PRD）](./PRD.md)**
- 🤝 **[贡献指南（Contributing）](./CONTRIBUTING.md)**
- 🐛 **[问题反馈](https://github.com/ByePastHub/vue-keep/issues)**

---

## 🤝 贡献

PR / issue 都欢迎。本仓库使用 pnpm monorepo：

```bash
pnpm install           # 安装依赖
pnpm dev               # watch 构建 core
pnpm dev:showcase      # 启动 Demo（端口 4200）
pnpm test              # 跑测试
pnpm typecheck         # 类型检查
pnpm lint              # ESLint
```

详细规范见 [CONTRIBUTING.md](./CONTRIBUTING.md) 和 [AGENTS.md](./AGENTS.md)。

---

## 📄 License

[MIT](./LICENSE) © ByePast
