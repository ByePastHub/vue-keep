# 嵌套路由

## 多层 KeepRouterView

Vue Keep 支持嵌套路由，每层 `<KeepRouterView>` 独立管理自己的页面栈。

```vue
<!-- App.vue — 顶层 -->
<template>
  <KeepRouterView />
</template>
```

```vue
<!-- layouts/TabLayout.vue — 嵌套层 -->
<template>
  <div class="tab-layout">
    <KeepRouterView />
    <TabBar />
  </div>
</template>
```

路由配置：

```ts
const routes = [
  {
    path: '/',
    component: TabLayout,
    children: [
      { path: '', component: Home },
      { path: 'list', component: List },
    ],
  },
  { path: '/detail/:id', component: Detail },
]
```

## depth 自动递增

每层 `<KeepRouterView>` 的 `depth` 自动递增：

- 顶层 `<KeepRouterView>` → depth: 0
- 嵌套的 `<KeepRouterView>` → depth: 1
- 再嵌套 → depth: 2

depth 用于确定当前 `<KeepRouterView>` 应该渲染路由配置中的哪一层 `matched` 组件。

## 父子栈独立

每层 `<KeepRouterView>` 维护独立的 include 列表和页面栈。父层的缓存管理不会影响子层。

## containerId 自定义

默认情况下，每个 `<KeepRouterView>` 会自动生成一个 containerId。你也可以手动指定：

```vue
<KeepRouterView container-id="main" />
<KeepRouterView container-id="sidebar" />
```

这在同一层级有多个 `<KeepRouterView>` 时很有用。
