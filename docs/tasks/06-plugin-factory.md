# 模块 06：插件工厂

> 阶段：Phase 1 | 预估：0.5 天 | 前置依赖：模块 04、05 | 状态：✅ 已完成

## 目标

实现 `createKeepRouter` 工厂函数和 `app.use` 安装逻辑，将所有模块串联起来。这是用户使用库的入口。

---

## 文件清单

| 文件                                 | 职责                            | 状态 |
| ------------------------------------ | ------------------------------- | ---- |
| `packages/core/src/plugin.ts`        | createKeepRouter 工厂 + install | ✅   |
| `packages/core/src/utils/options.ts` | 配置项解析与默认值填充          | ✅   |

---

## 已完成任务

- [✅] T06-01: 配置项解析（resolveOptions，默认值填充）
- [✅] T06-02: createKeepRouter 工厂（创建 store/intentTracker/stackManager，绑定路由，provide 注入）
- [✅] T06-03: Plugin 类型（返回 Vue Plugin 接口）
- [✅] T06-04: KeepRouter 接口（push/replace/back/reLaunch/switchTab/destroy/beforeEach）
- [✅] T06-05: 桶文件更新（导出 createKeepRouter）

## 完成标准

- [✅] `createKeepRouter({ router })` 返回可安装的插件
- [✅] `app.use(plugin)` 后所有 provide 注入正确
- [✅] 全局属性注册正确（$keepRouter）
- [✅] app.onUnmount 时正确清理
- [✅] 配置项有合理默认值
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过（133 个测试）
- [✅] `pnpm build` 通过

---

## 文件清单

| 文件                                 | 职责                            |
| ------------------------------------ | ------------------------------- |
| `packages/core/src/plugin.ts`        | createKeepRouter 工厂 + install |
| `packages/core/src/utils/options.ts` | 配置项解析与默认值填充          |

---

## 任务清单

### T06-01：配置项解析

文件：`packages/core/src/utils/options.ts`

- [ ] 实现 `resolveOptions`：
  ```ts
  export function resolveOptions(raw: KeepOptions): KeepOptionsResolved {
    return {
      router: raw.router,
      max: raw.max ?? 10,
      exclude: raw.exclude,
      include: raw.include,
      scrollBehavior: raw.scrollBehavior ?? 'auto',
      persist: raw.persist ?? true,
      transition: raw.transition ?? 'slide',
      devtools: raw.devtools ?? __DEV__,
      namespace: raw.namespace ?? '[vue-keep]',
      disableFirstTransition: raw.disableFirstTransition ?? true,
      onBeforeEvict: raw.onBeforeEvict,
    }
  }
  ```
- [ ] 验证 `router` 必传，否则 throw Error

**验收**：缺少 router 时抛出明确错误信息

### T06-02：createKeepRouter 工厂

文件：`packages/core/src/plugin.ts`

- [ ] 实现工厂函数：

  ```ts
  export function createKeepRouter(rawOptions: KeepOptions): KeepRouterPlugin {
    const options = resolveOptions(rawOptions)
    const store = createCoreStore()
    const intentTracker = createIntentTracker()
    const channelRegistry = createChannelRegistry()
    const stackManager = createStackManager(store.state.stacks, options)
    // 将 stackManager 注入 store
    store.setStackManager(stackManager)
    store.setChannelRegistry(channelRegistry)

    let teardown: (() => void) | null = null

    const plugin: KeepRouterPlugin = {
      install(app: App) {
        // 1. 绑定路由
        teardown = bindRouter(options.router, store, options, intentTracker)

        // 2. 设置组件名解析
        const removeNameResolver = setupNameResolver(options.router)

        // 3. 创建 keepRouter 方法集
        const methods = createKeepMethods(
          options.router,
          store,
          intentTracker,
          channelRegistry,
          options,
        )
        const keepRouter: KeepRouter = {
          ...methods,
          get stacks() {
            return store.state.stacks
          },
          get currentEntry() {
            const activeContainerId =
              store.state.lastNavigation?.containerId ?? 'keep:0:root:default'
            return store.getCurrentEntry(activeContainerId) ?? null
          },
          get direction() {
            return store.state.lastNavigation?.direction ?? 'none'
          },
        }

        // 4. provide 注入
        app.provide(KEEP_STORE_KEY, store)
        app.provide(KEEP_OPTIONS_KEY, options)
        app.provide(KEEP_ROUTER_KEY, keepRouter)
        app.provide(CHANNEL_REGISTRY_KEY, channelRegistry)

        // 5. 全局属性
        app.config.globalProperties.$keepRouter = keepRouter

        // 6. 注册全局组件
        app.component('KeepRouterView', KeepRouterView)

        // 7. DevTools（条件加载）
        if (__DEV__ && options.devtools) {
          setupDevtools(app, store) // 模块 13 实现
        }

        // 8. 设置命名空间
        setNamespace(options.namespace)

        // 9. 清理
        app.onUnmount?.(() => {
          teardown?.()
          channelRegistry.clear()
          removeNameResolver()
        })
      },
    }

    return plugin
  }
  ```

**验收**：

- [ ] `app.use(createKeepRouter({ router }))` 不报错
- [ ] `inject(KEEP_STORE_KEY)` 能拿到 store
- [ ] `inject(KEEP_ROUTER_KEY)` 能拿到 keepRouter
- [ ] `this.$keepRouter` 在 Options API 中可用
- [ ] `<KeepRouterView>` 全局可用

### T06-03：KeepRouterPlugin 类型

文件：`packages/core/src/types/public.ts`

- [ ] 定义插件类型：
  ```ts
  export interface KeepRouterPlugin {
    install: (app: App) => void // Vue 插件安装方法
  }
  ```

**验收**：`app.use()` 的参数类型正确

### T06-04：KeepRouter 接口完整定义

文件：`packages/core/src/types/public.ts`

- [ ] 确保 KeepRouter 接口包含所有方法和只读属性：
  ```ts
  export interface KeepRouter {
    push(
      to: KeepLocation,
      opts?: KeepNavigateOptions,
    ): Promise<NavigationFailure | void | undefined> // 前进导航
    replace(
      to: KeepLocation,
      opts?: KeepNavigateOptions,
    ): Promise<NavigationFailure | void | undefined> // 替换当前页面
    back(delta?: number): void // 返回指定步数
    reLaunch(to: KeepLocation): Promise<void> // 清栈后跳转
    switchTab(to: KeepLocation): Promise<void> // 切换顶层 tab
    destroy(target: DestroyTarget): void // 主动销毁缓存
    beforeEach(guard: KeepNavigationGuard): () => void // 注册前置守卫
    readonly stacks: ReadonlyMap<string, ReadonlyArray<PageStackEntry>> // 所有容器栈快照
    readonly currentEntry: Readonly<PageStackEntry> | null // 当前激活条目
    readonly direction: NavigationDirection // 最近一次导航方向
  }
  ```

**验收**：`useKeepRouter()` 返回值类型与此接口一致

### T06-05：桶文件更新

文件：`packages/core/src/index.ts`

- [ ] 导出 `createKeepRouter`
- [ ] 导出 `KeepRouterView` 组件（模块 07 实现后）
- [ ] 导出所有 composables（模块 08 实现后）
- [ ] 导出所有 public 类型
- [ ] 导出 `createKeepScrollBehavior`（模块 09 实现后）
- [ ] 确保 `types/augment.ts` 被 side-effect import
- [ ] 当前阶段先导出已实现的部分，后续模块完成后逐步补充

**验收**：`import { createKeepRouter } from '@bye_past/vue-keep'` 可用

---

## 完成标准

- [ ] `createKeepRouter({ router })` 返回可安装的插件
- [ ] `app.use(plugin)` 后所有 provide 注入正确
- [ ] 全局组件和全局属性注册正确
- [ ] app.onUnmount 时正确清理
- [ ] 配置项有合理默认值
- [ ] `pnpm typecheck` 通过
