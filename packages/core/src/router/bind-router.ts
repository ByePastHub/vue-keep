import { nextTick } from 'vue'
import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'
import type { KeepOptionsResolved, ScrollPosition } from '../types/public'
import type { CoreStore } from '../store/core-store'
import { IntentTracker } from './intent-tracker'
import { resolveNavigation } from './navigation-info'
import { readKeepState, injectInitialState } from '../store/persistence'
import { genId } from '../store/id-allocator'
import { isBrowser } from '../utils/env'
import { detectScrollContainers } from '../scroll/container-detect'
import { captureScrollPositions } from '../scroll/capture'
import { restoreScrollPositions } from '../scroll/restore'
import { resetScrollOnReload } from '../store/scroll-restoration-mode'

// 默认容器 ID
const DEFAULT_CONTAINER = 'keep:0:root:default'

// 同步离开页偏移，避免前进动画期间旧页面因窗口滚动归零而显示顶部
function syncLeavingPageOffset(positions: Map<string, ScrollPosition>) {
  if (!isBrowser) return
  const documentPosition = positions.get('__document__')
  const top = documentPosition?.top ?? 0
  const left = documentPosition?.left ?? 0
  document.documentElement.style.setProperty('--vue-keep-leave-top', `${-top}px`)
  document.documentElement.style.setProperty('--vue-keep-leave-left', `${-left}px`)
}

export function bindRouter(
  router: Router,
  store: CoreStore,
  options: KeepOptionsResolved,
  intentTracker: IntentTracker,
): () => void {
  // 1. 注册 history.listen 回调
  const unlisten = (router.options.history as any).listen?.(
    (_to: string, _from: string, info: { type: string; direction: string; delta: number }) => {
      store.setPendingInfo({
        type: info.type as 'pop' | 'push',
        direction: info.direction as 'forward' | 'back' | 'unknown',
        delta: info.delta,
      })
    },
  )

  // 保存当前页面滚动位置（在 beforeEach 同步执行，抓导航发起前的真实位置）
  function saveCurrentScroll() {
    if (!isBrowser || options.scrollBehavior === 'none') return
    const entry = store.getCurrentEntry(DEFAULT_CONTAINER)
    if (!entry) return
    const containers = detectScrollContainers()
    const positions = captureScrollPositions(containers)
    syncLeavingPageOffset(positions)
    store.updateEntry(DEFAULT_CONTAINER, entry.id, { scrollPositions: positions })
  }

  // 恢复目标页面滚动位置
  // 关键：放到 nextTick 之后启动，等 KeepAlive 完成 DOM 切换，避免 sync apply 把滚动写到旧组件
  // 期间记录目标 entry 的 id，等 nextTick 后再次校验当前 entry 仍是同一个，防止用户连续切换时把
  // 旧导航的滚动位置应用到新页面上
  async function restoreTargetScroll(method: string) {
    if (!isBrowser || options.scrollBehavior === 'none') return
    if (method !== 'back' && method !== 'switchTab') return
    const entry = store.getCurrentEntry(DEFAULT_CONTAINER)
    if (!entry) return
    const targetEntryId = entry.id
    const positions =
      entry.scrollPositions.size > 0
        ? entry.scrollPositions
        : new Map<string, ScrollPosition>([['__document__', { top: 0, left: 0 }]])

    await nextTick()

    const currentEntry = store.getCurrentEntry(DEFAULT_CONTAINER)
    if (!currentEntry || currentEntry.id !== targetEntryId) return

    const containers = detectScrollContainers()
    restoreScrollPositions(containers, positions)
  }

  // 2. 注册 beforeEach
  const removeBeforeEach = router.beforeEach(async (to, from) => {
    // 在导航前保存当前页面的滚动位置
    saveCurrentScroll()

    const intent = intentTracker.consume()
    const info = store.takePendingInfo()
    const { method, direction, delta } = resolveNavigation(intent, info)

    // 解析容器 ID（简化版：使用默认容器）
    const containerId = DEFAULT_CONTAINER

    // 运行用户守卫
    const guardResult = await store.runGuards(to, from, direction)

    // 合并 hints
    const hints = {
      cache: intent?.cache ?? guardResult.cache ?? (to.meta as any)?.keep?.cache,
      constCache:
        intent?.constCache ?? guardResult.constCache ?? (to.meta as any)?.keep?.constCache,
      destroy: intent?.destroy ?? guardResult.destroy ?? (to.meta as any)?.keep?.destroy,
      metadata: intent?.metadata,
      channelId: intent?.channelId ?? null,
      targetTabKey: intent?.targetTabKey ?? (to.meta as any)?.keep?.tabKey ?? null,
    }

    // 暂存到 store
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

  // 3. 注册 afterEach
  const removeAfterEach = router.afterEach((_to, _from, failure) => {
    if (failure) {
      store.clearPreparedNavigation()
      return
    }
    const method = store.getPreparedMethod()
    store.commitNavigation()
    if (method) {
      void restoreTargetScroll(method)
    }
  })

  // 4. 初始化
  router.isReady().then(() => {
    const currentRoute = router.currentRoute.value
    const keepState = isBrowser ? readKeepState(history.state) : null

    if (keepState) {
      store.restoreFromState(DEFAULT_CONTAINER, keepState, currentRoute)
    } else {
      if (isBrowser) {
        injectInitialState(genId())
      }
      store.initFirstEntry(DEFAULT_CONTAINER, currentRoute)
    }

    store.setReady()
    resetScrollOnReload()
  })

  // 5. 返回 teardown
  return () => {
    unlisten?.()
    removeBeforeEach()
    removeAfterEach()
    intentTracker.clear()
  }
}
