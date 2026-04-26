# 快速上手

## 安装

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

## 基本配置

### 1. 创建 Keep Router

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
  max: 10, // 页面栈最大深度
  scrollBehavior: 'auto', // 自动恢复滚动位置
  transition: 'slide', // 使用 slide 动画预设
})

const app = createApp(App)
app.use(router)
app.use(keepRouter)
app.mount('#app')
```

### 2. 替换 RouterView

```vue
<!-- App.vue -->
<template>
  <KeepRouterView />
</template>
```

`KeepRouterView` 在安装插件时已全局注册，直接使用即可。

### 3. 引入动画样式（可选）

如果配置了 `transition`，需要引入对应的 CSS：

```ts
// main.ts
import '@bye_past/vue-keep/animations.css'
```

## 自动导入（可选）

`unplugin-auto-import` 的 `imports` 字符串只识别内置 preset。使用 `@bye_past/vue-keep`
时，请引入包内提供的 preset 对象：

```ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'
import { VueKeepAutoImports } from '@bye_past/vue-keep/auto-imports'

export default {
  plugins: [
    AutoImport({
      imports: ['vue', 'vue-router', VueKeepAutoImports],
      dts: 'auto-imports.d.ts',
    }),
  ],
}
```

## 使用导航方法

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

// 前进到新页面（缓存当前页面）
function goDetail(id: number) {
  keepRouter.push(`/detail/${id}`)
}

// 返回上一页（恢复缓存）
function goBack() {
  keepRouter.back()
}

// 重启到首页（清空所有缓存）
function goHome() {
  keepRouter.reLaunch('/')
}
</script>
```

## 第一个缓存页面

创建一个列表页，滚动后跳转详情页，返回时自动恢复滚动位置：

```vue
<!-- pages/List.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const items = ref(
  Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    title: `商品 ${i + 1}`,
  })),
)

onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    console.log('列表页首次加载')
  } else {
    console.log('从详情页返回')
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

```vue
<!-- pages/Detail.vue -->
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useKeepRouter } from '@bye_past/vue-keep'

const route = useRoute()
const keepRouter = useKeepRouter()
</script>

<template>
  <div class="detail">
    <button @click="keepRouter.back()">返回</button>
    <h1>商品详情 #{{ route.params.id }}</h1>
  </div>
</template>
```

现在滚动列表到底部，点击某个商品进入详情页，再点返回 — 列表会恢复到之前的滚动位置。
