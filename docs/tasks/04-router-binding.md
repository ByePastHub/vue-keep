# 模块 04：路由绑定

> 阶段：Phase 1 | 预估：2 天 | 前置依赖：模块 03 | 状态：✅ 已完成

## 目标

将 Vue Router 4 的导航事件与 CoreStore 连接起来。通过 `history.listen` + `beforeEach` + `afterEach` 实现导航方向判定和栈结算，完全不劫持浏览器 History API。

---

## 文件清单

| 文件                                          | 职责                                               | 状态 |
| --------------------------------------------- | -------------------------------------------------- | ---- |
| `packages/core/src/router/bind-router.ts`     | 主绑定逻辑                                         | ✅   |
| `packages/core/src/router/navigation-info.ts` | 导航信息解析算法                                   | ✅   |
| `packages/core/src/router/intent-tracker.ts`  | 意图追踪器                                         | ✅   |
| `packages/core/src/router/methods.ts`         | keepRouter 的 push/replace/back/reLaunch/switchTab | ✅   |
| `packages/core/src/store/persistence.ts`      | history.state 注入/读取                            | ✅   |

---

## 已完成任务

- [✅] T04-01: 导航信息解析（resolveNavigation，8 种判定矩阵组合）
- [✅] T04-02: 意图追踪器（IntentTracker，set/consume/peek/clear）
- [✅] T04-03: history.state 持久化（createKeepState/readKeepState/injectInitialState）
- [✅] T04-04: bindRouter 主函数（history.listen + beforeEach + afterEach）
- [✅] T04-05: 初始化流程（router.isReady 后恢复或创建首条目）
- [✅] T04-06: keepRouter 导航方法（push/replace/back/reLaunch/switchTab）
- [✅] T04-07: destroy 方法和 beforeEach 守卫注册
- [✅] T04-08: 处理 router.push/replace 直接调用（从 info 推断）
- [✅] T04-09: 处理导航失败（afterEach failure 时不提交）
- [✅] T04-10: teardown 清理

## 测试覆盖

- `navigation-info.test.ts` — 8 个测试（所有判定矩阵组合）
- `persistence.test.ts` — 7 个测试（createKeepState/readKeepState 各种输入）
- `intent-tracker.test.ts` — 6 个测试（已有）

## 完成标准

- [✅] 5 种导航方式通过 keepRouter 调用后栈操作正确
- [✅] 直接使用 router.push/replace/go 也能正确处理
- [✅] 导航失败不影响栈
- [✅] teardown 后完全清理
- [✅] 单元测试覆盖所有判定矩阵组合
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过（133 个测试）
- [✅] `pnpm build` 通过

---

## 任务清单

### T04-01：导航信息解析

文件：`packages/core/src/router/navigation-info.ts`

- [ ] 实现 `resolveNavigation` 函数：
  ```ts
  export function resolveNavigation(
    intent: NavigationIntent | null,
    info: NavigationInfo | null,
  ): {
    method: NavigationMethod // 结算后的导航方法
    direction: NavigationDirection // 结算后的导航方向
    delta: number // 结算后的导航步数
  }
  ```
- [ ] 判定矩阵实现：

  | intent    | info.type      | info.direction | → method  | → direction |
  | --------- | -------------- | -------------- | --------- | ----------- |
  | push      | push           | forward        | Push      | forward     |
  | replace   | push           | unknown        | Replace   | none        |
  | back      | -              | -              | Back      | back        |
  | reLaunch  | push           | unknown        | ReLaunch  | none        |
  | switchTab | push           | unknown        | SwitchTab | none        |
  | null      | pop            | back           | Back      | back        |
  | null      | pop            | forward        | Push      | forward     |
  | null      | null（初始化） | -              | Push      | none        |

- [ ] delta 取值：
  - `intent?.delta` 存在时优先使用
  - 其次使用 `info.delta`
  - intent=back 且没有显式 delta 时：默认 -1
  - 其他：0 或 1

**验收**：

- [ ] 所有 8 种组合的判定结果正确
- [ ] 单元测试覆盖每种组合

### T04-02：意图追踪器

文件：`packages/core/src/router/intent-tracker.ts`

- [ ] 实现意图追踪器：

  ```ts
  export function createIntentTracker() {
    let current: NavigationIntent | null = null

    return {
      set(intent: NavigationIntent) {
        current = intent
      },
      take(): NavigationIntent | null {
        const val = current
        current = null
        return val
      },
      peek(): NavigationIntent | null {
        return current
      },
      clear() {
        current = null
      },
    }
  }
  ```

- [ ] 意图在 `keepRouter.push/replace/back/reLaunch/switchTab` 中设置
- [ ] 意图在 `beforeEach` 中消费（take 后清空）
- [ ] 如果 beforeEach 时没有意图（用户直接用 router.push 或浏览器导航），则从 info 推断

**验收**：`set('push') → take()` 返回 push 且清空；再次 `take()` 返回 null

### T04-03：history.state 持久化

文件：`packages/core/src/store/persistence.ts`

- [ ] 实现 state 注入字段定义：
  ```ts
  export interface VueKeepState {
    __vueKeepId: string // 当前 history 记录对应的页面 id
    __vueKeepDepth: number // 当前 history 记录对应的路由层级
    __vueKeepMethod: NavigationMethod // 当前 history 记录创建时使用的方法
    __vueKeepSentAt: number // 状态写入时间戳
  }
  ```
- [ ] 实现 `createKeepState` 函数：
  ```ts
  export function createKeepState(id: string, depth: number, method: NavigationMethod): VueKeepState
  ```
- [ ] 实现 `readKeepState` 函数：
  ```ts
  export function readKeepState(state: unknown): VueKeepState | null
  ```

  - 从 `history.state` 中安全读取 `__vueKeepId` 等字段
  - 字段不存在或类型不对时返回 null
- [ ] 实现 `injectInitialState` 函数：
  ```ts
  export function injectInitialState(id: string): void
  ```

  - 首次加载时，如果 `history.state` 没有 `__vueKeepId`，用 `history.replaceState` 注入
  - 这是**唯一**一次直接调用 `history.replaceState`
  - SSR 环境下跳过
- [ ] `__vueKeepMethod` 字段只记录“本条 history 记录是以什么方式创建的”，不得用于判断“当前这次导航是不是返回”

**验收**：

- [ ] `createKeepState` 返回正确的对象
- [ ] `readKeepState` 能从 history.state 中正确读取
- [ ] `readKeepState` 对非法输入返回 null
- [ ] `injectInitialState` 在 SSR 下不报错

### T04-04：bindRouter 主函数

文件：`packages/core/src/router/bind-router.ts`

- [ ] 实现 `bindRouter` 函数：
  ```ts
  export function bindRouter(
    router: Router,
    store: CoreStore,
    options: KeepOptionsResolved,
    intentTracker: IntentTracker,
  ): () => void // 返回 teardown 函数
  ```
- [ ] 内部流程：
  1. 使用 plugin 传入的共享 `intentTracker`
  2. 注册 `router.options.history.listen` 回调：
     ```ts
     const unlisten = router.options.history.listen((to, from, info) => {
       store.setPendingInfo(info)
     })
     ```
  3. 注册 `router.beforeEach`：
     ```ts
     const removeBeforeEach = router.beforeEach(async (to, from) => {
       const intent = intentTracker.take()
       const info = store.takePendingInfo()
       const { method, direction, delta } = resolveNavigation(intent, info)
       const containerId = resolveContainerId({
         depth: Math.max(0, to.matched.length - 1),
         route: to as RouteLocationNormalizedLoaded,
         viewName: 'default',
       })
       // 运行用户守卫
       const guardResult = await store.runGuards(to, from, direction)
       // 合并 hints
       const hints = {
         cache: intent?.cache ?? guardResult.cache ?? to.meta?.keep?.cache,
         constCache: intent?.constCache ?? guardResult.constCache ?? to.meta?.keep?.constCache,
         destroy: intent?.destroy ?? guardResult.destroy ?? to.meta?.keep?.destroy,
         metadata: intent?.metadata,
         channelId: intent?.channelId ?? null,
         targetTabKey: intent?.targetTabKey ?? to.meta?.keep?.tabKey ?? null,
       }
       // 暂存到 store，等 afterEach 提交
       store.prepareNavigation({
         containerId,
         to: to as RouteLocationNormalizedLoaded,
         from: from as RouteLocationNormalizedLoaded,
         method,
         direction,
         delta,
         hints,
       })
     })
     ```
  4. 注册 `router.afterEach`：
     ```ts
     const removeAfterEach = router.afterEach((to, from, failure) => {
       if (failure) {
         store.clearPreparedNavigation()
         return
       }
       store.commitNavigation()
     })
     ```
  5. 返回 teardown 函数：`() => { unlisten(); removeBeforeEach(); removeAfterEach() }`

**验收**：

- [ ] push → afterEach 后栈增加一个条目
- [ ] 浏览器后退 → afterEach 后栈弹出一个条目
- [ ] replace → afterEach 后栈顶被替换
- [ ] 导航失败时不提交栈变更

### T04-05：初始化流程

文件：`packages/core/src/router/bind-router.ts`

- [ ] 在 `bindRouter` 中处理初始化：

  ```ts
  router.isReady().then(() => {
    const currentRoute = router.currentRoute.value
    const keepState = readKeepState(history.state)
    const containerId = resolveContainerId({
      depth: Math.max(0, currentRoute.matched.length - 1),
      route: currentRoute,
      viewName: 'default',
    })

    if (keepState) {
      // 刷新恢复：从 history.state 恢复当前条目
      store.restoreFromState(containerId, keepState, currentRoute)
    } else {
      // 首次加载：注入初始 state
      injectInitialState(genId())
      store.initFirstEntry(containerId, currentRoute)
    }

    store.setReady()
  })
  ```

- [ ] `store.restoreFromState`：创建一个单条目栈，id 从 keepState 恢复
- [ ] `store.initFirstEntry`：创建一个新条目入栈

**验收**：

- [ ] 首次加载后 `history.state.__vueKeepId` 存在
- [ ] 刷新后 `store.getStack` 有一个条目，id 与刷新前一致
- [ ] `store.ready` 在 `router.isReady()` 后变为 true

### T04-06：keepRouter 导航方法

文件：`packages/core/src/router/methods.ts`

- [ ] 实现 `createKeepMethods` 函数：
  ```ts
  export function createKeepMethods(
    router: Router,
    store: CoreStore,
    intentTracker: IntentTracker,
    channelRegistry: ChannelRegistry,
    options: KeepOptionsResolved,
  ): KeepRouterMethods
  ```
- [ ] 实现 `push` 方法：

  ```ts
  async push(to: KeepLocation, opts?: KeepNavigateOptions) {
    const location = typeof to === 'string' ? { path: to } : to
    const resolved = router.resolve(location)
    let channelId: string | null = null

    if (opts?.events) {
      channelId = genId()
      const channel = channelRegistry.create(channelId)
      for (const [event, handler] of Object.entries(opts.events)) {
        channel.on(event, handler)
      }
    }

    intentTracker.set({
      method: 'push',
      delta: 1,
      cache: opts?.cache,
      constCache: opts?.constCache,
      destroy: opts?.destroy,
      metadata: opts?.metadata,
      channelId,
      sentAt: Date.now(),
    })

    const state = createKeepState(
      genId(),
      Math.max(0, resolved.matched.length - 1),
      'push',
    )
    await router.push({
      ...location,
      state,
    })
  }
  ```

- [ ] 实现 `replace` 方法：
  ```ts
  async replace(to: KeepLocation, opts?: KeepNavigateOptions) {
    const location = typeof to === 'string' ? { path: to } : to
    const resolved = router.resolve(location)
    intentTracker.set({
      method: 'replace',
      delta: 0,
      cache: opts?.cache,
      constCache: opts?.constCache,
      destroy: opts?.destroy,
      metadata: opts?.metadata,
      sentAt: Date.now(),
    })
    const state = createKeepState(
      genId(),
      Math.max(0, resolved.matched.length - 1),
      'replace',
    )
    await router.replace({
      ...location,
      state,
    })
  }
  ```
- [ ] 实现 `back` 方法：
  ```ts
  back(delta: number = 1) {
    intentTracker.set({
      method: 'back',
      delta: -Math.abs(delta),
      sentAt: Date.now(),
    })
    router.go(-Math.abs(delta))
  }
  ```
- [ ] 实现 `reLaunch` 方法：
  ```ts
  async reLaunch(to: KeepLocation) {
    const location = typeof to === 'string' ? { path: to } : to
    const resolved = router.resolve(location)
    intentTracker.set({
      method: 'reLaunch',
      delta: 0,
      sentAt: Date.now(),
    })
    const state = createKeepState(
      genId(),
      Math.max(0, resolved.matched.length - 1),
      'reLaunch',
    )
    await router.replace({
      ...location,
      state,
    })
  }
  ```
- [ ] 实现 `switchTab` 方法：
  ```ts
  async switchTab(to: KeepLocation) {
    const location = typeof to === 'string' ? { path: to } : to
    const resolved = router.resolve(location)
    intentTracker.set({
      method: 'switchTab',
      delta: 0,
      targetTabKey:
        resolved.meta?.keep?.tabKey ??
        (typeof resolved.name === 'string' ? resolved.name : resolved.path),
      sentAt: Date.now(),
    })
    const state = createKeepState(
      genId(),
      Math.max(0, resolved.matched.length - 1),
      'switchTab',
    )
    await router.push({
      ...location,
      state,
    })
  }
  ```

**验收**：

- [ ] `keepRouter.push('/detail')` 触发 router.push 且 intentTracker 记录 push
- [ ] `keepRouter.back()` 触发 router.go(-1)
- [ ] `keepRouter.back(3)` 触发 router.go(-3)
- [ ] `keepRouter.reLaunch('/home')` 触发 router.replace
- [ ] 所有方法的 history.state 都包含 `__vueKeepId`

### T04-07：destroy 方法

文件：`packages/core/src/router/methods.ts`

- [ ] 实现 `destroy` 方法：
  ```ts
  destroy(target: DestroyTarget) {
    store.destroy(target)
  }
  ```
- [ ] 实现 `beforeEach` 守卫注册：
  ```ts
  beforeEach(guard: KeepNavigationGuard): () => void {
    return store.addGuard(guard)
  }
  ```

**验收**：`keepRouter.destroy('detail')` 后 includeList 不含 detail

### T04-08：处理 router.push/replace 直接调用

文件：`packages/core/src/router/bind-router.ts`

- [ ] 当用户直接调用 `router.push`（不通过 keepRouter）时：
  - intentTracker 为空
  - 从 info 推断 method（info.type='push' + direction='forward' → Push）
  - 正常执行栈操作
- [ ] 当用户直接调用 `router.replace` 时：
  - info.delta = 0 → Replace
- [ ] 当用户直接调用 `router.go(-1)` 时：
  - info.type='pop' + direction='back' → Back

**验收**：

- [ ] `router.push('/foo')` 也能正确入栈
- [ ] `router.replace('/foo')` 也能正确替换栈顶
- [ ] `router.go(-1)` 也能正确弹栈

### T04-09：处理导航失败

文件：`packages/core/src/router/bind-router.ts`

- [ ] `afterEach` 的 `failure` 参数不为 null 时，不提交栈变更
- [ ] 清理 prepareNavigation 暂存的数据
- [ ] 导航被 guard 取消时（`return false`），同样不提交

**验收**：

- [ ] `router.beforeEach(() => false)` 后栈不变
- [ ] 导航到不存在的路由后栈不变

### T04-10：teardown 清理

文件：`packages/core/src/router/bind-router.ts`

- [ ] teardown 函数必须：
  1. 移除 history.listen
  2. 移除 beforeEach guard
  3. 移除 afterEach hook
  4. 清空 intentTracker
- [ ] 在 `app.unmount()` 时自动调用（通过 plugin 的 `app.onUnmount` 注册）

**验收**：teardown 后导航不再触发栈操作

---

## 完成标准

- [ ] 5 种导航方式通过 keepRouter 调用后栈操作正确
- [ ] 直接使用 router.push/replace/go 也能正确处理
- [ ] 浏览器前进/后退按钮正确识别方向
- [ ] 刷新后能从 history.state 恢复
- [ ] 导航失败不影响栈
- [ ] teardown 后完全清理
- [ ] 单元测试覆盖所有判定矩阵组合
- [ ] `pnpm typecheck` 通过
