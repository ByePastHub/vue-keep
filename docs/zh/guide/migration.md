# 从 v1 迁移

## 概述

Vue Keep v2 是完全重写的版本，API 设计参考了微信小程序的页面栈模型。以下是主要变更。

## 安装变更

```diff
- import VueKeep from '@bye_past/vue-keep'
+ import { createKeepRouter } from '@bye_past/vue-keep'
```

v1 使用默认导出的插件对象，v2 使用工厂函数。

## 初始化变更

```diff
- app.use(VueKeep, router)
+ const keepRouter = createKeepRouter({ router })
+ app.use(keepRouter)
```

## 组件变更

`<keep-router-view>` 组件名不变，但 props 有变化：

```diff
- <keep-router-view :max="5" :exclude="['Login']" />
+ <KeepRouterView :max="5" :exclude="['Login']" :transition="'slide'" />
```

新增 props：`transition`、`scrollContainers`、`containerId`。

## 导航方式变更

v1 通过劫持 `router.push` / `router.replace` 实现，v2 提供独立的导航方法：

```diff
- router.push('/detail/1')
- router.replace('/')
- router.go(-1)
+ const keepRouter = useKeepRouter()
+ keepRouter.push('/detail/1')
+ keepRouter.replace('/')
+ keepRouter.back()
```

新增方法：`reLaunch`、`switchTab`。

## 缓存控制变更

v1 通过 `beforeEach` 钩子和 `constCache` 路由属性控制：

```diff
- // v1: 路由属性
- { path: '/', meta: { constCache: true } }
+ // v2: keep 命名空间
+ { path: '/', meta: { keep: { constCache: true } } }
```

```diff
- // v1: beforeEach 返回值
- beforeEach((to, from) => ({ constCache: true }))
+ // v2: keepRouter.beforeEach
+ keepRouter.beforeEach((to, from, direction) => ({ constCache: true }))
```

## 事件系统变更

v1 使用 `window` CustomEvent 通信，v2 使用 EventChannel：

```diff
- // v1: 监听路由变更事件
- window.addEventListener('KEEP_ROUTE_CHANGE', handler)
+ // v2: 使用 EventChannel
+ keepRouter.push('/form', {
+   events: { onSave(data) { /* ... */ } }
+ })
```

## 生命周期变更

v1 没有专门的页面生命周期钩子，v2 新增：

```ts
import { onPageShow, onPageHide } from '@bye_past/vue-keep'

onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    /* 首次加载 */
  } else {
    /* 从缓存恢复 */
  }
})
```

## 类型系统变更

v2 提供完整的 TypeScript 类型定义，支持声明合并：

```ts
declare module '@bye_past/vue-keep' {
  interface PageEventMap {
    onSave: (data: SaveData) => void
  }
}
```

## 移除的功能

| v1 功能                     | v2 替代方案               |
| --------------------------- | ------------------------- |
| `destroy()` 全局函数        | `keepRouter.destroy()`    |
| `beforeEach()` 全局函数     | `keepRouter.beforeEach()` |
| `window` CustomEvent        | EventChannel              |
| `history.state` 注入        | 内部 IntentTracker        |
| `sessionStorage` 历史记录栈 | 内部 CoreStore            |

## 迁移步骤

1. 更新安装方式：`createKeepRouter` 替代默认导出
2. 替换导航方法：`router.push` → `keepRouter.push`
3. 更新路由 meta：`meta.constCache` → `meta.keep.constCache`
4. 替换事件监听：CustomEvent → EventChannel
5. 添加生命周期钩子：`onPageShow` / `onPageHide`
6. 引入动画 CSS（如需要）
