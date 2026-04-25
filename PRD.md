# vue-keep 2.0 产品需求文档（PRD）

> 版本：2.0.0 | 日期：2026-04-24 | 作者：ByePast

---

## 1. 产品定位

**一句话描述**：Vue 3 页面缓存库，复刻微信小程序页面栈体验 —— 前进刷新、返回保留状态和滚动位置。

**目标用户**：使用 Vue 3 + Vue Router 4 开发移动端 H5 / Hybrid App / 后台管理系统的前端开发者。

**核心价值**：

- 开箱即用：替换 `<router-view>` 为 `<KeepRouterView>`，零配置即可获得页面缓存能力
- 微信小程序语义：push/replace/back/reLaunch/switchTab 五种导航方式，生命周期与小程序对齐
- 动画友好：内置方向感知过渡动画，前进左滑、返回右滑，可完全自定义
- 滚动无缝：返回时自动恢复页面和容器内滚动位置
- 类型安全：全量 TypeScript，端到端类型推断

**竞品对标**：vue-page-stack、stack-keep-alive。vue-keep 2.0 的差异化在于：不污染全局 History API、内置动画系统、eventChannel 数据回传、DevTools 可视化、SSR 安全、gzip < 5KB。

---

## 2. 技术约束

| 约束                | 值                       |
| ------------------- | ------------------------ |
| Vue 最低版本        | 3.4.0                    |
| Vue Router 最低版本 | 4.2.0                    |
| 包名                | @bye_past/vue-keep       |
| 起始版本            | 2.0.0                    |
| 包体积红线          | gzip < 5KB（不含 CSS）   |
| 构建格式            | ESM + CJS 双格式         |
| SSR                 | 安全（Nuxt 场景不报错）  |
| 浏览器兼容          | 支持 ES2020 的现代浏览器 |

---

## 3. 功能需求

### 3.1 核心功能（P0 — Phase 1/2）

#### 3.1.1 页面栈管理

**描述**：维护一个与浏览器 history 对齐的页面栈，自动管理 Vue `<KeepAlive>` 的 include 列表。

**导航方式与栈行为**：

| 导航方式  | 对应小程序 API  | 栈行为        | 旧页面                  | 新页面            |
| --------- | --------------- | ------------- | ----------------------- | ----------------- |
| push      | wx.navigateTo   | 新页面入栈    | deactivated（保留实例） | mounted           |
| replace   | wx.redirectTo   | 替换栈顶      | unmounted（销毁实例）   | mounted           |
| back(n)   | wx.navigateBack | 弹出栈顶 n 个 | unmounted               | activated         |
| reLaunch  | wx.reLaunch     | 清空所有栈    | 全部 unmounted          | mounted           |
| switchTab | wx.switchTab    | 顶层栈切换    | deactivated             | activated/mounted |

**配置项**：

- `max`：栈深上限，默认 10。超限时 LRU 淘汰最久未激活的非 constCache 条目
- `exclude`：全局排除不缓存的组件（字符串/正则/数组/函数）
- `include`：全局白名单
- `constCache`：标记某个页面为常驻缓存，LRU 淘汰时跳过

**验收标准**：

- [ ] push 5 次后 back，前一页 onActivated 触发，DOM 状态保留
- [ ] push 超过 max 后，最旧的非 constCache 页面被淘汰
- [ ] replace 后旧页面 onUnmounted 触发
- [ ] reLaunch 后所有缓存清空，浏览器后退无法回到旧页面
- [ ] constCache 页面在 LRU 淘汰时不被移除

#### 3.1.2 导航方向判定

**描述**：准确判定每次导航是前进、后退还是替换，不劫持浏览器 History API。

**实现方式**：消费 Vue Router 4.2+ 的 `router.options.history.listen` 提供的 `info.direction` 和 `info.delta`。

**验收标准**：

- [ ] 编程式 push 识别为 forward
- [ ] 浏览器后退按钮识别为 back
- [ ] 浏览器前进按钮识别为 forward
- [ ] replace 识别为 none
- [ ] go(-3) 识别为 back，delta = -3

#### 3.1.3 主动销毁缓存

**描述**：在任意页面主动移除指定页面的缓存，使其下次进入时重新 mounted。

**API**：

```ts
// 销毁指定页面
keepRouter.destroy('detail')
// 销毁多个
keepRouter.destroy(['detail', 'list'])
// 销毁全部
keepRouter.destroy('ALL')
// 条件销毁
keepRouter.destroy((entry) => entry.fullPath.startsWith('/order'))
```

**典型场景**：订单详情页支付成功后，销毁订单列表缓存，返回时重新加载最新数据。

**验收标准**：

- [ ] destroy 后对应页面从 KeepAlive include 中移除
- [ ] 下次进入该页面时 onMounted 重新触发
- [ ] destroy('ALL') 清空所有缓存

#### 3.1.4 刷新恢复

**描述**：页面刷新后，通过 history.state 恢复当前位置标识，使后续 back 操作正确。

**行为**：刷新后组件状态重建（与小程序冷启动一致），但栈位置信息保留。

**验收标准**：

- [ ] 刷新详情页后，点击浏览器后退能正确回到列表页
- [ ] 无痕模式下 persist 失败时优雅降级为纯内存栈
- [ ] SSR 环境下不报错

---

### 3.2 滚动恢复（P0 — Phase 2）

**描述**：返回缓存页面时，自动恢复页面滚动位置和容器内滚动位置。

**容器发现策略**：

1. `document.scrollingElement`（页面主滚动）
2. 带 `data-scroll-container` 属性的元素（用户显式标记）

**恢复策略**：

1. `onActivated` + `nextTick` 立即恢复
2. `ResizeObserver` 监听高度变化（懒加载图片），按比例调整
3. 600ms 超时兜底

**API**：

```ts
const { save, restore, pause, resume, registerContainer } = useScrollRestoration()
```

**与 Vue Router scrollBehavior 共存**：

```ts
const router = createRouter({
  scrollBehavior: createKeepScrollBehavior(), // 我们提供的 helper
})
```

**验收标准**：

- [ ] 列表页滚动到第 50 条 → 进入详情 → 返回，列表页滚动位置恢复
- [ ] 页面内带 `data-scroll-container` 的容器滚动位置也恢复
- [ ] 懒加载图片撑高后，滚动位置按比例调整
- [ ] iOS Safari 弹性滚动不导致位置异常

---

### 3.3 方向感知动画（P0 — Phase 2）

**描述**：根据导航方向自动切换页面过渡动画，模拟原生 App 体验。

**内置预设**：
| 预设 | 前进动画 | 后退动画 |
|---|---|---|
| slide | 新页面从右滑入 | 当前页面向右滑出 |
| fade | 淡入 | 淡出 |
| zoom | 放大进入 | 缩小退出 |

**使用方式**：

```vue
<!-- 开箱即用 -->
<KeepRouterView transition="slide" />

<!-- 关闭动画 -->
<KeepRouterView :transition="false" />

<!-- 完全自定义 -->
<KeepRouterView>
  <template #default="{ Component, direction }">
    <Transition :name="direction === 'back' ? 'my-right' : 'my-left'">
      <component :is="Component" />
    </Transition>
  </template>
</KeepRouterView>
```

**CSS 按需引入**：`import '@bye_past/vue-keep/animations.css'`

**验收标准**：

- [ ] slide 模式下前进左滑、后退右滑
- [ ] 首屏不触发动画（disableFirstTransition 默认 true）
- [ ] 自定义 slot 能拿到正确的 direction
- [ ] 动画与 KeepAlive 缓存不冲突

---

### 3.4 页面数据回传 eventChannel（P1 — Phase 2）

**描述**：A 页面跳转到 B 页面，B 页面可以把数据传回 A 页面，对标微信小程序的 eventChannel。

**API**：

```ts
// A 页面：跳转并注册回调
keepRouter.push('/filter', {
  events: {
    filterChanged: (filter: FilterPayload) => {
      // B 页面 emit 后这里收到
    },
  },
})

// B 页面：发送数据
const channel = useEventChannel<{ filterChanged: FilterPayload }>()
channel.emit('filterChanged', { tag: 'new', sort: 'price' })
keepRouter.back()
```

**TypeScript 声明合并**：

```ts
// 用户项目 types/pages.d.ts
declare module '@bye_past/vue-keep' {
  interface PageEventMap {
    '/filter': { filterChanged: FilterPayload }
  }
}
```

**验收标准**：

- [ ] B 页面 emit 后 A 页面回调触发
- [ ] once 只触发一次
- [ ] 页面销毁时 channel 自动清理
- [ ] TypeScript 类型推断正确

---

### 3.5 嵌套路由多层缓存（P1 — Phase 2）

**描述**：支持多层 `<KeepRouterView>` 嵌套，每层独立维护缓存栈。典型场景：底部 tab 页面内有子路由。

**行为**：

- 父 KeepRouterView（depth=0）管理 tab 级别的缓存
- 子 KeepRouterView（depth=1）管理 tab 内部的页面缓存
- 父栈切换不销毁子栈

**验收标准**：

- [ ] tab A 内浏览 3 个子页面 → 切到 tab B → 切回 tab A，子页面栈完整保留
- [ ] 每层 KeepRouterView 的 max 独立生效

---

### 3.6 小程序风格生命周期（P1 — Phase 2）

**描述**：提供 `onPageShow` / `onPageHide`，语义与小程序 `onShow` / `onHide` 对齐。

**与 Vue 原生的关键差异**：`onPageShow` 在首次进入时也触发（Vue 的 `onActivated` 首次不触发）。

```ts
onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    // 等价于小程序 onLoad + onShow
    loadData()
  } else {
    // 从其他页面返回
    refreshIfNeeded()
  }
})

onPageHide(() => {
  // 页面被覆盖或切走
})
```

**验收标准**：

- [ ] 首次进入页面时 onPageShow 触发，isFirstShow = true
- [ ] 从其他页面返回时 onPageShow 触发，isFirstShow = false
- [ ] 页面被新页面覆盖时 onPageHide 触发

---

### 3.7 DevTools 可视化（P2 — Phase 3）

**描述**：在 Vue DevTools 中提供页面栈可视化面板。

**功能**：

- Timeline：每次导航记录事件（method、direction、from → to）
- Inspector：树形展示所有 KeepRouterView 容器及其栈条目
- 交互：右键手动销毁某个缓存条目
- 生产构建自动 tree-shake

**验收标准**：

- [ ] Vue DevTools 中出现 "Vue Keep" 面板
- [ ] 导航时 Timeline 实时更新
- [ ] Inspector 显示正确的栈结构
- [ ] 手动销毁后页面缓存立即移除

---

## 4. 组件 API 规格

### 4.1 `<KeepRouterView>` 组件

| Prop             | 类型                                                     | 默认值   | 说明                  |
| ---------------- | -------------------------------------------------------- | -------- | --------------------- |
| max              | number                                                   | 10       | 栈深上限              |
| cacheMax         | number                                                   | 同 max   | KeepAlive 缓存上限    |
| exclude          | string \| RegExp \| Array \| Function                    | -        | 不缓存的组件          |
| include          | string \| RegExp \| Array \| Function                    | -        | 只缓存的组件          |
| containerId      | string                                                   | 自动生成 | 嵌套时手动指定容器 ID |
| transition       | false \| 'slide' \| 'fade' \| 'zoom' \| TransitionConfig | 'slide'  | 过渡动画              |
| scrollContainers | string[]                                                 | -        | 额外的滚动容器选择器  |

**默认 Slot 作用域**：

| 变量        | 类型                          | 说明           |
| ----------- | ----------------------------- | -------------- |
| Component   | Component \| null             | 当前路由组件   |
| route       | RouteLocationNormalizedLoaded | 当前路由       |
| direction   | 'forward' \| 'back' \| 'none' | 导航方向       |
| containerId | string                        | 容器 ID        |
| state       | { stack, current, depth }     | 栈快照（只读） |

### 4.2 Composables

| Hook                     | 返回值                          | 说明                                                                    |
| ------------------------ | ------------------------------- | ----------------------------------------------------------------------- |
| useKeepRouter()          | KeepRouter                      | 全局路由控制（push/replace/back/reLaunch/switchTab/destroy/beforeEach） |
| usePageCache()           | PageCacheControls               | 当前页面缓存控制（isCached/markAsCached/removeFromCache/setConstCache） |
| useNavigationDirection() | Ref\<NavigationDirection\>      | 响应式导航方向                                                          |
| useEventChannel\<T\>()   | EventChannel\<T\>               | 页面数据回传通道                                                        |
| useScrollRestoration()   | ScrollRestorationControls       | 滚动恢复控制                                                            |
| usePageStack()           | ReadonlyRef\<PageStackEntry[]\> | 只读栈查询                                                              |

### 4.3 生命周期 Hook

| Hook       | 参数                           | 说明               |
| ---------- | ------------------------------ | ------------------ |
| onPageShow | (ctx: PageShowContext) => void | 页面显示（含首次） |
| onPageHide | () => void                     | 页面隐藏           |

### 4.4 插件工厂

```ts
import { createKeepRouter } from '@bye_past/vue-keep'

const keepRouter = createKeepRouter({
  router,
  max: 10,
  transition: 'slide',
  scrollBehavior: 'auto',
  devtools: true,
})

app.use(keepRouter)
```

---

## 5. 路由 Meta 扩展

```ts
// 路由配置
{
  path: '/detail/:id',
  name: 'detail',
  component: () => import('./pages/detail.vue'),
  meta: {
    keep: {
      cache: true,        // 是否缓存（默认 true）
      constCache: false,  // 是否常驻
      destroy: 'list',    // 进入此页面时销毁指定缓存
      exclude: false,     // 是否排除缓存
    }
  }
}
```

---

## 6. 快速上手示例

### 最小配置（3 行代码）

```ts
// main.ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'
import '@bye_past/vue-keep/animations.css'

const router = createRouter({ history: createWebHistory(), routes })
const app = createApp(App)

app.use(router)
app.use(createKeepRouter({ router }))
app.mount('#app')
```

```vue
<!-- App.vue -->
<template>
  <KeepRouterView />
</template>
```

完成。后续所有页面自动获得前进刷新、返回保留状态的能力。

---

## 7. 典型业务场景

### 场景 1：列表 → 详情 → 返回

用户在商品列表滚动到第 50 条，点击进入详情页，浏览后返回。列表页保持在第 50 条的位置，无需重新加载。

### 场景 2：支付成功后刷新列表

用户在订单详情页完成支付，需要返回订单列表时显示最新状态：

```ts
// 支付成功页
const keepRouter = useKeepRouter()
keepRouter.destroy('orderList') // 销毁列表缓存
keepRouter.back() // 返回列表（重新 mounted）
```

### 场景 3：筛选页数据回传

列表页打开筛选页，筛选完成后把结果传回列表页：

```ts
// 列表页
keepRouter.push('/filter', {
  events: {
    applyFilter: (filter) => {
      listQuery.value = filter
      loadList()
    },
  },
})

// 筛选页
const channel = useEventChannel()
channel.emit('applyFilter', { category: 'phone', priceRange: [1000, 5000] })
keepRouter.back()
```

### 场景 4：Tab 页面 + 子路由

底部 4 个 tab，每个 tab 内有独立的子路由栈：

```vue
<!-- App.vue -->
<KeepRouterView />
<!-- 管理 tab 级缓存 -->
<TabBar />

<!-- Home.vue（tab 页面） -->
<KeepRouterView />
<!-- 管理 tab 内子路由缓存 -->
```

### 场景 5：条件缓存

某些页面只在特定条件下缓存：

```ts
keepRouter.beforeEach((to, from) => {
  if (to.name === 'search' && !to.query.keyword) {
    return { cache: false } // 无关键词时不缓存搜索页
  }
})
```

---

## 8. 文档站结构

### 中文（/zh/）

- 指南
  - 介绍
  - 快速上手
  - 核心概念（页面栈、导航方向、缓存策略）
  - 导航方式（push/replace/back/reLaunch/switchTab）
  - 过渡动画
  - 滚动恢复
  - 页面数据回传
  - 嵌套路由
  - SSR / Nuxt
  - 与微信小程序对比
  - 从 v1 迁移
- API 参考
  - KeepRouterView
  - useKeepRouter
  - usePageCache
  - useNavigationDirection
  - useEventChannel
  - useScrollRestoration
  - onPageShow / onPageHide
  - 类型定义
- 实战手册
  - 电商 Demo 解析
  - 自定义动画
  - 条件缓存
  - DevTools 使用

### 英文（/en/）

同中文镜像。

---

## 9. 示例项目

### 电商 Demo（playground/ecommerce）

| 页面     | 路由          | 演示功能                |
| -------- | ------------- | ----------------------- |
| 首页     | /             | Tab 页面、嵌套路由      |
| 分类     | /category     | Tab 页面                |
| 商品列表 | /list         | 滚动恢复、返回保留位置  |
| 商品详情 | /detail/:id   | push 缓存、destroy 列表 |
| 购物车   | /cart         | Tab 页面、constCache    |
| 结算     | /checkout     | 表单状态保留            |
| 支付结果 | /pay-result   | reLaunch 清栈           |
| 个人中心 | /profile      | Tab 页面                |
| 地址编辑 | /address-form | eventChannel 数据回传   |

### 动画画廊

展示所有内置动画预设 + 自定义动画模板，用户可在线切换对比效果。

---

## 10. 非功能需求

| 维度     | 要求                                              |
| -------- | ------------------------------------------------- |
| 性能     | 导航切换 < 16ms（不含动画），不阻塞主线程         |
| 体积     | 核心包 gzip < 5KB                                 |
| 类型安全 | 全量 TypeScript strict 模式，零 any               |
| 测试覆盖 | 核心模块 100% 行覆盖，整体 > 85%                  |
| 文档     | 中英双语，所有 API 有示例                         |
| 无障碍   | 动画遵循 prefers-reduced-motion                   |
| SSR      | Nuxt 3 场景不报错                                 |
| 安全     | 不执行用户传入的字符串代码，不使用 eval/innerHTML |

---

## 11. 里程碑

| 阶段    | 版本          | 周期 | 交付物                                                        |
| ------- | ------------- | ---- | ------------------------------------------------------------- |
| Phase 1 | 2.0.0-alpha.0 | 2 周 | 核心栈管理 + push/replace/back/reLaunch + 基础组件 + 单元测试 |
| Phase 2 | 2.0.0-beta.0  | 3 周 | 滚动恢复 + 动画 + eventChannel + 嵌套路由 + E2E               |
| Phase 3 | 2.0.0-rc.0    | 3 周 | DevTools + 文档站 + 电商 Demo + StackBlitz                    |
| Phase 4 | 2.0.0         | 持续 | 正式发布 + 社区推广 + 迁移工具                                |
