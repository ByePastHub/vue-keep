# Quick Start

## Installation

::: code-group

```sh [pnpm]
pnpm add @bye_past/vue-keep
```

```sh [npm]
npm install @bye_past/vue-keep
```

```sh [yarn]
yarn add @bye_past/vue-keep
```

:::

## Basic Setup

### 1. Create Keep Router

```ts
// main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import App from './App.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('./pages/Home.vue') },
    { path: '/list', component: () => import('./pages/List.vue') },
    { path: '/detail/:id', component: () => import('./pages/Detail.vue') },
  ],
})

const keepRouter = createKeepRouter({
  router,
  max: 10,
  scrollBehavior: 'auto',
  transition: 'slide',
})

const app = createApp(App)
app.use(router)
app.use(keepRouter)
app.mount('#app')
```

### 2. Replace RouterView

```vue
<!-- App.vue -->
<template>
  <KeepRouterView />
</template>
```

### 3. Import Animation CSS (Optional)

```ts
import '@bye_past/vue-keep/animations.css'
```

## Navigation

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

function goDetail(id: number) {
  keepRouter.push(`/detail/${id}`)
}

function goBack() {
  keepRouter.back()
}

function goHome() {
  keepRouter.reLaunch('/')
}
</script>
```

## First Cached Page

```vue
<!-- pages/List.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `Item ${i + 1}`,
  })),
)

onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    console.log('List page first load')
  } else {
    console.log('Returned from detail page')
  }
})
</script>

<template>
  <div class="list">
    <div
      v-for="item in items"
      :key="item.id"
      class="item"
      @click="keepRouter.push(`/detail/${item.id}`)"
    >
      {{ item.title }}
    </div>
  </div>
</template>
```

Scroll the list, tap an item, then go back — the list restores to its previous scroll position.
