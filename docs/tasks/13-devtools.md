# 模块 13：DevTools 集成

> 阶段：Phase 3 | 预估：1.5 天 | 前置依赖：模块 02、03、06

## 目标

基于 `@vue/devtools-api` 实现 Vue DevTools 插件，提供页面栈可视化、导航事件时间线、手动缓存管理。生产构建通过 `__DEV__` tree-shake 掉。

---

## 文件清单

| 文件                                       | 职责                  |
| ------------------------------------------ | --------------------- |
| `packages/core/src/devtools/setup-hook.ts` | DevTools 插件注册入口 |
| `packages/core/src/devtools/timeline.ts`   | 导航事件时间线        |
| `packages/core/src/devtools/inspector.ts`  | 页面栈 Inspector 面板 |

---

## 任务清单

### T13-01：DevTools 插件注册

文件：`packages/core/src/devtools/setup-hook.ts`

- [✅] 实现 `setupDevtools` 函数：

  ```ts
  import { setupDevtoolsPlugin } from '@vue/devtools-api'
  import type { App } from 'vue'
  import type { CoreStore } from '../store/core-store'

  const DEVTOOLS_PLUGIN_ID = 'vue-keep'
  const DEVTOOLS_LABEL = 'Vue Keep'
  const TIMELINE_LAYER_ID = 'vue-keep:navigations'
  const INSPECTOR_ID = 'vue-keep:stacks'

  export function setupDevtools(app: App, store: CoreStore): void {
    setupDevtoolsPlugin(
      {
        id: DEVTOOLS_PLUGIN_ID,
        label: DEVTOOLS_LABEL,
        packageName: '@bye_past/vue-keep',
        homepage: 'https://github.com/user/vue-keep',
        app,
        enableEarlyProxy: true,
      },
      (api) => {
        // 注册时间线层
        setupTimeline(api, store)
        // 注册 Inspector
        setupInspector(api, store)
      },
    )
  }
  ```

- [✅] 使用 `@vue/devtools-api` 的 `setupDevtoolsPlugin`
- [✅] `enableEarlyProxy: true` 确保在 DevTools 连接前也能缓存事件

**验收**：Vue DevTools 中出现 "Vue Keep" 插件

### T13-02：导航事件时间线

文件：`packages/core/src/devtools/timeline.ts`

- [✅] 实现时间线事件记录：

  ```ts
  import type { DevtoolsPluginApi } from '@vue/devtools-api'

  const TIMELINE_LAYER_ID = 'vue-keep:navigations'

  export function setupTimeline(
    api: DevtoolsPluginApi<Record<string, never>>,
    store: CoreStore,
  ): void {
    // 注册时间线层
    api.addTimelineLayer({
      id: TIMELINE_LAYER_ID,
      label: 'Vue Keep Navigations',
      color: 0x42b883, // Vue 绿色
    })

    // 订阅 store 的导航事件
    store.onNavigationCommit((nav) => {
      api.addTimelineEvent({
        layerId: TIMELINE_LAYER_ID,
        event: {
          time: Date.now(),
          title: `${nav.method} → ${nav.to.fullPath}`,
          subtitle: `direction: ${nav.direction}`,
          data: {
            method: nav.method,
            direction: nav.direction,
            delta: nav.delta,
            from: nav.from?.fullPath ?? '(none)',
            to: nav.to.fullPath,
            stackSize: nav.stackSize,
            includeList: nav.includeList,
          },
          groupId: nav.id,
        },
      })
    })
  }
  ```

- [✅] 每次导航提交后记录一个时间线事件
- [✅] 事件包含：method、direction、delta、from、to、栈大小、includeList
- [✅] 使用 Vue 绿色（`0x42b883`）作为时间线颜色

**验收**：

- [✅] 每次导航在 DevTools Timeline 中显示事件
- [✅] 事件标题格式：`push → /detail/123`
- [✅] 事件数据包含完整导航信息
- [✅] 点击事件可查看详细数据

### T13-03：页面栈 Inspector 面板

文件：`packages/core/src/devtools/inspector.ts`

- [✅] 实现 Inspector 面板：

  ```ts
  import type { DevtoolsPluginApi, CustomInspectorNode } from '@vue/devtools-api'

  const INSPECTOR_ID = 'vue-keep:stacks'

  export function setupInspector(
    api: DevtoolsPluginApi<Record<string, never>>,
    store: CoreStore,
  ): void {
    // 注册 Inspector
    api.addInspector({
      id: INSPECTOR_ID,
      label: 'Vue Keep Stacks',
      icon: 'layers',
    })

    // 获取树形结构
    api.on.getInspectorTree((payload) => {
      if (payload.inspectorId !== INSPECTOR_ID) return

      const nodes: CustomInspectorNode[] = []

      for (const [containerId, stack] of store.state.stacks) {
        const containerNode: CustomInspectorNode = {
          id: containerId,
          label: containerId,
          tags: [
            {
              label: `${stack.length} pages`,
              textColor: 0xffffff,
              backgroundColor: 0x42b883,
            },
          ],
          children: stack.map((entry, index) => ({
            id: `${containerId}:${entry.id}`,
            label: entry.name,
            tags: [
              ...(entry.constCache
                ? [
                    {
                      label: 'constCache',
                      textColor: 0xffffff,
                      backgroundColor: 0xe6a23c,
                    },
                  ]
                : []),
              ...(index === stack.length - 1
                ? [
                    {
                      label: 'active',
                      textColor: 0xffffff,
                      backgroundColor: 0x409eff,
                    },
                  ]
                : []),
            ],
          })),
        }
        nodes.push(containerNode)
      }

      payload.rootNodes = nodes
    })

    // 获取节点详情
    api.on.getInspectorState((payload) => {
      if (payload.inspectorId !== INSPECTOR_ID) return

      const [containerId, entryId] = payload.nodeId.split(':')
      const stack = store.getStack(containerId)

      if (entryId) {
        // 条目详情
        const entry = stack.find((e) => e.id === entryId)
        if (!entry) return

        payload.state = {
          基本信息: [
            { key: 'id', value: entry.id },
            { key: 'name', value: entry.name },
            { key: 'fullPath', value: entry.fullPath },
            { key: 'position', value: entry.position },
            { key: 'depth', value: entry.depth },
            { key: 'constCache', value: entry.constCache, editable: true },
          ],
          时间: [
            { key: 'createdAt', value: new Date(entry.createdAt).toLocaleString() },
            { key: 'lastActiveAt', value: new Date(entry.lastActiveAt).toLocaleString() },
          ],
          路由: [
            { key: 'route.name', value: entry.route.name },
            { key: 'route.path', value: entry.route.path },
            { key: 'route.query', value: entry.route.query },
            { key: 'route.params', value: entry.route.params },
            { key: 'route.meta', value: entry.route.meta },
          ],
          滚动位置: [
            ...Array.from(entry.scrollPositions.entries()).map(([key, pos]) => ({
              key,
              value: `top: ${pos.top}, left: ${pos.left}`,
            })),
          ],
          元数据: [
            { key: 'metadata', value: entry.metadata },
            { key: 'channelId', value: entry.channelId },
          ],
        }
      } else {
        // 容器详情
        payload.state = {
          容器信息: [
            { key: 'containerId', value: containerId },
            { key: 'stackSize', value: stack.length },
            { key: 'includeList', value: store.getIncludeList(containerId) },
          ],
        }
      }
    })

    // 支持编辑 constCache
    api.on.editInspectorState((payload) => {
      if (payload.inspectorId !== INSPECTOR_ID) return

      const [containerId, entryId] = payload.nodeId.split(':')
      if (!entryId) return

      if (payload.path[0] === '基本信息' && payload.path[1] === 'constCache') {
        store.updateEntry(containerId, entryId, {
          constCache: payload.state.value,
        })
        api.sendInspectorState(INSPECTOR_ID)
      }
    })

    // store 变更时刷新 Inspector
    store.onStateChange(() => {
      api.sendInspectorTree(INSPECTOR_ID)
      api.sendInspectorState(INSPECTOR_ID)
    })
  }
  ```

**验收**：

- [✅] DevTools Inspector 中显示所有容器和栈条目
- [✅] 每个条目显示 name、constCache 标签、active 标签
- [✅] 点击条目显示详细信息（路由、滚动位置、元数据）
- [✅] 可以在 Inspector 中编辑 constCache 值
- [✅] 导航后 Inspector 自动刷新

### T13-04：手动销毁缓存

文件：`packages/core/src/devtools/inspector.ts`（补充）

- [✅] 在 Inspector 中添加自定义操作按钮：

  ```ts
  // 注册自定义操作
  api.on.getInspectorActions?.((payload) => {
    if (payload.inspectorId !== INSPECTOR_ID) return

    const [containerId, entryId] = payload.nodeId.split(':')
    if (!entryId) return

    payload.actions = [
      {
        icon: 'delete',
        tooltip: '销毁此缓存条目',
        action: () => {
          const entry = store.getEntry(containerId, entryId)
          if (entry) {
            store.destroy((stackEntry) => stackEntry.id === entry.id)
            api.sendInspectorTree(INSPECTOR_ID)
          }
        },
      },
    ]
  })
  ```

- [✅] 注意：`getInspectorActions` 是较新的 API，需要检查是否可用

**验收**：

- [✅] Inspector 中右键/操作按钮可以销毁缓存条目
- [✅] 销毁后 Inspector 自动刷新

### T13-05：生产构建 tree-shake

文件：`packages/core/src/plugin.ts`（修改）

- [✅] 确保 DevTools 代码在生产构建中被 tree-shake：
  ```ts
  // plugin.ts 中
  if (__DEV__ && options.devtools) {
    setupDevtools(app, store)
  }
  ```
- [✅] tsup 构建时定义 `__DEV__` 为 `process.env.NODE_ENV !== 'production'`
- [✅] 生产构建后 `setupDevtools` 及其依赖不出现在 bundle 中

**验收**：

- [✅] 开发模式下 DevTools 正常工作
- [✅] 生产构建的 bundle 不包含 DevTools 代码
- [✅] `@vue/devtools-api` 在生产构建中不被引入

### T13-06：store 事件订阅接口

文件：`packages/core/src/store/core-store.ts`（补充）

- [✅] 为 DevTools 添加必要的事件订阅接口：

  ```ts
  // CoreStore 接口补充
  interface CoreStore {
    // ... 已有方法

    // DevTools 订阅
    onNavigationCommit(handler: (nav: NavigationCommitEvent) => void): () => void // 订阅导航提交事件
    onStateChange(handler: () => void): () => void // 订阅任意状态变更
  }

  interface NavigationCommitEvent {
    id: string // 本次导航提交 id
    method: NavigationMethod // 本次导航方法
    direction: NavigationDirection // 本次导航方向
    delta: number // 本次导航步数
    from: RouteLocationNormalizedLoaded | null // 来源路由
    to: RouteLocationNormalizedLoaded // 目标路由
    stackSize: number // 提交后的栈大小
    includeList: string[] // 提交后的 include 列表
  }
  ```

- [✅] 使用简单的 Set 存储订阅者
- [✅] 在 `commitNavigation` 中触发 `onNavigationCommit`
- [✅] 在任何 state 变更后触发 `onStateChange`

**验收**：

- [✅] `onNavigationCommit` 在每次导航提交后触发
- [✅] `onStateChange` 在栈变更后触发
- [✅] 返回的取消函数能正确移除订阅

---

## 完成标准

- [✅] Vue DevTools 中显示 "Vue Keep" 插件
- [✅] Timeline 记录所有导航事件
- [✅] Inspector 可视化页面栈树
- [✅] Inspector 支持查看条目详情和编辑 constCache
- [✅] 支持手动销毁缓存条目
- [✅] 生产构建完全 tree-shake
- [✅] `pnpm typecheck` 通过
