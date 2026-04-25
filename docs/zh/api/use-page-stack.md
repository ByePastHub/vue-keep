# usePageStack

获取当前容器的页面栈状态。

## 函数签名

```ts
function usePageStack(): {
  stack: ComputedRef<readonly PageStackEntry[]>
  size: ComputedRef<number>
}
```

## 返回值

| 属性    | 类型                                     | 说明                     |
| ------- | ---------------------------------------- | ------------------------ |
| `stack` | `ComputedRef<readonly PageStackEntry[]>` | 当前容器的页面栈（只读） |
| `size`  | `ComputedRef<number>`                    | 栈深度                   |

## 示例

```vue
<script setup lang="ts">
import { usePageStack } from '@bye_past/vue-keep'

const { stack, size } = usePageStack()

// 显示面包屑
// stack.value → [{ name: 'Home', ... }, { name: 'List', ... }, { name: 'Detail', ... }]
</script>

<template>
  <nav>
    <span v-for="entry in stack" :key="entry.id">
      {{ entry.name }}
    </span>
    <span>栈深度: {{ size }}</span>
  </nav>
</template>
```
