# 模块 05：组件名解析

> 阶段：Phase 1 | 预估：0.5 天 | 前置依赖：模块 04 | 状态：✅ 已完成

## 目标

确保所有进入 KeepAlive 缓存的路由组件都有 name。Vue 的 `<KeepAlive>` 通过组件 name 匹配 include 列表，没有 name 的组件无法被缓存。v2 使用安全的包装组件策略。

---

## 文件清单

| 文件                                        | 职责                                    | 状态 |
| ------------------------------------------- | --------------------------------------- | ---- |
| `packages/core/src/router/name-resolver.ts` | 组件 name 解析、包装、setupNameResolver | ✅   |
| `packages/core/src/utils/name-resolver.ts`  | 基础版本（01A 遗留，仍可用）            | ✅   |

---

## 已完成任务

- [✅] T05-01: 分析组件 name 来源（component.name > \_\_name > route.name > fullPath fallback）
- [✅] T05-02: resolveComponentName（支持 component + route + depth 三参数）
- [✅] T05-03: wrapWithName（defineComponent 薄包装，WeakMap 缓存）
- [✅] T05-04: ensureComponentName（有 name 不包装，无 name 包装 + 开发警告）
- [✅] T05-05: setupNameResolver（router.beforeResolve 自动解析异步组件）
- [✅] T05-06: 包装组件缓存（WeakMap，同一组件不重复包装）

## 完成标准

- [✅] 所有路由组件在进入 KeepAlive 前都有 name
- [✅] 不使用 Object.defineProperty hack
- [✅] 包装组件有缓存，不重复创建
- [✅] 开发模式下无 name 时有清晰警告
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过
- [✅] `pnpm build` 通过

---

## 文件清单

| 文件                                        | 职责                 |
| ------------------------------------------- | -------------------- |
| `packages/core/src/router/name-resolver.ts` | 组件 name 解析与包装 |

---

## 任务清单

### T05-01：分析组件 name 来源

- [ ] 梳理 Vue 3 中组件 name 的所有来源：
  1. `defineComponent({ name: 'Foo' })` — 显式定义
  2. `<script setup>` 的文件名推断（Vue 3.3+ 的 `defineOptions({ name })` 或 unplugin-vue-define-options）
  3. 路由配置的 `route.name`（字符串）
  4. 异步组件 `defineAsyncComponent` 的 `__name` 属性
- [ ] 确定优先级：组件自身 name > route.name > 文件名推断

### T05-02：实现 resolveComponentName

文件：`packages/core/src/router/name-resolver.ts`

- [ ] 实现函数：
  ```ts
  export function resolveComponentName(
    component: Component | DefineComponent,
    route: RouteLocationNormalizedLoaded,
  ): string | null
  ```
- [ ] 解析逻辑：
  1. 检查 `component.name`（显式定义）
  2. 检查 `component.__name`（SFC 编译器注入）
  3. 检查 `route.name`（必须是 string，不能是 Symbol）
  4. 都没有则返回 null

**验收**：

- [ ] 有 name 的组件直接返回 name
- [ ] 无 name 但 route.name 是字符串时返回 route.name
- [ ] route.name 是 Symbol 时返回 null

### T05-03：实现 wrapWithName

文件：`packages/core/src/router/name-resolver.ts`

- [ ] 当组件没有 name 时，创建一个薄包装组件：
  ```ts
  export function wrapWithName(component: Component, name: string): DefineComponent {
    return defineComponent({
      name,
      setup() {
        return () => h(component)
      },
    })
  }
  ```
- [ ] 包装组件的特点：
  - 有明确的 name（KeepAlive 可以匹配）
  - 渲染时直接 `h(OriginalComponent)`，零额外开销
  - 不影响原组件的 props/emits/slots

**验收**：

- [ ] 包装后的组件 `.name` 等于传入的 name
- [ ] 渲染结果与原组件一致

### T05-04：实现 ensureComponentName

文件：`packages/core/src/router/name-resolver.ts`

- [ ] 实现主入口函数：
  ```ts
  export function ensureComponentName(
    component: Component,
    route: RouteLocationNormalizedLoaded,
  ): { component: Component; name: string }
  ```
- [ ] 逻辑：
  1. `resolveComponentName(component, route)`
  2. 如果有 name：直接返回 `{ component, name }`
  3. 如果没有 name 但 route.name 是字符串：`wrapWithName(component, route.name)`
  4. 如果完全没有 name：
     - 开发模式下 `warn('路由 ${route.fullPath} 的组件没有 name，且路由也没有 name。请给路由或组件添加 name 以启用缓存。')`
     - 返回 `{ component, name: route.fullPath }`（用 fullPath 作为 fallback，但可能导致缓存键不稳定）

**验收**：

- [ ] 有 name 的组件不被包装
- [ ] 无 name 的组件被包装后有正确的 name
- [ ] 完全无 name 时打印开发警告

### T05-05：处理异步组件

文件：`packages/core/src/router/name-resolver.ts`

- [ ] 异步组件（`() => import('./Foo.vue')`）在首次渲染前是一个 AsyncComponentWrapper
- [ ] 需要在组件 resolve 后再检查 name
- [ ] 策略：
  1. 在 `router.beforeResolve` 中，路由的 `matched[].components.default` 已经是 resolved 的组件
  2. 此时调用 `ensureComponentName`
  3. 如果需要包装，替换 `matched[].components.default`（Vue Router 允许这样做）
- [ ] 实现 `setupNameResolver`：
  ```ts
  export function setupNameResolver(router: Router): () => void {
    const removeGuard = router.beforeResolve((to) => {
      for (const record of to.matched) {
        const component = record.components?.default
        if (!component) continue
        const { component: resolved, name } = ensureComponentName(component, to)
        if (resolved !== component) {
          record.components!.default = resolved
        }
      }
    })
    return removeGuard
  }
  ```

**验收**：

- [ ] 异步组件 `() => import('./Foo.vue')` 在首次导航后有正确的 name
- [ ] 同一个异步组件只被包装一次（缓存包装结果）

### T05-06：包装组件缓存

文件：`packages/core/src/router/name-resolver.ts`

- [ ] 维护一个 WeakMap 缓存已包装的组件：
  ```ts
  const wrapCache = new WeakMap<Component, DefineComponent>()
  ```
- [ ] `wrapWithName` 前先检查缓存，避免重复包装
- [ ] 使用 WeakMap 确保组件被 GC 时缓存也释放

**验收**：同一个组件多次调用 `ensureComponentName` 返回同一个包装实例

---

## 完成标准

- [ ] 所有路由组件在进入 KeepAlive 前都有 name
- [ ] 不使用 `Object.defineProperty` hack
- [ ] 异步组件正确处理
- [ ] 包装组件有缓存，不重复创建
- [ ] 开发模式下无 name 时有清晰警告
- [ ] 单元测试覆盖：有 name、无 name、异步组件、route.name 为 Symbol
- [ ] `pnpm typecheck` 通过
