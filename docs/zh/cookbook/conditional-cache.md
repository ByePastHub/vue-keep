# 条件缓存

## 场景

某些页面只在特定条件下需要缓存，例如：

- 从列表进入详情需要缓存列表，但从搜索进入不需要
- 登录页在登录成功后不应该被缓存

## 导航时控制

```ts
// 从列表进入详情：缓存列表
keepRouter.push('/detail/1', { cache: true })

// 从搜索进入详情：不缓存搜索页
keepRouter.push('/detail/1', { cache: false })
```

## beforeEach 守卫

```ts
const keepRouter = createKeepRouter({
  router,
  // ...
})

keepRouter.beforeEach((to, from, direction) => {
  // 登录页不缓存
  if (from.path === '/login') {
    return { cache: false }
  }

  // VIP 页面常驻缓存
  if (to.meta.vip) {
    return { constCache: true }
  }
})
```

## 组件内控制

```vue
<script setup lang="ts">
import { usePageCache, onPageHide } from '@bye_past/vue-keep'

const cache = usePageCache()

onPageHide((ctx) => {
  // 如果是前进到支付页，销毁当前页缓存
  if (ctx.to?.path === '/payment') {
    cache.destroySelf()
  }
})
</script>
```

## 动态 constCache

```vue
<script setup lang="ts">
import { usePageCache } from '@bye_past/vue-keep'

const cache = usePageCache()

// 用户编辑了内容后，标记为常驻缓存防止丢失
function onFormDirty() {
  cache.setConstCache(true)
}

// 保存成功后，取消常驻缓存
function onSaved() {
  cache.setConstCache(false)
}
</script>
```
