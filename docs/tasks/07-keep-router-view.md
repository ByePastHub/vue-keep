# 模块 07：KeepRouterView 组件

> 阶段：Phase 1 | 预估：1.5 天 | 前置依赖：模块 06 | 状态：✅ 已完成

## 目标

实现核心组件 `<KeepRouterView>`，用 TSX 编写单一渲染路径。组件只负责"把 store 的 includeList 喂给 KeepAlive"，不包含任何栈逻辑。

---

## 文件清单

| 文件                                              | 职责                           | 状态 |
| ------------------------------------------------- | ------------------------------ | ---- |
| `packages/core/src/components/KeepRouterView.ts`  | 主组件                         | ✅   |
| `packages/core/src/components/KeepAliveBridge.ts` | store → KeepAlive include 桥接 | ✅   |
| `packages/core/src/components/KeepPageShell.ts`   | 页面壳桥接组件                 | ✅   |

---

## 已完成任务

- [✅] T07-01: KeepAliveBridge（useKeepAliveInclude，computed 桥接 store → include）
- [✅] T07-02: KeepRouterView Props 定义（max/cacheMax/exclude/include/containerId/transition/scrollContainers）
- [✅] T07-03: 嵌套 depth 管理（inject/provide DEPTH_KEY，containerId 自动计算）
- [✅] T07-04: 默认渲染路径（RouterView > Transition > KeepAlive > Component）
- [✅] T07-05: 自定义 Slot 渲染路径（暴露 Component/route/direction/containerId/renderPage/state）
- [✅] T07-06: exclude/include props 处理（与 store includeList 交集/差集）
- [✅] T07-07: 组件 name 和注册（KeepRouterView，plugin.ts 全局注册）
- [✅] T07-08: SSR 安全（isSSR 时直接渲染 RouterView）

## 完成标准

- [✅] `<KeepRouterView />` 开箱即用
- [✅] 自定义 slot 暴露完整的作用域变量
- [✅] 嵌套使用时 depth 自动递增
- [✅] exclude/include 正确过滤
- [✅] SSR 安全
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过（133 个测试）
- [✅] `pnpm build` 通过

---

## 文件清单

| 文件                                              | 职责                                   |
| ------------------------------------------------- | -------------------------------------- |
| `packages/core/src/components/KeepRouterView.tsx` | 主组件                                 |
| `packages/core/src/components/KeepAliveBridge.ts` | store → KeepAlive include 桥接         |
| `packages/core/src/components/KeepPageShell.tsx`  | 页面壳桥接组件（滚动恢复、容器上下文） |

---

## 任务清单

### T07-01：KeepAliveBridge

文件：`packages/core/src/components/KeepAliveBridge.ts`

- [ ] 实现 computed 桥接：
  ```ts
  export function useKeepAliveInclude(containerId: Ref<string>) {
    const store = inject(KEEP_STORE_KEY)!
    return computed(() => store.getIncludeList(containerId.value))
  }
  ```
- [ ] 返回的是 `string[]`，直接传给 `<KeepAlive :include="...">`

**验收**：栈变更后 include 列表自动更新

### T07-02：KeepRouterView Props 定义

文件：`packages/core/src/components/KeepRouterView.tsx`

- [ ] 使用 `defineComponent` + props 对象定义：
  ```ts
  props: {
    max: { type: Number, default: 10 },
    cacheMax: { type: Number },
    exclude: { type: [String, Array, RegExp, Function] as PropType<NameMatcher> },
    include: { type: [String, Array, RegExp, Function] as PropType<NameMatcher> },
    containerId: { type: String },
    transition: {
      type: [Boolean, String, Object] as PropType<false | TransitionPreset | TransitionConfig>,
      default: 'slide',
    },
    scrollContainers: { type: Array as PropType<string[]> },
  }
  ```

**验收**：所有 props 有正确的类型和默认值

### T07-03：嵌套 depth 管理

文件：`packages/core/src/components/KeepRouterView.tsx`

- [ ] 在 setup 中实现 depth 自增：
  ```ts
  const parentDepth = inject(DEPTH_KEY, -1)
  const depth = parentDepth + 1
  provide(DEPTH_KEY, depth)
  ```
- [ ] containerId 计算：
  ```ts
  const route = useRoute()
  const parentContainerId = inject(CONTAINER_ID_KEY, null)
  const containerId = computed(
    () =>
      props.containerId ??
      resolveContainerId({
        depth,
        route: route,
        parentContainerId,
        viewName: 'default',
      }),
  )
  ```
- [ ] 在 store 中注册/注销栈：
  ```ts
  const store = inject(KEEP_STORE_KEY)!
  store.ensureStack(containerId.value, depth)
  provide(CONTAINER_ID_KEY, containerId.value)
  onUnmounted(() => store.destroyStack(containerId.value))
  ```

**验收**：

- [ ] 顶层 KeepRouterView depth=0，containerId 稳定且包含 `root`
- [ ] 不同父页面下 depth=1 的 KeepRouterView 默认 containerId 不相同
- [ ] unmount 时栈被销毁

### T07-04：默认渲染路径

文件：`packages/core/src/components/KeepRouterView.tsx`

- [ ] 实现默认渲染（无自定义 slot 时）：

  ```tsx
  const renderPage = (Component: Component, route: RouteLocationNormalizedLoaded) => (
    <KeepPageShell
      key={route.fullPath}
      containerId={containerId.value}
      route={route}
      scrollContainers={props.scrollContainers}
    >
      {h(Component)}
    </KeepPageShell>
  )

  return () => (
    <RouterView>
      {{
        default: ({ Component, route }) => {
          if (!Component) return null

          const includeList = effectiveInclude.value
          const dir = store.state.lastNavigation?.direction ?? 'none'

          // 默认：KeepTransition 包 KeepAlive 包 Component
          return (
            <KeepTransition direction={dir} preset={props.transition}>
              <KeepAlive include={includeList} max={props.cacheMax ?? props.max}>
                {renderPage(Component, route)}
              </KeepAlive>
            </KeepTransition>
          )
        },
      }}
    </RouterView>
  )
  ```

- [ ] 注意：`key={route.fullPath}` 确保同路由不同参数时组件实例不同

**验收**：

- [ ] 渲染出 RouterView > KeepAlive > Component 的 DOM 结构
- [ ] include 列表与 store 同步

### T07-05：自定义 Slot 渲染路径

文件：`packages/core/src/components/KeepRouterView.tsx`

- [ ] 当用户提供 default slot 时，暴露作用域变量：
  ```tsx
  if (slots.default) {
    return slots.default({
      Component,
      route,
      direction: dir,
      containerId: containerId.value,
      renderPage: () => renderPage(Component, route),
      state: {
        stack: store.getStack(containerId.value),
        current: store.getCurrentEntry(containerId.value),
        depth,
      },
    })
  }
  ```
- [ ] 用户可以完全控制 Transition 和 KeepAlive 的组合方式
- [ ] 若用户仍想保留滚动恢复和容器级 composable，必须调用 slot 暴露的 `renderPage()`

**验收**：

- [ ] 自定义 slot 能拿到 Component、route、direction
- [ ] 自定义 slot 能拿到 state.stack（只读数组）
- [ ] 自定义 slot 使用 `renderPage()` 后，滚动恢复和 `useEventChannel()` 仍可用

### T07-06：exclude/include props 处理

文件：`packages/core/src/components/KeepRouterView.tsx`

- [ ] 组件级 exclude/include 与全局 options 的 exclude/include 合并：
  ```ts
  const currentRoute = useRoute()
  const effectiveInclude = computed(() => {
    const storeList = store.getIncludeList(containerId.value)
    // 如果有 props.include，取交集
    if (props.include) {
      return storeList.filter((name) => matchName(props.include!, name, currentRoute))
    }
    // 如果有 props.exclude，排除
    if (props.exclude) {
      return storeList.filter((name) => !matchName(props.exclude!, name, currentRoute))
    }
    return storeList
  })
  ```

**验收**：

- [ ] `<KeepRouterView :exclude="'detail'" />` 后 detail 不被缓存
- [ ] `<KeepRouterView :include="['home', 'list']" />` 后只缓存 home 和 list

### T07-07：组件 name 和注册

文件：`packages/core/src/components/KeepRouterView.tsx`

- [ ] 组件 name 设为 `'KeepRouterView'`
- [ ] 在 plugin.ts 中全局注册：`app.component('KeepRouterView', KeepRouterView)`
- [ ] 同时支持 kebab-case：`<keep-router-view>`（Vue 自动处理）

**验收**：`<KeepRouterView />` 和 `<keep-router-view />` 都能渲染

### T07-08：SSR 安全

文件：`packages/core/src/components/KeepRouterView.tsx`

- [ ] SSR 环境下：
  - 不使用 KeepAlive（SSR 不支持）
  - 不使用 Transition
  - 直接渲染 `<RouterView>` 的 Component
  ```ts
  if (isSSR) {
    return () => (
      <RouterView>
        {{ default: ({ Component }) => Component ? h(Component) : null }}
      </RouterView>
    )
  }
  ```

**验收**：Nuxt 3 SSR 渲染不报错

---

## 完成标准

- [ ] `<KeepRouterView />` 开箱即用，零配置即可缓存页面
- [ ] 自定义 slot 暴露完整的作用域变量
- [ ] 嵌套使用时 depth 自动递增
- [ ] exclude/include 正确过滤
- [ ] SSR 安全
- [ ] 组件测试覆盖：默认渲染、自定义 slot、嵌套、exclude
- [ ] `pnpm typecheck` 通过
