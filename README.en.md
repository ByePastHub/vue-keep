<div align="right">

[简体中文](./README.md) | **English**

</div>

<h1 align="center">@bye_past/vue-keep</h1>

<p align="center">
  <strong>Page-stack caching for Vue 3, modeled after WeChat Mini Program navigation</strong>
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
  <a href="https://bypasthub.github.io/vue-keep/en/">📘 Documentation</a> ·
  <a href="https://bypasthub.github.io/vue-keep/demo/">🎮 Live Demo</a> ·
  <a href="https://stackblitz.com/github/ByePastHub/vue-keep/tree/master/playground/showcase?file=src/main.ts">⚡ StackBlitz</a> ·
  <a href="./README.md">🌐 中文</a>
</p>

---

## 📖 Introduction

`@bye_past/vue-keep` is a Vue 3 + Vue Router 4 page-cache library that brings the WeChat Mini Program navigation experience to the web:

- **Forward = fresh** — new pages mount and load normally
- **Back = preserved** — page state, form input and scroll position (including container scroll) are restored
- **Direction-aware transitions** — built-in slide / fade / zoom presets, slide-left on forward / slide-right on back
- **No global pollution** — does not hijack History API, SSR-safe, tree-shakable
- **Type-safe** — full TypeScript with end-to-end inference

> Swap one component (`<router-view>` → `<KeepRouterView>`) and the whole experience kicks in.

### ✨ Highlights

| Capability                     | Notes                                                                                       |
| ------------------------------ | ------------------------------------------------------------------------------------------- |
| 🧭 Five navigation methods     | `push` / `replace` / `back` / `reLaunch` / `switchTab` — aligned with `wx.navigateTo` etc.  |
| 🗂️ Page-stack management       | LRU eviction, `max` cap, `constCache` pinning                                               |
| 📜 Scroll restoration          | Sync + nextTick + ResizeObserver + 600 ms fallback, serialized between consecutive restores |
| 🎬 Direction-aware transitions | Auto switch by navigation direction, opt-in CSS                                             |
| 📡 Cross-page channel          | `useEventChannel`, mirrors Mini Program's EventChannel                                      |
| 🪝 Mini-program lifecycle      | `onPageShow` / `onPageHide`, with `isFirstShow`                                             |
| 🪜 Nested caching              | Multi-level `<KeepRouterView>`, independent stacks per level                                |
| 🛠️ DevTools                    | Vue DevTools integration (Phase 3)                                                          |
| 📦 Tiny                        | gzip ~9 KB (CSS not included)                                                               |

---

## 🚀 Quick Start

### Install

```bash
# Alpha channel
pnpm add @bye_past/vue-keep@alpha
# or
npm install @bye_past/vue-keep@alpha
# or
yarn add @bye_past/vue-keep@alpha
```

Requires `vue ^3.4.0` and `vue-router ^4.2.0` as peer dependencies.

### Three-step integration

#### 1. Register the plugin

```ts
// main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import '@bye_past/vue-keep/animations.css' // opt-in transition CSS
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
  max: 10, // stack-depth cap; LRU eviction beyond this
  transition: 'slide', // 'slide' | 'fade' | 'zoom' | false
  scrollBehavior: 'auto', // 'auto' | 'none'
})

const app = createApp(App)
app.use(router)
app.use(keepRouter)
app.mount('#app')
```

#### 2. Replace `<router-view>`

```vue
<!-- App.vue -->
<template>
  <KeepRouterView />
</template>
```

#### 3. Use the navigation API

```vue
<script setup lang="ts">
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

// Mini-program style lifecycle
onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    loadData() // first entry
  } else {
    refreshIfNeeded() // returning from another page
  }
})

function gotoDetail(id: number) {
  keepRouter.push(`/detail/${id}`) // push onto the stack
}
function goBack() {
  keepRouter.back() // back, state preserved
}
function logout() {
  keepRouter.reLaunch('/login') // clear the entire stack
}
</script>
```

You can also call it from plain JS / TS modules after the plugin is installed:

```ts
import { useKeepRouter } from '@bye_past/vue-keep'

export async function navigateToLogin() {
  const keepRouter = useKeepRouter()
  await keepRouter.push('/login')
}
```

Done. Every page gets _forward = fresh, back = preserved_ behavior with no extra wiring.

---

## 🧭 Navigation cheat sheet

Aligned 1:1 with WeChat Mini Program semantics:

| WeChat Mini Program | vue-keep                     | Stack behavior     | Old page           | New page          |
| ------------------- | ---------------------------- | ------------------ | ------------------ | ----------------- |
| `wx.navigateTo`     | `keepRouter.push(path)`      | Push               | deactivated (kept) | mounted           |
| `wx.redirectTo`     | `keepRouter.replace(path)`   | Replace top        | unmounted          | mounted           |
| `wx.navigateBack`   | `keepRouter.back(n?)`        | Pop n              | unmounted          | activated         |
| `wx.reLaunch`       | `keepRouter.reLaunch(path)`  | Clear all          | all unmounted      | mounted           |
| `wx.switchTab`      | `keepRouter.switchTab(path)` | Top-level swap     | deactivated        | activated/mounted |
| `EventChannel`      | `useEventChannel()`          | Cross-page channel | —                  | —                 |
| `onShow` / `onHide` | `onPageShow` / `onPageHide`  | Lifecycle          | —                  | —                 |

---

## 🛠️ Common scenarios

### 1. List → Detail → Back

User scrolls to row 50 in the list, opens a detail page, then comes back. The list stays at row 50 with the same data — no reload.

```vue
<!-- List page: nothing to wire up, works out of the box -->
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

### 2. Refresh the list after payment

```ts
// payment-result page
const keepRouter = useKeepRouter()
keepRouter.destroy('orderList') // drop the cached list
keepRouter.back() // list will re-mount on return
```

### 3. Filter page sends data back

```ts
// list page
keepRouter.push('/filter', {
  events: {
    applyFilter: (filter) => {
      query.value = filter
      reload()
    },
  },
})

// filter page
import { useEventChannel } from '@bye_past/vue-keep'
const channel = useEventChannel<{ applyFilter: { tag: string } }>()
channel.emit('applyFilter', { tag: 'newest' })
keepRouter.back()
```

### 4. Tab + nested routes

Switching the bottom tab keeps each tab's child-route stack intact:

```vue
<!-- App.vue -->
<KeepRouterView />
<!-- top: tab-level stack -->

<!-- TabHome.vue -->
<KeepRouterView />
<!-- nested: per-tab child stack -->
```

### 5. Pinned cache (constCache)

Pages like cart or profile that should never be evicted:

```ts
// route config
{
  path: '/cart',
  component: Cart,
  meta: { keep: { constCache: true } }
}
```

More recipes: **[Cookbook](https://bypasthub.github.io/vue-keep/en/cookbook/scroll-restoration)**.

---

## 📚 API at a glance

### `<KeepRouterView>` props

| Prop               | Type                                                       | Default     | Description                      |
| ------------------ | ---------------------------------------------------------- | ----------- | -------------------------------- |
| `max`              | `number`                                                   | `10`        | Stack-depth cap                  |
| `cacheMax`         | `number`                                                   | same as max | KeepAlive cache cap              |
| `exclude`          | `string \| RegExp \| Array \| Function`                    | —           | Components to skip               |
| `include`          | `string \| RegExp \| Array \| Function`                    | —           | Components to keep only          |
| `containerId`      | `string`                                                   | auto        | Manual id for nested usage       |
| `transition`       | `false \| 'slide' \| 'fade' \| 'zoom' \| TransitionConfig` | `'slide'`   | Page transition                  |
| `scrollContainers` | `string[]`                                                 | —           | Extra scroll-container selectors |

### Composables

```ts
import {
  useKeepRouter, // navigation: push/replace/back/reLaunch/switchTab/destroy
  usePageCache, // current page: isCached/markAsCached/setConstCache
  useNavigationDirection, // reactive direction ('forward' | 'back' | 'none')
  useEventChannel, // cross-page channel
  useScrollRestoration, // manual scroll-restore controls
  usePageStack, // read-only stack snapshot
  onPageShow, // page show (including first entry)
  onPageHide, // page hide
} from '@bye_past/vue-keep'
```

### Route meta extension

```ts
{
  path: '/detail/:id',
  component: Detail,
  meta: {
    keep: {
      cache: true,        // cache or not (default true)
      constCache: false,  // pin in cache
      destroy: 'list',    // drop other caches when entering this page
      tabKey: 'home',     // tab id used by switchTab
      transition: 'fade', // per-page transition
    }
  }
}
```

Full API: **[API reference](https://bypasthub.github.io/vue-keep/en/api/create-keep-router)**.

---

## 🆚 Comparison

| Aspect                                | vue-keep 2.0 | vue-page-stack   | stack-keep-alive |
| ------------------------------------- | ------------ | ---------------- | ---------------- |
| Doesn't hijack History API            | ✅           | ❌               | ❌               |
| Built-in direction-aware transitions  | ✅           | ❌               | ❌               |
| eventChannel data return              | ✅           | ❌               | ❌               |
| Scroll restoration (incl. containers) | ✅           | ⚠️ document only | ⚠️               |
| Independent nested stacks             | ✅           | ❌               | ✅               |
| Full TypeScript types                 | ✅           | ⚠️               | ⚠️               |
| SSR-safe                              | ✅           | ❌               | ❌               |
| gzip size                             | ~9 KB        | ~12 KB           | ~8 KB            |
| Vue DevTools integration              | ✅           | ❌               | ❌               |

---

## 🌍 Environment support

- Modern browsers with ES2020 support
- Vue 3.4+, Vue Router 4.2+ (uses `history.listen` info)
- SSR-safe (Nuxt 3 friendly)
- iOS Safari rubber-band scroll is clamped

---

## 🔗 Resources

- 📘 **[English Docs](https://bypasthub.github.io/vue-keep/en/)** · **[中文文档](https://bypasthub.github.io/vue-keep/zh/)**
- 🎮 **[Live Demo (showcase)](https://bypasthub.github.io/vue-keep/demo/)**
- ⚡ **[StackBlitz Edit-in-browser](https://stackblitz.com/github/ByePastHub/vue-keep/tree/master/playground/showcase?file=src/main.ts)**
- 📋 **[PRD](./PRD.md)**
- 🤝 **[Contributing](./CONTRIBUTING.md)**
- 🐛 **[Issues](https://github.com/ByePastHub/vue-keep/issues)**

---

## 🤝 Contributing

PRs and issues welcome. This is a pnpm monorepo:

```bash
pnpm install           # install deps
pnpm dev               # watch-build core
pnpm dev:showcase      # start the Demo (port 4200)
pnpm test              # run tests
pnpm typecheck         # type-check
pnpm lint              # ESLint
```

See [CONTRIBUTING.md](./CONTRIBUTING.md) and [AGENTS.md](./AGENTS.md) for details.

---

## 📄 License

[MIT](./LICENSE) © ByePast
