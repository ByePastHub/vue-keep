import { shallowReactive } from 'vue'
import type { RouteLocationNormalized, RouteLocationNormalizedLoaded } from 'vue-router'
import type {
  DestroyTarget,
  KeepGuardReturn,
  KeepNavigationGuard,
  NavigationDirection,
  NavigationMethod,
  PageStackEntry,
} from '../types/public'
import type {
  ApplyResult,
  ChannelRegistry,
  NavigationCommitEvent,
  NavigationInfo,
  PrepareNavigationParams,
  StackManager,
  VueKeepState,
} from '../types/internal'
import { matchName } from '../utils/match'
import { genId } from './id-allocator'
import { warn } from '../utils/warn'

// ---- 导航快照 ----

interface NavigationSnapshot {
  id: string // 本次导航提交 id
  method: NavigationMethod // 本次导航方法
  direction: NavigationDirection // 本次导航方向
  delta: number // 本次导航步数
  containerId: string // 本次导航命中的容器 id
  from: RouteLocationNormalizedLoaded | null // 来源路由
  to: RouteLocationNormalizedLoaded | null // 目标路由
  timestamp: number // 提交时间戳
}

// ---- Store 内部状态 ----

interface CoreStoreState {
  stacks: Map<string, PageStackEntry[]> // 所有容器的页面栈
  currentRoute: RouteLocationNormalizedLoaded | null // 当前激活路由
  lastNavigation: NavigationSnapshot | null // 最近一次导航快照
  pendingDirection: NavigationDirection | null // 当前正在进行的导航方向（beforeEach 设置，afterEach 清除）
  ready: boolean // 是否完成初始化
}

// ---- 触发 shallowReactive Map 更新 ----

function triggerStacks(state: CoreStoreState) {
  state.stacks = new Map(state.stacks)
}

export function createCoreStore() {
  const state = shallowReactive<CoreStoreState>({
    stacks: new Map(),
    currentRoute: null,
    lastNavigation: null,
    pendingDirection: null,
    ready: false,
  })

  // 导航信息暂存
  let pendingInfo: NavigationInfo | null = null
  // beforeEach 准备、afterEach 提交的导航快照
  let preparedNavigation: PrepareNavigationParams | null = null
  // 由 plugin 注入的栈管理器
  let stackManager: StackManager | null = null
  // 由 plugin 注入的通道注册表
  let channelRegistry: ChannelRegistry | null = null
  // 导航守卫列表
  const guards: Set<KeepNavigationGuard> = new Set()
  // 导航提交事件订阅者
  const navigationCommitListeners: Set<(nav: NavigationCommitEvent) => void> = new Set()
  // 状态变更订阅者
  const stateListeners: Set<() => void> = new Set()

  function notifyStateChange() {
    stateListeners.forEach((fn) => fn())
  }

  function destroyChannelIfNeeded(entry: PageStackEntry) {
    if (entry.channelId && channelRegistry) {
      channelRegistry.destroy(entry.channelId)
    }
  }

  // ---- 栈操作方法 ----

  function ensureStack(containerId: string) {
    if (!state.stacks.has(containerId)) {
      state.stacks.set(containerId, [])
      triggerStacks(state)
    }
  }

  function destroyStack(containerId: string) {
    const stack = state.stacks.get(containerId)
    if (stack) {
      stack.forEach(destroyChannelIfNeeded)
      state.stacks.delete(containerId)
      triggerStacks(state)
      notifyStateChange()
    }
  }

  function getStack(containerId: string): ReadonlyArray<PageStackEntry> {
    return state.stacks.get(containerId) ?? []
  }

  function getIncludeList(containerId: string): string[] {
    const stack = state.stacks.get(containerId)
    if (!stack) return []
    return stack.map((e) => e.name)
  }

  function getEntry(containerId: string, id: string): PageStackEntry | undefined {
    const stack = state.stacks.get(containerId)
    return stack?.find((e) => e.id === id)
  }

  function getCurrentEntry(containerId: string): PageStackEntry | undefined {
    const stack = state.stacks.get(containerId)
    if (!stack || stack.length === 0) return undefined
    return stack[stack.length - 1]
  }

  function ensureInStack(containerId: string, entry: PageStackEntry) {
    const stack = state.stacks.get(containerId)
    if (!stack) return
    if (stack.some((e) => e.id === entry.id)) return
    stack.push(entry)
    triggerStacks(state)
  }

  function updateEntry(
    containerId: string,
    id: string,
    patch: Partial<PageStackEntry>,
  ): PageStackEntry | undefined {
    const stack = state.stacks.get(containerId)
    if (!stack) return undefined
    const idx = stack.findIndex((e) => e.id === id)
    if (idx === -1) return undefined
    const entry = stack[idx]!
    Object.assign(entry, patch)
    triggerStacks(state)
    notifyStateChange()
    return entry
  }

  // ---- 导航状态方法 ----

  function setPendingInfo(info: NavigationInfo) {
    pendingInfo = info
  }

  function takePendingInfo(): NavigationInfo | null {
    const info = pendingInfo
    pendingInfo = null
    return info
  }

  function prepareNavigation(params: PrepareNavigationParams) {
    preparedNavigation = params
    state.pendingDirection = params.direction
  }

  function clearPreparedNavigation() {
    preparedNavigation = null
    state.pendingDirection = null
  }

  function getPreparedMethod(): NavigationMethod | null {
    return preparedNavigation?.method ?? null
  }

  function commitNavigation(): ApplyResult | null {
    if (!preparedNavigation || !stackManager) {
      warn('commitNavigation: 缺少 preparedNavigation 或 stackManager')
      preparedNavigation = null
      return null
    }

    const nav = preparedNavigation
    preparedNavigation = null
    state.pendingDirection = null

    ensureStack(nav.containerId)
    const stack = state.stacks.get(nav.containerId)!

    const result = stackManager.apply(stack, {
      containerId: nav.containerId,
      to: nav.to,
      from: nav.from,
      method: nav.method,
      direction: nav.direction,
      delta: nav.delta,
      hints: nav.hints,
    })

    // 销毁被移除条目的 eventChannel
    result.removed.forEach(destroyChannelIfNeeded)

    // 更新响应式状态
    triggerStacks(state)
    state.currentRoute = nav.to

    const navId = genId()
    const snapshot: NavigationSnapshot = {
      id: navId,
      method: nav.method,
      direction: nav.direction,
      delta: nav.delta,
      containerId: nav.containerId,
      from: nav.from,
      to: nav.to,
      timestamp: Date.now(),
    }
    state.lastNavigation = snapshot

    // 通知导航提交监听器
    const event: NavigationCommitEvent = {
      id: navId,
      method: nav.method,
      direction: nav.direction,
      delta: nav.delta,
      containerId: nav.containerId,
      from: nav.from,
      to: nav.to,
      added: result.added,
      removed: result.removed,
      updated: result.updated,
      stackSize: getStack(nav.containerId).length,
      includeList: getIncludeList(nav.containerId),
      timestamp: snapshot.timestamp,
    }
    navigationCommitListeners.forEach((fn) => fn(event))
    notifyStateChange()

    return result
  }

  function initFirstEntry(containerId: string, route: RouteLocationNormalizedLoaded) {
    if (!stackManager) {
      warn('initFirstEntry: stackManager 未注入')
      return
    }
    ensureStack(containerId)
    const stack = state.stacks.get(containerId)!
    if (stack.length > 0) return

    stackManager.apply(stack, {
      containerId,
      to: route,
      from: null,
      method: 'push',
      direction: 'forward',
      delta: 1,
      hints: {},
    })

    triggerStacks(state)
    state.currentRoute = route
    notifyStateChange()
  }

  function restoreFromState(
    containerId: string,
    keepState: VueKeepState,
    route: RouteLocationNormalizedLoaded,
  ) {
    if (!stackManager) {
      warn('restoreFromState: stackManager 未注入')
      return
    }
    ensureStack(containerId)
    const stack = state.stacks.get(containerId)!

    // 检查是否已存在该条目
    if (stack.some((e) => e.id === keepState.__vueKeepId)) {
      state.currentRoute = route
      return
    }

    stackManager.apply(stack, {
      containerId,
      to: route,
      from: null,
      method: 'push',
      direction: 'forward',
      delta: 1,
      hints: {},
    })

    triggerStacks(state)
    state.currentRoute = route
    notifyStateChange()
  }

  function setReady() {
    state.ready = true
    notifyStateChange()
  }

  // ---- 守卫管理 ----

  function addGuard(guard: KeepNavigationGuard): () => void {
    guards.add(guard)
    return () => guards.delete(guard)
  }

  async function runGuards(
    to: RouteLocationNormalized,
    from: RouteLocationNormalized,
    direction: NavigationDirection,
  ): Promise<KeepGuardReturn> {
    let merged: KeepGuardReturn = {}
    for (const guard of guards) {
      const result = await guard(to, from, direction)
      if (result !== undefined && result !== null) {
        merged = { ...merged, ...result }
      }
    }
    return merged
  }

  // ---- 事件订阅 ----

  function onNavigationCommit(listener: (event: NavigationCommitEvent) => void): () => void {
    navigationCommitListeners.add(listener)
    return () => navigationCommitListeners.delete(listener)
  }

  function onStateChange(listener: () => void): () => void {
    stateListeners.add(listener)
    return () => stateListeners.delete(listener)
  }

  // ---- 销毁方法 ----

  function destroy(target: DestroyTarget) {
    if (target === 'ALL') {
      for (const [, stack] of state.stacks) {
        stack.forEach(destroyChannelIfNeeded)
        stack.length = 0
      }
      triggerStacks(state)
      notifyStateChange()
      return
    }

    for (const [, stack] of state.stacks) {
      const toRemove: number[] = []

      for (let i = 0; i < stack.length; i++) {
        const entry = stack[i]!
        let shouldRemove = false

        if (typeof target === 'function') {
          shouldRemove = target(entry)
        } else if (Array.isArray(target)) {
          shouldRemove = target.some((t) => matchName(t, entry.name))
        } else {
          shouldRemove = matchName(target, entry.name)
        }

        if (shouldRemove) {
          toRemove.push(i)
        }
      }

      if (toRemove.length > 0) {
        for (let i = toRemove.length - 1; i >= 0; i--) {
          const idx = toRemove[i]!
          const entry = stack[idx]!
          destroyChannelIfNeeded(entry)
          stack.splice(idx, 1)
        }
      }
    }

    triggerStacks(state)
    notifyStateChange()
  }

  // ---- 注入器 ----

  function setStackManager(manager: StackManager) {
    stackManager = manager
  }

  function setChannelRegistry(registry: ChannelRegistry) {
    channelRegistry = registry
  }

  return {
    state,

    // 注入器
    setStackManager,
    setChannelRegistry,

    // 栈操作
    ensureStack,
    destroyStack,
    getStack,
    getIncludeList,
    getEntry,
    getCurrentEntry,
    ensureInStack,
    updateEntry,

    // 导航状态
    setPendingInfo,
    takePendingInfo,
    prepareNavigation,
    clearPreparedNavigation,
    getPreparedMethod,
    commitNavigation,
    initFirstEntry,
    restoreFromState,
    setReady,

    // 守卫
    addGuard,
    runGuards,

    // 事件
    onNavigationCommit,
    onStateChange,

    // 销毁
    destroy,
  }
}

export type CoreStore = ReturnType<typeof createCoreStore>
