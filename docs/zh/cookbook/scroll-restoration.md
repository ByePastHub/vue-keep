# 滚动恢复最佳实践

## 基本场景

默认配置下，Vue Keep 会自动处理滚动恢复。以下是一些需要额外注意的场景。

## 懒加载图片

当列表包含懒加载图片时，返回时 DOM 高度可能还没恢复到保存时的高度。Vue Keep 的 ResizeObserver 会等待高度稳定后再恢复滚动位置。

```vue
<template>
  <div class="list">
    <div v-for="item in items" :key="item.id" class="item">
      <img :src="item.image" loading="lazy" />
      <span>{{ item.title }}</span>
    </div>
  </div>
</template>
```

无需额外配置，Vue Keep 会自动处理。

## 多滚动容器

页面中有多个独立滚动区域时，用 `data-scroll-container` 标记：

```vue
<template>
  <div class="page">
    <aside data-scroll-container="sidebar" style="overflow: auto; height: 100vh">
      <nav><!-- 侧边栏导航 --></nav>
    </aside>
    <main data-scroll-container="content" style="overflow: auto; height: 100vh">
      <article><!-- 主内容 --></article>
    </main>
  </div>
</template>
```

## 虚拟滚动列表

虚拟滚动列表（如 `vue-virtual-scroller`）需要特殊处理，因为 DOM 元素是动态创建的：

```vue
<script setup lang="ts">
import { useScrollRestoration, onPageShow } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

onPageShow((ctx) => {
  if (!ctx.isFirstShow) {
    // 虚拟列表需要先恢复数据状态，再恢复滚动
    scroll.pause()
    restoreListState()
    nextTick(() => {
      scroll.resume()
      scroll.restore()
    })
  }
})
</script>
```

## 禁用特定页面的滚动恢复

```ts
const routes = [
  {
    path: '/search',
    component: Search,
    meta: {
      keep: {
        scrollBehavior: 'none', // 搜索页不恢复滚动
      },
    },
  },
]
```
