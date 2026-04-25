import type { RouteLocationNormalizedLoaded } from 'vue-router'
import type { KeepOptionsResolved, PageStackEntry } from '../types/public'
import type { ApplyParams, ApplyResult } from '../types/internal'
import { genId } from './id-allocator'
import { evictLeastRecentlyUsed } from '../utils/lru'
import { resolveComponentName } from '../router/name-resolver'
import { warn } from '../utils/warn'

// 拷贝路由快照，脱离 Vue Router 的 reactive 代理
function cloneRoute(route: RouteLocationNormalizedLoaded): RouteLocationNormalizedLoaded {
  return {
    name: route.name,
    path: route.path,
    fullPath: route.fullPath,
    hash: route.hash,
    query: { ...route.query },
    params: { ...route.params },
    meta: { ...route.meta },
    matched: [],
    redirectedFrom: undefined,
  } as RouteLocationNormalizedLoaded
}

// 创建栈条目
function createEntry(params: {
  to: RouteLocationNormalizedLoaded
  name: string
  position: number
  depth: number
  constCache: boolean
  tabKey: string | null
  channelId: string | null
  metadata: Readonly<Record<string, unknown>>
}): PageStackEntry {
  const now = Date.now()
  return {
    id: genId(),
    position: params.position,
    fullPath: params.to.fullPath,
    name: params.name,
    route: cloneRoute(params.to),
    constCache: params.constCache,
    tabKey: params.tabKey,
    depth: params.depth,
    createdAt: now,
    lastActiveAt: now,
    scrollPositions: new Map(),
    channelId: params.channelId,
    metadata: params.metadata,
  }
}

// 从 containerId 推断 depth（格式：keep:{depth}:{parentKey}:{viewName}）
function parseDepth(containerId: string): number {
  const parts = containerId.split(':')
  return parts.length >= 2 ? Number(parts[1]) || 0 : 0
}

// 解析 max 配置（支持按 depth 配置不同上限）
function resolveMax(max: number | Record<number, number>, depth: number): number {
  if (typeof max === 'number') return max
  return max[depth] ?? max[0] ?? 10
}

// 重新同步栈内位置索引
function normalizePositions(stack: PageStackEntry[]) {
  stack.forEach((entry, index) => {
    entry.position = index
  })
}

export function createStackManager(options: KeepOptionsResolved) {
  // 从 meta 中读取 setupNameResolver 写入的组件名，保证和 KeepAlive 匹配
  function resolveEntryName(to: RouteLocationNormalizedLoaded, depth: number): string {
    const metaNames = (to.meta as any).__keepComponentNames as Record<number, string> | undefined
    if (metaNames?.[depth]) return metaNames[depth]
    return resolveComponentName(undefined, to, depth) || `page_${genId()}`
  }

  // ---- Push 策略 ----
  function applyPush(stack: PageStackEntry[], params: ApplyParams): ApplyResult {
    const { to, hints, containerId } = params
    const depth = parseDepth(containerId)
    const removed: PageStackEntry[] = []

    const name = resolveEntryName(to, depth)

    // 解析缓存属性
    const constCache = hints.constCache ?? (to.meta as any).keep?.constCache ?? false
    const tabKey = hints.targetTabKey ?? (to.meta as any).keep?.tabKey ?? null
    const channelId = hints.channelId ?? null
    const metadata = hints.metadata ?? {}

    // 创建新条目
    const entry = createEntry({
      to,
      name,
      position: stack.length,
      depth,
      constCache,
      tabKey,
      channelId,
      metadata,
    })

    stack.push(entry)

    // LRU 淘汰
    const max = resolveMax(options.max, depth)
    const currentId = entry.id
    const evicted = evictLeastRecentlyUsed(stack, max, (e) => {
      if (e.constCache) return false
      if (e.id === currentId) return false
      if (options.onBeforeEvict && options.onBeforeEvict(e) === false) return false
      return true
    })

    if (evicted.length === 0 && stack.length > max) {
      warn(`栈深度超过 max(${max})，但所有候选条目都不可淘汰`)
    }

    removed.push(...evicted)

    return { added: [entry], removed, updated: [] }
  }

  // ---- Replace 策略 ----
  function applyReplace(stack: PageStackEntry[], params: ApplyParams): ApplyResult {
    const { to, hints, containerId } = params
    const depth = parseDepth(containerId)

    const name = resolveEntryName(to, depth)
    const constCache = hints.constCache ?? (to.meta as any).keep?.constCache ?? false
    const tabKey = hints.targetTabKey ?? (to.meta as any).keep?.tabKey ?? null
    const channelId = hints.channelId ?? null
    const metadata = hints.metadata ?? {}

    const oldTop = stack.length > 0 ? stack[stack.length - 1]! : null
    const position = oldTop ? oldTop.position : 0

    const entry = createEntry({
      to,
      name,
      position,
      depth,
      constCache,
      tabKey,
      channelId,
      metadata,
    })

    if (stack.length > 0) {
      stack[stack.length - 1] = entry
    } else {
      stack.push(entry)
    }

    return {
      added: [entry],
      removed: oldTop ? [oldTop] : [],
      updated: [],
    }
  }

  // ---- Back 策略 ----
  function applyBack(stack: PageStackEntry[], params: ApplyParams): ApplyResult {
    const count = Math.abs(params.delta) || 1

    if (count <= 0 || stack.length <= 1) {
      // 更新栈顶的 lastActiveAt
      if (stack.length > 0) {
        const top = stack[stack.length - 1]!
        top.lastActiveAt = Date.now()
        return { added: [], removed: [], updated: [top] }
      }
      return { added: [], removed: [], updated: [] }
    }

    // 优先按目标路由回退，处理 switchTab 使用 replace 后浏览器 delta 小于内部 tab 条目数的场景
    let targetIndex = -1
    for (let i = stack.length - 2; i >= 0; i--) {
      if (stack[i]!.fullPath === params.to.fullPath) {
        targetIndex = i
        break
      }
    }
    const actualCount =
      targetIndex >= 0 ? stack.length - 1 - targetIndex : Math.min(count, stack.length - 1)
    const removed = stack.splice(stack.length - actualCount, actualCount)
    normalizePositions(stack)

    // 更新新栈顶
    if (stack.length > 0) {
      const newTop = stack[stack.length - 1]!
      newTop.lastActiveAt = Date.now()
      return { added: [], removed, updated: [newTop] }
    }

    return { added: [], removed, updated: [] }
  }

  // ---- ReLaunch 策略 ----
  function applyReLaunch(stack: PageStackEntry[], params: ApplyParams): ApplyResult {
    const { to, hints, containerId } = params
    const depth = parseDepth(containerId)

    // 收集当前栈所有条目
    const removed = stack.splice(0, stack.length)

    const name = resolveEntryName(to, depth)
    const constCache = hints.constCache ?? (to.meta as any).keep?.constCache ?? false
    const metadata = hints.metadata ?? {}

    const entry = createEntry({
      to,
      name,
      position: 0,
      depth,
      constCache,
      tabKey: null,
      channelId: null,
      metadata,
    })

    stack.push(entry)

    return { added: [entry], removed, updated: [] }
  }

  // ---- SwitchTab 策略 ----
  function applySwitchTab(stack: PageStackEntry[], params: ApplyParams): ApplyResult {
    const { to, hints, containerId } = params
    const depth = parseDepth(containerId)

    const tabKey =
      hints.targetTabKey ??
      (to.meta as any).keep?.tabKey ??
      (typeof to.name === 'string' ? to.name : null) ??
      to.path

    // 查找已存在的 tab
    const existingIdx = stack.findIndex((e) => e.tabKey === tabKey)

    if (existingIdx !== -1) {
      const existing = stack[existingIdx]!
      existing.lastActiveAt = Date.now()
      existing.route = cloneRoute(to)
      existing.fullPath = to.fullPath
      if (existingIdx !== stack.length - 1) {
        stack.splice(existingIdx, 1)
        stack.push(existing)
        normalizePositions(stack)
      }
      return { added: [], removed: [], updated: [existing] }
    }

    // 创建新 tab 条目
    const name = resolveEntryName(to, depth)
    const constCache = hints.constCache ?? (to.meta as any).keep?.constCache ?? false
    const metadata = hints.metadata ?? {}

    const entry = createEntry({
      to,
      name,
      position: stack.length,
      depth,
      constCache,
      tabKey,
      channelId: null,
      metadata,
    })

    stack.push(entry)

    return { added: [entry], removed: [], updated: [] }
  }

  // ---- 主入口 ----
  function apply(stack: PageStackEntry[], params: ApplyParams): ApplyResult {
    switch (params.method) {
      case 'push':
        return applyPush(stack, params)
      case 'replace':
        return applyReplace(stack, params)
      case 'back':
        return applyBack(stack, params)
      case 'reLaunch':
        return applyReLaunch(stack, params)
      case 'switchTab':
        return applySwitchTab(stack, params)
    }
  }

  return { apply }
}
