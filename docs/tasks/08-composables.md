# 模块 08：Composables

> 阶段：Phase 1 | 预估：1.5 天 | 前置依赖：模块 06、07 | 状态：✅ 已完成

## 目标

实现核心 composable 函数，为用户提供 Composition API 风格的页面缓存控制能力。所有 composable 都通过 `inject` 获取 store/options，不依赖全局变量。

---

## 文件清单

| 文件                                                      | 职责                 | 状态 |
| --------------------------------------------------------- | -------------------- | ---- |
| `packages/core/src/composables/useKeepRouter.ts`          | 获取 keepRouter 实例 | ✅   |
| `packages/core/src/composables/usePageCache.ts`           | 当前页面缓存控制     | ✅   |
| `packages/core/src/composables/useNavigationDirection.ts` | 导航方向响应式引用   | ✅   |
| `packages/core/src/composables/usePageStack.ts`           | 页面栈只读访问       | ✅   |
| `packages/core/src/composables/index.ts`                  | 桶文件               | ✅   |

---

## 已完成任务

- [✅] T08-01: useKeepRouter（inject + 未安装时抛错）
- [✅] T08-02: usePageCache（isCached/markAsCached/removeFromCache/setConstCache）
- [✅] T08-03: useNavigationDirection（ComputedRef<NavigationDirection>）
- [✅] T08-04: usePageStack（stack/current/size/depth/containerId/has/find）
- [✅] T08-05: composables 桶文件 + index.ts re-export

## 完成标准

- [✅] 所有 composable 通过 inject 获取依赖
- [✅] 未安装插件时有明确错误提示
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过（133 个测试）
- [✅] `pnpm build` 通过

---

## 文件清单

| 文件                                                      | 职责                 |
| --------------------------------------------------------- | -------------------- |
| `packages/core/src/composables/useKeepRouter.ts`          | 获取 keepRouter 实例 |
| `packages/core/src/composables/usePageCache.ts`           | 当前页面缓存控制     |
| `packages/core/src/composables/useNavigationDirection.ts` | 导航方向响应式引用   |
| `packages/core/src/composables/usePageStack.ts`           | 页面栈只读访问       |
| `packages/core/src/composables/index.ts`                  | 桶文件               |

---

## 任务清单

### T08-01：useKeepRouter

文件：`packages/core/src/composables/useKeepRouter.ts`

- [ ] 实现：

  ```ts
  import { inject } from 'vue'
  import { KEEP_ROUTER_KEY } from '../symbols'
  import type { KeepRouter } from '../types/public'

  export function useKeepRouter(): KeepRouter {
    const keepRouter = inject(KEEP_ROUTER_KEY)
    if (!keepRouter) {
      throw new Error('[vue-keep] useKeepRouter() 必须在 createKeepRouter() 安装后的组件中调用')
    }
    return keepRouter
  }
  ```

- [ ] 未安装插件时抛出明确错误

**验收**：

- [ ] 在已安装插件的组件中调用返回 KeepRouter 实例
- [ ] 在未安装插件的组件中调用抛出错误
- [ ] 返回值包含 push/replace/back/reLaunch/switchTab/destroy/beforeEach 方法
- [ ] 返回值包含 stacks/currentEntry/direction 只读属性

### T08-02：usePageCache

文件：`packages/core/src/composables/usePageCache.ts`

- [ ] 实现：

  ```ts
  import { inject, computed } from 'vue'
  import { KEEP_STORE_KEY, CONTAINER_ID_KEY } from '../symbols'
  import type { PageCacheControls } from '../types/public'

  export function usePageCache(containerId?: string): PageCacheControls {
    const store = inject(KEEP_STORE_KEY)!
    const injectedContainerId = inject(CONTAINER_ID_KEY, undefined)
    const cid = containerId ?? injectedContainerId ?? 'keep:0:root:default'

    const currentEntry = computed(() => store.getCurrentEntry(cid))

    return {
      isCached: computed(() => {
        const entry = currentEntry.value
        if (!entry) return false
        const includeList = store.getIncludeList(cid)
        return includeList.includes(entry.name)
      }),

      markAsCached() {
        const entry = currentEntry.value
        if (entry) {
          store.ensureInStack(cid, entry)
        }
      },

      removeFromCache() {
        const entry = currentEntry.value
        if (entry) {
          store.destroy((stackEntry) => stackEntry.id === entry.id)
        }
      },

      setConstCache(value: boolean) {
        const entry = currentEntry.value
        if (entry) {
          store.updateEntry(cid, entry.id, { constCache: value })
        }
      },
    }
  }
  ```

- [ ] `isCached`：当前页面是否在缓存列表中
- [ ] `markAsCached()`：手动将当前页面加入缓存
- [ ] `removeFromCache()`：手动将当前页面从缓存中移除
- [ ] `setConstCache(value)`：设置/取消当前页面的 constCache 保护

**验收**：

- [ ] `isCached` 在页面被缓存时返回 true
- [ ] `removeFromCache()` 后 `isCached` 变为 false
- [ ] `setConstCache(true)` 后页面不会被 LRU 淘汰
- [ ] `setConstCache(false)` 后页面恢复可淘汰状态

### T08-03：useNavigationDirection

文件：`packages/core/src/composables/useNavigationDirection.ts`

- [ ] 实现：

  ```ts
  import { inject, computed } from 'vue'
  import { KEEP_STORE_KEY } from '../symbols'
  import type { NavigationDirection } from '../types/public'

  export function useNavigationDirection(): ComputedRef<NavigationDirection> {
    const store = inject(KEEP_STORE_KEY)!
    return computed(() => store.state.lastNavigation?.direction ?? 'none')
  }
  ```

- [ ] 返回值是 `ComputedRef<'forward' | 'back' | 'none'>`
- [ ] 每次导航后自动更新

**验收**：

- [ ] push 后返回 'forward'
- [ ] back 后返回 'back'
- [ ] replace 后返回 'none'
- [ ] 初始状态返回 'none'

### T08-04：usePageStack

文件：`packages/core/src/composables/usePageStack.ts`

- [ ] 实现：

  ```ts
  import { inject, computed } from 'vue'
  import { KEEP_STORE_KEY, CONTAINER_ID_KEY, DEPTH_KEY } from '../symbols'
  import type { PageStackEntry } from '../types/public'

  export function usePageStack(containerId?: string) {
    const store = inject(KEEP_STORE_KEY)!
    const depth = inject(DEPTH_KEY, 0)
    const injectedContainerId = inject(CONTAINER_ID_KEY, undefined)
    const cid = containerId ?? injectedContainerId ?? 'keep:0:root:default'

    return {
      // 当前容器的栈（只读）
      stack: computed(() => store.getStack(cid)),

      // 当前激活的条目
      current: computed(() => store.getCurrentEntry(cid)),

      // 栈深度
      size: computed(() => store.getStack(cid).length),

      // 当前容器的 depth
      depth,

      // 当前容器 ID
      containerId: cid,

      // 检查某个 name 是否在栈中
      has(name: string): boolean {
        return store.getStack(cid).some((e) => e.name === name)
      },

      // 根据 name 查找条目
      find(name: string): Readonly<PageStackEntry> | undefined {
        return store.getStack(cid).find((e) => e.name === name)
      },
    }
  }
  ```

- [ ] `stack`：只读的栈数组
- [ ] `current`：当前激活条目
- [ ] `size`：栈深度
- [ ] `has(name)`：检查某个页面是否在栈中
- [ ] `find(name)`：根据 name 查找条目

**验收**：

- [ ] `stack` 返回只读数组，修改不影响内部状态
- [ ] push 后 `size` 增加
- [ ] back 后 `size` 减少
- [ ] `has('home')` 在 home 入栈后返回 true
- [ ] `find('home')` 返回对应的 PageStackEntry

### T08-05：composables 桶文件

文件：`packages/core/src/composables/index.ts`

- [ ] 导出所有 composable：
  ```ts
  export { useKeepRouter } from './useKeepRouter'
  export { usePageCache } from './usePageCache'
  export { useNavigationDirection } from './useNavigationDirection'
  export { usePageStack } from './usePageStack'
  ```
- [ ] 在 `packages/core/src/index.ts` 中 re-export

**验收**：`import { useKeepRouter, usePageCache } from '@bye_past/vue-keep'` 可用

---

## 完成标准

- [ ] 所有 composable 通过 inject 获取依赖，不使用全局变量
- [ ] 未安装插件时有明确错误提示
- [ ] 所有返回的响应式值在导航后自动更新
- [ ] 单元测试覆盖：正常使用、未安装插件、边界情况
- [ ] `pnpm typecheck` 通过
