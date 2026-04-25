# useNavigationDirection

获取当前导航方向的响应式引用。

## 函数签名

```ts
function useNavigationDirection(): ComputedRef<NavigationDirection>
```

## 返回值

返回一个 `ComputedRef<NavigationDirection>`，值为 `'forward'` | `'back'` | `'none'`。

## 示例

```vue
<script setup lang="ts">
import { useNavigationDirection } from '@bye_past/vue-keep'

const direction = useNavigationDirection()
// direction.value → 'forward' | 'back' | 'none'
</script>

<template>
  <div>当前导航方向: {{ direction }}</div>
</template>
```
