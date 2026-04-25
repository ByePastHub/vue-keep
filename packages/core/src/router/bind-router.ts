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

  // 保存当前页面滚动位置
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
  function restoreTargetScroll(method: string) {
    if (!isBrowser || options.scrollBehavior === 'none') return
    const entry = store.getCurrentEntry(DEFAULT_CONTAINER)
    if (!entry) return
    if ((method === 'back' || method === 'switchTab') && entry.scrollPositions.size > 0) {
      const containers = detectScrollContainers()
      restoreScrollPositions(containers, entry.scrollPositions)
    }
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
      restoreTargetScroll(method)
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
