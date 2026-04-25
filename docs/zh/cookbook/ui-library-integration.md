# 与 UI 库集成

## Vant

Vant 的 `van-list` 和 `van-pull-refresh` 与 Vue Keep 配合良好：

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { onPageShow } from '@bye_past/vue-keep'

const list = ref<Item[]>([])
const loading = ref(false)
const finished = ref(false)

onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    onLoad()
  }
})

async function onLoad() {
  loading.value = true
  const data = await fetchList()
  list.value.push(...data)
  loading.value = false
  if (data.length === 0) finished.value = true
}
</script>

<template>
  <van-pull-refresh v-model="loading" @refresh="onRefresh">
    <van-list v-model:loading="loading" :finished="finished" @load="onLoad">
      <van-cell v-for="item in list" :key="item.id" :title="item.title" />
    </van-list>
  </van-pull-refresh>
</template>
```

## Element Plus

Element Plus 的 `el-table` 和 `el-scrollbar` 需要标记滚动容器：

```vue
<template>
  <el-scrollbar data-scroll-container="table-scroll">
    <el-table :data="tableData">
      <!-- columns -->
    </el-table>
  </el-scrollbar>
</template>
```

## NaiveUI

NaiveUI 的 `n-layout` 使用自定义滚动容器：

```vue
<template>
  <n-layout has-sider>
    <n-layout-sider>
      <n-menu />
    </n-layout-sider>
    <n-layout-content content-style="overflow: auto" data-scroll-container="main-content">
      <KeepRouterView />
    </n-layout-content>
  </n-layout>
</template>
```

## 通用建议

1. 使用 `data-scroll-container` 标记 UI 库的自定义滚动容器
2. 使用 `onPageShow` 替代 `onMounted` 处理数据加载
3. 避免在 `onMounted` 中做只需要首次执行的操作，改用 `onPageShow` 的 `isFirstShow` 判断
