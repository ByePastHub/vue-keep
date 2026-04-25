# usePageCache

获取和控制当前页面的缓存状态。

## 函数签名

```ts
function usePageCache(): {
  entry: ComputedRef<PageStackEntry | undefined>
  setConstCache(value: boolean): void
  destroySelf(): void
}
```

## 返回值

| 属性            | 类型                                       | 说明                           |
| --------------- | ------------------------------------------ | ------------------------------ |
| `entry`         | `ComputedRef<PageStackEntry \| undefined>` | 当前页面的栈条目               |
| `setConstCache` | `(value: boolean) => void`                 | 设置当前页面的 constCache 状态 |
| `destroySelf`   | `() => void`                               | 销毁当前页面缓存               |

## 示例

```vue
<script setup lang="ts">
import { usePageCache } from '@bye_past/vue-keep'

const { entry, setConstCache, destroySelf } = usePageCache()

// 查看当前页面信息
console.log(entry.value?.fullPath)
console.log(entry.value?.constCache)

// 标记为常驻缓存
setConstCache(true)

// 离开前销毁自身缓存
function handleLogout() {
  destroySelf()
  router.push('/login')
}
</script>
```
