# UI Library Integration

Vue Keep works with any Vue 3 UI library. Here are integration patterns for popular libraries.

## Vant

Vant's `<van-nav-bar>` and `<van-tabbar>` pair naturally with Vue Keep.

### Layout with Tabbar

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const active = ref(0)

const tabs = [
  { path: '/home', icon: 'home-o', label: 'Home' },
  { path: '/category', icon: 'apps-o', label: 'Category' },
  { path: '/cart', icon: 'cart-o', label: 'Cart' },
  { path: '/profile', icon: 'user-o', label: 'Profile' },
]

async function onTabChange(index: number) {
  active.value = index
  await keepRouter.switchTab(tabs[index]!.path)
}
</script>

<template>
  <KeepRouterView />
  <van-tabbar v-model="active" @change="onTabChange">
    <van-tabbar-item v-for="tab in tabs" :key="tab.path" :icon="tab.icon">
      {{ tab.label }}
    </van-tabbar-item>
  </van-tabbar>
</template>
```

### NavBar with Back

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
</script>

<template>
  <van-nav-bar title="Detail" left-arrow @click-left="keepRouter.back()" />
</template>
```

### Pull-to-Refresh on Back

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onPageShow } from '@bye_past/vue-keep'

const list = ref([])
const loading = ref(false)

onPageShow(({ isFirstShow }) => {
  if (!isFirstShow) {
    // Refresh list when returning from detail
    onRefresh()
  }
})

async function onRefresh() {
  loading.value = true
  list.value = await fetchList()
  loading.value = false
}
</script>

<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <van-list>
      <van-cell v-for="item in list" :key="item.id" :title="item.title" />
    </van-list>
  </van-pull-refresh>
</template>
```

## Element Plus

### Tabs as Navigation

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import { useRoute } from 'vue-router'

const keepRouter = useKeepRouter()
const route = useRoute()

async function onTabClick(tab: any) {
  await keepRouter.switchTab(tab.props.name)
}
</script>

<template>
  <el-tabs :model-value="route.path" @tab-click="onTabClick">
    <el-tab-pane label="Dashboard" name="/dashboard" />
    <el-tab-pane label="Users" name="/users" />
    <el-tab-pane label="Settings" name="/settings" />
  </el-tabs>
  <KeepRouterView :transition="false" />
</template>
```

### Dialog Form with EventChannel

```vue
<!-- List page -->
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const tableData = ref([])

onPageShow(({ isFirstShow }) => {
  if (isFirstShow) fetchData()
})

async function openEditor(id: number) {
  await keepRouter.push(`/editor/${id}`, {
    events: {
      saved() {
        fetchData() // Refresh table after save
      },
    },
  })
}
</script>
```

## Naive UI

### Menu Navigation

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'
import { useRoute } from 'vue-router'

const keepRouter = useKeepRouter()
const route = useRoute()

async function onMenuSelect(key: string) {
  await keepRouter.switchTab(key)
}
</script>

<template>
  <n-layout has-sider>
    <n-layout-sider>
      <n-menu :value="route.path" :options="menuOptions" @update:value="onMenuSelect" />
    </n-layout-sider>
    <n-layout-content>
      <KeepRouterView :transition="false" />
    </n-layout-content>
  </n-layout>
</template>
```

## General Tips

- Disable Vue Keep transitions when the UI library provides its own page transitions.
- Use `onPageShow` instead of `onMounted` for data refresh on back navigation.
- For tab-based layouts, use `switchTab` instead of `push` to preserve tab state.
- Register custom scroll containers if the UI library uses non-standard scrollable elements (e.g., `<el-scrollbar>`, `<n-scrollbar>`):

```vue
<KeepRouterView :scroll-containers="['.el-scrollbar__wrap']" />
```
