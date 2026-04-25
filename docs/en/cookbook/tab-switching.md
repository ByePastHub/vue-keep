# Tab Switching

`switchTab` navigates between tab pages while preserving their state. Unlike `push`, it doesn't stack — it swaps between persistent tab entries identified by a stable `tabKey`.

## Route Configuration

Define `tabKey` in route meta to give each tab a stable identity:

```ts
const routes = [
  {
    path: '/home',
    name: 'Home',
    component: () => import('./views/Home.vue'),
    meta: { keep: { tabKey: 'home' } },
  },
  {
    path: '/explore',
    name: 'Explore',
    component: () => import('./views/Explore.vue'),
    meta: { keep: { tabKey: 'explore' } },
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./views/Profile.vue'),
    meta: { keep: { tabKey: 'profile' } },
  },
  // Non-tab routes (normal push/back behavior)
  {
    path: '/detail/:id',
    name: 'Detail',
    component: () => import('./views/Detail.vue'),
  },
]
```

If `tabKey` is not set, Vue Keep falls back to the route `name` or `path`.

## Tab Bar Component

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import { useRoute } from 'vue-router'

const keepRouter = useKeepRouter()
const route = useRoute()

const tabs = [
  { path: '/home', label: 'Home', icon: 'home' },
  { path: '/explore', label: 'Explore', icon: 'search' },
  { path: '/profile', label: 'Profile', icon: 'user' },
]

async function switchTo(path: string) {
  await keepRouter.switchTab(path)
}
</script>

<template>
  <nav class="tab-bar">
    <button
      v-for="tab in tabs"
      :key="tab.path"
      :class="{ active: route.path === tab.path }"
      @click="switchTo(tab.path)"
    >
      {{ tab.label }}
    </button>
  </nav>
</template>
```

## Tab + Sub-Page Navigation

A typical flow:

1. User is on Home tab → `switchTab('/explore')` → Explore tab (cached)
2. On Explore → `push('/detail/1')` → Detail page (Explore cached)
3. On Detail → `back()` → Explore restored from cache
4. On Explore → `switchTab('/home')` → Home tab restored

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

// Navigate to a detail page from any tab
async function goDetail(id: number) {
  await keepRouter.push(`/detail/${id}`)
}

// Switch tabs
async function goHome() {
  await keepRouter.switchTab('/home')
}
</script>
```

## Keeping Tab Scroll Position

Tab pages automatically have their scroll positions saved and restored. When switching back to a tab, the user sees exactly where they left off.

If a tab has multiple scroll containers (e.g., horizontal carousels):

```vue
<KeepRouterView :scroll-containers="['.carousel']" />
```
