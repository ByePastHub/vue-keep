# 模块 09：滚动恢复

> 阶段：Phase 2 | 预估：2 天 | 前置依赖：模块 02、07

## 目标

实现页面返回时的滚动位置恢复。支持 `document.scrollingElement`（主滚动容器）和自定义滚动容器（通过 `[data-scroll-container]` 标记）。抓取在 `onDeactivated` 同步阶段完成，恢复采用三道防线策略确保可靠性。

---

## 文件清单

| 文件                                                    | 职责                            |
| ------------------------------------------------------- | ------------------------------- |
| `packages/core/src/scroll/capture.ts`                   | 滚动位置抓取                    |
| `packages/core/src/scroll/restore.ts`                   | 滚动位置恢复（三道防线）        |
| `packages/core/src/scroll/container-detect.ts`          | 滚动容器发现                    |
| `packages/core/src/scroll/resize-watcher.ts`            | ResizeObserver 监听高度变化     |
| `packages/core/src/scroll/index.ts`                     | 桶文件                          |
| `packages/core/src/composables/useScrollRestoration.ts` | 滚动恢复 composable             |
| `packages/core/src/scroll/keep-scroll-behavior.ts`      | createKeepScrollBehavior helper |

---

## 任务清单

### T09-01：滚动容器发现

文件：`packages/core/src/scroll/container-detect.ts`

- [✅] 实现 `detectScrollContainers` 函数：

  ```ts
  export function detectScrollContainers(
    root?: Element | null,
    extraSelectors?: string[],
  ): Element[] {
    const containers: Element[] = []

    // 1. 主滚动容器
    const scrollingElement = document.scrollingElement || document.documentElement
    containers.push(scrollingElement)

    // 2. [data-scroll-container] 标记的元素
    const marked = (root || document).querySelectorAll('[data-scroll-container]')
    marked.forEach((el) => containers.push(el))

    // 3. 额外选择器（来自 props.scrollContainers）
    if (extraSelectors) {
      for (const selector of extraSelectors) {
        const els = (root || document).querySelectorAll(selector)
        els.forEach((el) => containers.push(el))
      }
    }

    // 去重
    return [...new Set(containers)]
  }
  ```

- [✅] 不使用 MutationObserver 扫描 overflow（开销大、误判多）
- [✅] SSR 环境下返回空数组

**验收**：

- [✅] 默认发现 `document.scrollingElement`
- [✅] 发现所有 `[data-scroll-container]` 元素
- [✅] 额外选择器正确匹配
- [✅] 结果无重复

### T09-02：滚动位置抓取

文件：`packages/core/src/scroll/capture.ts`

- [✅] 实现 `captureScrollPositions` 函数：

  ```ts
  export function captureScrollPositions(containers: Element[]): Map<string, ScrollPosition> {
    const positions = new Map<string, ScrollPosition>()

    for (const el of containers) {
      const key = getContainerKey(el)
      let top = el.scrollTop
      let left = el.scrollLeft

      // iOS 弹性滚动 clamp
      top = Math.max(0, Math.min(top, el.scrollHeight - el.clientHeight))
      left = Math.max(0, Math.min(left, el.scrollWidth - el.clientWidth))

      positions.set(key, {
        top,
        left,
        scrollWidth: el.scrollWidth,
        scrollHeight: el.scrollHeight,
      })
    }

    return positions
  }
  ```

- [✅] 实现 `getContainerKey` 函数：
  ```ts
  function getContainerKey(el: Element): string {
    // 主滚动容器用固定 key
    if (el === document.scrollingElement || el === document.documentElement) {
      return '__document__'
    }
    // data-scroll-container 的值作为 key
    const attr = el.getAttribute('data-scroll-container')
    if (attr) return attr
    // 用选择器路径作为 fallback key
    return el.id ? `#${el.id}` : generateSelectorPath(el)
  }
  ```
- [✅] iOS 弹性滚动 clamp：`scrollTop` 可能为负值或超出最大值
- [✅] 在 `onDeactivated` 同步阶段调用（此时 DOM 还在）

**验收**：

- [✅] 正确抓取 scrollTop 和 scrollLeft
- [✅] iOS 弹性滚动值被 clamp 到合法范围
- [✅] 多个容器各自独立抓取
- [✅] 主滚动容器 key 为 `__document__`

### T09-03：滚动位置恢复 — 三道防线

文件：`packages/core/src/scroll/restore.ts`

- [✅] 实现 `restoreScrollPositions` 函数：

  ```ts
  export async function restoreScrollPositions(
    containers: Element[],
    positions: Map<string, ScrollPosition>,
    options?: {
      timeout?: number // 三道防线的兜底超时时间
    },
  ): Promise<void> {
    const timeout = options?.timeout ?? 600

    // 第一道防线：nextTick 立即恢复
    await nextTick()
    applyPositions(containers, positions)

    // 第二道防线：ResizeObserver 监听高度变化
    const { promise, cleanup } = watchResize(containers, positions)

    // 第三道防线：超时兜底
    const timer = setTimeout(() => {
      applyPositions(containers, positions)
      cleanup()
    }, timeout)

    await Promise.race([promise, new Promise((r) => setTimeout(r, timeout))])
    clearTimeout(timer)
    cleanup()
  }
  ```

- [✅] 实现 `applyPositions` 内部函数：
  ```ts
  function applyPositions(containers: Element[], positions: Map<string, ScrollPosition>): void {
    for (const el of containers) {
      const key = getContainerKey(el)
      const pos = positions.get(key)
      if (!pos) continue
      if (el === document.scrollingElement || el === document.documentElement) {
        window.scrollTo({ top: pos.top, left: pos.left, behavior: 'auto' })
        continue
      }
      el.scrollTop = pos.top
      el.scrollLeft = pos.left
    }
  }
  ```
- [✅] 不使用非标准的 `behavior: 'instant'`

**验收**：

- [✅] nextTick 后立即恢复滚动位置
- [✅] 懒加载图片导致高度变化时，ResizeObserver 触发二次恢复
- [✅] 600ms 超时后强制恢复（兜底）
- [✅] 恢复完成后清理 ResizeObserver

### T09-04：ResizeObserver 监听

文件：`packages/core/src/scroll/resize-watcher.ts`

- [✅] 实现 `watchResize` 函数：

  ```ts
  export function watchResize(
    containers: Element[],
    positions: Map<string, ScrollPosition>,
  ): {
    promise: Promise<void> // 高度稳定后完成的 Promise
    cleanup: () => void // 提前停止监听并清理资源
  } {
    let observer: ResizeObserver | null = null
    let settled = false

    const cleanup = () => {
      if (observer) {
        observer.disconnect()
        observer = null
      }
      settled = true
    }

    const promise = new Promise<void>((resolve) => {
      if (typeof ResizeObserver === 'undefined') {
        resolve()
        return
      }

      let stableCount = 0
      let lastHeight = 0

      observer = new ResizeObserver((entries) => {
        if (settled) return

        // 重新应用滚动位置
        applyPositions(containers, positions)

        // 检查高度是否稳定
        const currentHeight = entries.reduce((sum, e) => sum + e.contentRect.height, 0)
        if (currentHeight === lastHeight) {
          stableCount++
          if (stableCount >= 2) {
            resolve()
            cleanup()
          }
        } else {
          stableCount = 0
        }
        lastHeight = currentHeight
      })

      // 观察所有容器的子元素（检测内容高度变化）
      for (const el of containers) {
        observer.observe(el)
      }
    })

    return { promise, cleanup }
  }
  ```

- [✅] 高度连续 2 次稳定后认为恢复完成
- [✅] `ResizeObserver` 不可用时直接 resolve（SSR 或旧浏览器）

**验收**：

- [✅] 图片懒加载导致容器高度变化时触发重新恢复
- [✅] 高度稳定后自动停止观察
- [✅] 不支持 ResizeObserver 的环境不报错

### T09-05：与 KeepRouterView 集成

文件：`packages/core/src/components/KeepPageShell.tsx`

- [✅] 在 `KeepPageShell` 中集成滚动抓取/恢复：

  ```ts
  const componentRef = ref<ComponentPublicInstance | null>(null)

  onActivated(() => {
    const entry = store.getCurrentEntry(props.containerId)
    if (entry?.scrollPositions.size) {
      const containers = detectScrollContainers(componentRef.value?.$el, [
        ...(props.scrollContainers ?? []),
        ...((entry.metadata.__scrollSelectors as string[] | undefined) ?? []),
      ])
      restoreScrollPositions(containers, entry.scrollPositions)
    }
  })

  onDeactivated(() => {
    const entry = store.getCurrentEntry(props.containerId)
    if (entry) {
      const containers = detectScrollContainers(componentRef.value?.$el, [
        ...(props.scrollContainers ?? []),
        ...((entry.metadata.__scrollSelectors as string[] | undefined) ?? []),
      ])
      const positions = captureScrollPositions(containers)
      store.updateEntry(props.containerId, entry.id, {
        scrollPositions: positions,
      })
    }
  })
  ```

- [✅] `KeepRouterView` 默认渲染和自定义 slot 的 `renderPage()` 都必须走 `KeepPageShell`

**验收**：

- [✅] 页面 deactivated 时自动抓取滚动位置
- [✅] 页面 activated 时自动恢复滚动位置
- [✅] 自定义 `scrollContainers` prop 生效

### T09-06：useScrollRestoration composable

文件：`packages/core/src/composables/useScrollRestoration.ts`

- [✅] 实现：

  ```ts
  export function useScrollRestoration(): ScrollRestorationControls {
    const store = inject(KEEP_STORE_KEY)!
    const cid = inject(CONTAINER_ID_KEY, 'keep:0:root:default')
    let paused = false

    return {
      save() {
        if (paused) return
        const entry = store.getCurrentEntry(cid)
        if (!entry) return
        const containers = detectScrollContainers()
        const positions = captureScrollPositions(containers)
        store.updateEntry(cid, entry.id, { scrollPositions: positions })
      },

      async restore() {
        const entry = store.getCurrentEntry(cid)
        if (!entry?.scrollPositions.size) return
        const containers = detectScrollContainers()
        await restoreScrollPositions(containers, entry.scrollPositions)
      },

      pause() {
        paused = true
      },
      resume() {
        paused = false
      },

      registerContainer(selector: string) {
        // 运行时动态注册额外的滚动容器选择器
        // 存储到 store 的 entry metadata 中
        const entry = store.getCurrentEntry(cid)
        if (entry) {
          const existing = (entry.metadata.__scrollSelectors as string[]) || []
          if (!existing.includes(selector)) {
            store.updateEntry(cid, entry.id, {
              metadata: { ...entry.metadata, __scrollSelectors: [...existing, selector] },
            })
          }
        }
      },
    }
  }
  ```

- [✅] `save()`：手动触发滚动位置保存
- [✅] `restore()`：手动触发滚动位置恢复
- [✅] `pause()`/`resume()`：暂停/恢复自动抓取
- [✅] `registerContainer(selector)`：动态注册额外滚动容器

**验收**：

- [✅] `save()` 后切换页面再返回，滚动位置正确恢复
- [✅] `pause()` 后自动抓取不执行
- [✅] `resume()` 后恢复自动抓取
- [✅] `registerContainer('.my-list')` 后该容器的滚动位置也被管理

### T09-07：createKeepScrollBehavior

文件：`packages/core/src/scroll/keep-scroll-behavior.ts`

- [✅] 实现与 Vue Router scrollBehavior 的集成 helper：

  ```ts
  import type { RouterScrollBehavior } from 'vue-router'

  export function createKeepScrollBehavior(
    getDirection: () => NavigationDirection,
    fallback?: RouterScrollBehavior,
  ): RouterScrollBehavior {
    return (to, from, savedPosition) => {
      if (getDirection() === 'back') {
        // 返回 false 表示不滚动（由 vue-keep 的滚动恢复接管）
        return false
      }

      // 非 vue-keep 管理的导航，使用 fallback 或默认行为
      if (fallback) {
        return fallback(to, from, savedPosition)
      }

      // 默认：前进时滚动到顶部
      if (savedPosition) {
        return savedPosition
      }
      return { top: 0 }
    }
  }
  ```

- [✅] 用法：

  ```ts
  let keepRouter: KeepRouter

  const router = createRouter({
    scrollBehavior: createKeepScrollBehavior(() => keepRouter?.direction ?? 'none'),
  })

  keepRouter = createKeepRouter({ router })
  ```

- [✅] back + 有缓存位置时返回 `false`（交给 vue-keep 恢复）
- [✅] 其他情况使用 fallback 或默认 `{ top: 0 }`

**验收**：

- [✅] 返回导航时 Vue Router 不干预滚动（由 vue-keep 接管）
- [✅] 前进导航时正常滚动到顶部
- [✅] 自定义 fallback 函数生效

### T09-08：SSR 安全

- [✅] 所有滚动相关函数在 SSR 环境下安全：
  - `detectScrollContainers`：返回空数组
  - `captureScrollPositions`：返回空 Map
  - `restoreScrollPositions`：直接 resolve
  - `watchResize`：直接 resolve
- [✅] 使用 `typeof window !== 'undefined'` 或 `typeof document !== 'undefined'` 检测
- [✅] 不在模块顶层访问 `window`/`document`

**验收**：Nuxt 3 SSR 渲染不报错

---

## 完成标准

- [✅] 页面返回时滚动位置自动恢复
- [✅] 支持主滚动容器和自定义滚动容器
- [✅] 三道防线确保恢复可靠性（nextTick → ResizeObserver → 超时兜底）
- [✅] iOS 弹性滚动正确处理
- [✅] 与 Vue Router scrollBehavior 正确共存
- [✅] SSR 安全
- [✅] 单元测试覆盖：抓取、恢复、多容器、ResizeObserver、SSR
- [✅] `pnpm typecheck` 通过
