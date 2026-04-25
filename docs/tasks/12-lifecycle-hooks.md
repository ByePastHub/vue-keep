# 模块 12：生命周期钩子

> 阶段：Phase 2 | 预估：1 天 | 前置依赖：模块 02、07

## 目标

实现小程序风格的 `onPageShow` / `onPageHide` 生命周期钩子。与 Vue 原生 `onActivated`/`onDeactivated` 的关键区别：`onPageShow` 在首次进入时也触发（Vue 的 `onActivated` 首次不触发），并提供稳定的上下文信息（方向、来源页面、目标页面等）。

---

## 文件清单

| 文件                                          | 职责            |
| --------------------------------------------- | --------------- |
| `packages/core/src/composables/onPageShow.ts` | onPageShow 钩子 |
| `packages/core/src/composables/onPageHide.ts` | onPageHide 钩子 |

---

## 任务清单

### T12-01：PageShowContext 类型定义

文件：`packages/core/src/types/public.ts`（补充）

- [✅] 定义 onPageShow 回调的上下文：

  ```ts
  export interface PageShowContext {
    // 是否首次显示（区分首次进入和返回激活）
    isFirstShow: boolean // 是否首次显示
    // 导航方向
    direction: NavigationDirection // 当前显示对应的导航方向
    // 来源路由（如果有）
    from: RouteLocationNormalizedLoaded | null // 来源路由
  }

  export interface PageHideContext {
    // 导航方向（即将离开的方向）
    direction: NavigationDirection // 当前隐藏对应的导航方向
    // 目标路由
    to: RouteLocationNormalizedLoaded | null // 目标路由
  }

  export type PageShowHandler = (ctx: PageShowContext) => void
  export type PageHideHandler = (ctx: PageHideContext) => void
  ```

**验收**：类型定义完整

### T12-02：onPageShow 实现

文件：`packages/core/src/composables/onPageShow.ts`

- [✅] 实现：

  ```ts
  import { inject, onMounted, onActivated, getCurrentInstance } from 'vue'
  import { KEEP_STORE_KEY } from '../symbols'
  import type { PageShowHandler, PageShowContext } from '../types/public'

  export function onPageShow(handler: PageShowHandler): void {
    const instance = getCurrentInstance()
    if (!instance) {
      if (__DEV__) {
        warn('[vue-keep] onPageShow() 必须在 setup() 中调用')
      }
      return
    }

    const store = inject(KEEP_STORE_KEY)
    if (!store) {
      if (__DEV__) {
        warn('[vue-keep] onPageShow() 必须在 createKeepRouter() 安装后使用')
      }
      return
    }

    let isFirstShow = true

    // 首次挂载时触发
    onMounted(() => {
      const ctx: PageShowContext = {
        isFirstShow: true,
        direction: store.state.lastNavigation?.direction ?? 'none',
        from: store.state.lastNavigation?.from ?? null,
      }
      handler(ctx)
    })

    // 后续激活时触发
    onActivated(() => {
      // onActivated 在首次挂载时也会触发（Vue 3.x 行为）
      // 但我们已经在 onMounted 中处理了首次，所以跳过
      if (isFirstShow) {
        isFirstShow = false
        return
      }

      const lastNav = store.state.lastNavigation
      const ctx: PageShowContext = {
        isFirstShow: false,
        direction: lastNav?.direction ?? 'none',
        from: lastNav?.from ?? null,
      }
      handler(ctx)
    })
  }
  ```

- [✅] 首次进入页面时触发（`isFirstShow: true`）
- [✅] 从其他页面返回时触发（`isFirstShow: false`）
- [✅] 提供导航方向和来源路由信息
- [✅] 页面回传数据继续通过 `useEventChannel()` 处理，不把 EventChannel 语义塞进生命周期上下文
- [✅] 必须在 `setup()` 中调用

**验收**：

- [✅] 首次进入页面：`handler({ isFirstShow: true, direction: 'forward', ... })`
- [✅] 返回到页面：`handler({ isFirstShow: false, direction: 'back', ... })`
- [✅] replace 到页面：`handler({ isFirstShow: true, direction: 'none', ... })`
- [✅] 在 setup 外调用打印开发警告

### T12-03：onPageHide 实现

文件：`packages/core/src/composables/onPageHide.ts`

- [✅] 实现：

  ```ts
  import { inject, onDeactivated, onUnmounted, getCurrentInstance } from 'vue'
  import { KEEP_STORE_KEY } from '../symbols'
  import type { PageHideHandler, PageHideContext } from '../types/public'

  export function onPageHide(handler: PageHideHandler): void {
    const instance = getCurrentInstance()
    if (!instance) {
      if (__DEV__) {
        warn('[vue-keep] onPageHide() 必须在 setup() 中调用')
      }
      return
    }

    const store = inject(KEEP_STORE_KEY)
    if (!store) {
      if (__DEV__) {
        warn('[vue-keep] onPageHide() 必须在 createKeepRouter() 安装后使用')
      }
      return
    }

    // 页面被缓存（deactivated）
    onDeactivated(() => {
      const lastNav = store.state.lastNavigation
      const ctx: PageHideContext = {
        direction: lastNav?.direction ?? 'none',
        to: lastNav?.to ?? null,
      }
      handler(ctx)
    })

    // 页面被销毁（unmounted）— 也算 hide
    onUnmounted(() => {
      const lastNav = store.state.lastNavigation
      const ctx: PageHideContext = {
        direction: lastNav?.direction ?? 'none',
        to: lastNav?.to ?? null,
      }
      handler(ctx)
    })
  }
  ```

- [✅] 页面被缓存（deactivated）时触发
- [✅] 页面被销毁（unmounted）时触发
- [✅] 提供导航方向和目标路由信息
- [✅] 注意：deactivated 和 unmounted 不会同时触发（deactivated 是缓存，unmounted 是销毁）

**验收**：

- [✅] push 到新页面时当前页面触发 `handler({ direction: 'forward', to: newRoute })`
- [✅] 页面被 LRU 淘汰时触发 `handler({ direction: 'none', to: null })`
- [✅] 在 setup 外调用打印开发警告

### T12-04：防止重复触发

文件：`packages/core/src/composables/onPageShow.ts`

- [✅] 处理 Vue 3 中 `onActivated` 在首次挂载时也触发的行为：
  ```ts
  // Vue 3 的 onActivated 行为：
  // - 组件首次挂载时：onMounted → onActivated（都触发）
  // - 组件被激活时：只触发 onActivated
  //
  // 我们的策略：
  // - 首次：在 onMounted 中触发 onPageShow(isFirstShow: true)
  // - 首次的 onActivated：跳过（用 isFirstShow flag）
  // - 后续 onActivated：触发 onPageShow(isFirstShow: false)
  ```
- [✅] 使用 `isFirstShow` flag 确保首次只触发一次
- [✅] 同理，onPageHide 中 deactivated 和 unmounted 不会重复触发

**验收**：

- [✅] 首次进入页面只触发一次 onPageShow
- [✅] 返回到页面只触发一次 onPageShow
- [✅] 离开页面只触发一次 onPageHide

### T12-05：与 composables 桶文件集成

文件：`packages/core/src/composables/index.ts`（修改）

- [✅] 添加导出：
  ```ts
  export { onPageShow } from './onPageShow'
  export { onPageHide } from './onPageHide'
  ```
- [✅] 在 `packages/core/src/index.ts` 中 re-export

**验收**：`import { onPageShow, onPageHide } from '@bye_past/vue-keep'` 可用

---

## 完成标准

- [✅] `onPageShow` 首次进入和返回激活都触发
- [✅] `onPageShow` 提供 `isFirstShow` 区分首次和返回
- [✅] `onPageHide` 在缓存和销毁时都触发
- [✅] 不重复触发
- [✅] 提供完整的上下文信息（方向、来源/目标路由）
- [✅] 不承担 EventChannel 最后一帧数据缓存职责
- [✅] 必须在 setup() 中调用，否则打印开发警告
- [✅] 单元测试覆盖：首次触发、返回触发、重复触发防护、setup 外调用
- [✅] `pnpm typecheck` 通过
