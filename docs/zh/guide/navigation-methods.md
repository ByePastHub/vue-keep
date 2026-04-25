# 导航方法

## push

前进到新页面，缓存当前页面。

```ts
const keepRouter = useKeepRouter()

// 基本用法
keepRouter.push('/detail/1')

// 带选项
keepRouter.push('/detail/1', {
  cache: true, // 缓存当前页面（默认 true）
  constCache: false, // 是否常驻缓存
  metadata: { from: 'list' }, // 附加元数据
})

// 使用路由对象
keepRouter.push({ name: 'detail', params: { id: 1 } })
```

### 带 EventChannel

```ts
keepRouter.push('/address/edit', {
  events: {
    onSave(address: Address) {
      console.log('收到地址数据:', address)
    },
  },
})
```

## replace

替换当前页面，销毁当前页面实例。

```ts
// 登录成功后替换到首页
keepRouter.replace('/')

// 带销毁选项
keepRouter.replace('/new-page', {
  destroy: 'LoginPage', // 同时销毁登录页缓存
})
```

## back

返回上一页，销毁当前页面，恢复缓存的页面。

```ts
// 返回上一页
keepRouter.back()

// 返回多级
keepRouter.back(2)
```

## reLaunch

清空所有缓存页面，创建新页面。适用于支付完成、退出登录等场景。

```ts
// 支付完成，回到首页
keepRouter.reLaunch('/')

// 退出登录，清空所有状态
keepRouter.reLaunch('/login')
```

## switchTab

切换到 Tab 页面。Tab 页面通过路由 meta 标记：

```ts
// 路由配置
const routes = [
  {
    path: '/home',
    component: Home,
    meta: { keep: { tabKey: 'home' } },
  },
  {
    path: '/cart',
    component: Cart,
    meta: { keep: { tabKey: 'cart' } },
  },
]

// 切换 Tab
keepRouter.switchTab('/cart')
```

每个 Tab 维护独立的子栈，切换时保留各 Tab 的页面状态。

## destroy

手动销毁缓存页面。

```ts
// 按名称销毁
keepRouter.destroy('ListPage')

// 批量销毁
keepRouter.destroy(['ListPage', 'DetailPage'])

// 销毁全部
keepRouter.destroy('ALL')

// 条件销毁
keepRouter.destroy((entry) => entry.fullPath.startsWith('/temp'))
```

## beforeEach

注册导航守卫，在每次导航前执行。

```ts
const removeGuard = keepRouter.beforeEach((to, from, direction) => {
  // 可以返回缓存控制选项
  if (to.path === '/vip') {
    return { constCache: true }
  }
})

// 移除守卫
removeGuard()
```

## 与 Vue Router 的关系

Vue Keep 的导航方法内部调用 Vue Router 的 `router.push` / `router.replace` / `router.go`，并在导航前后注入缓存管理逻辑。你仍然可以使用 Vue Router 的原生方法，但不会触发 Vue Keep 的缓存管理。

```ts
import { useRouter } from 'vue-router'
import { useKeepRouter } from '@bye_past/vue-keep'

const router = useRouter() // Vue Router 原生
const keepRouter = useKeepRouter() // Vue Keep 增强

// 推荐：使用 keepRouter 进行导航
keepRouter.push('/detail/1')

// 也可以：使用 router，但不会触发缓存管理
router.push('/detail/1')
```
