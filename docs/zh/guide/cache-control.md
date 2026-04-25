# 页面缓存控制

## route.meta.keep 配置

在路由定义中通过 `meta.keep` 配置页面的缓存行为：

```ts
const routes = [
  {
    path: '/',
    component: Home,
    meta: {
      keep: {
        constCache: true, // 常驻缓存，不被 LRU 淘汰
        tabKey: 'home', // Tab 标识
      },
    },
  },
  {
    path: '/login',
    component: Login,
    meta: {
      keep: false, // 禁用缓存
    },
  },
]
```

## 导航时控制缓存

通过 `push` / `replace` 的第二个参数控制：

```ts
// 不缓存当前页面
keepRouter.push('/next', { cache: false })

// 将目标页标记为常驻缓存
keepRouter.push('/important', { constCache: true })

// 导航前销毁指定缓存
keepRouter.push('/fresh', {
  destroy: 'OldPage',
})
```

## usePageCache

在组件内使用 `usePageCache` 获取和控制当前页面的缓存状态：

```vue
<script setup lang="ts">
import { usePageCache } from '@bye_past/vue-keep'

const cache = usePageCache()

// 获取当前页面的栈条目
console.log(cache.entry.value)

// 标记为常驻缓存
cache.setConstCache(true)

// 销毁当前页面缓存（导航离开后生效）
cache.destroySelf()
</script>
```

## destroy 方法

`keepRouter.destroy` 提供多种销毁方式：

```ts
const keepRouter = useKeepRouter()

// 按组件名销毁
keepRouter.destroy('ListPage')

// 批量销毁
keepRouter.destroy(['ListPage', 'DetailPage'])

// 销毁全部（除当前页面）
keepRouter.destroy('ALL')

// 条件销毁
keepRouter.destroy((entry) => {
  // 销毁所有非 constCache 的页面
  return !entry.constCache
})
```

## 全局排除/包含

通过 `createKeepRouter` 的 `exclude` / `include` 选项全局控制：

```ts
createKeepRouter({
  router,
  // 这些页面永远不缓存
  exclude: ['LoginPage', 'RegisterPage'],
  // 或使用正则
  exclude: /^(Login|Register)/,
  // 或使用函数
  exclude: (name, route) => route.path.startsWith('/auth'),
})
```

## LRU 淘汰钩子

```ts
createKeepRouter({
  router,
  max: 10,
  onBeforeEvict(entry) {
    console.log(`即将淘汰: ${entry.name}`)
    // 返回 false 阻止淘汰
    if (entry.metadata.important) return false
  },
})
```
