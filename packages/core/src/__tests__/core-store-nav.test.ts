import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCoreStore } from '../store/core-store'
import type { PageStackEntry } from '../types/public'
import type { StackManager, ApplyResult } from '../types/internal'

function mockEntry(overrides: Partial<PageStackEntry> = {}): PageStackEntry {
  return {
    id: overrides.id ?? 'entry-1',
    position: overrides.position ?? 0,
    fullPath: overrides.fullPath ?? '/test',
    name: overrides.name ?? 'test',
    route: overrides.route ?? ({} as any),
    constCache: overrides.constCache ?? false,
    tabKey: overrides.tabKey ?? null,
    depth: overrides.depth ?? 0,
    createdAt: overrides.createdAt ?? Date.now(),
    lastActiveAt: overrides.lastActiveAt ?? Date.now(),
    scrollPositions: overrides.scrollPositions ?? new Map(),
    channelId: overrides.channelId ?? null,
    metadata: overrides.metadata ?? {},
  }
}

function createMockStackManager(): StackManager {
  return {
    apply(stack, params): ApplyResult {
      const entry = mockEntry({
        id: `entry-${stack.length + 1}`,
        name: (params.to as any).name ?? 'page',
        fullPath: params.to.fullPath,
        route: params.to,
        position: stack.length,
      })
      stack.push(entry)
      return { added: [entry], removed: [], updated: [] }
    },
  }
}

const mockRoute = (name: string, path: string) =>
  ({
    name,
    fullPath: path,
    path,
    matched: [{ name, path }],
    meta: {},
    params: {},
    query: {},
    hash: '',
    redirectedFrom: undefined,
  }) as any

describe('CoreStore 导航', () => {
  let store: ReturnType<typeof createCoreStore>

  beforeEach(() => {
    store = createCoreStore()
    store.setStackManager(createMockStackManager())
  })

  describe('setPendingInfo / takePendingInfo', () => {
    it('设置后可取出', () => {
      const info = { type: 'pop' as const, direction: 'back' as const, delta: 1 }
      store.setPendingInfo(info)
      expect(store.takePendingInfo()).toEqual(info)
    })

    it('取出后为 null', () => {
      store.setPendingInfo({ type: 'pop' as const, direction: 'back' as const, delta: 1 })
      store.takePendingInfo()
      expect(store.takePendingInfo()).toBeNull()
    })
  })

  describe('prepareNavigation / commitNavigation', () => {
    it('提交导航后更新 lastNavigation', () => {
      const to = mockRoute('detail', '/detail')
      const from = mockRoute('home', '/home')

      store.prepareNavigation({
        containerId: 'c1',
        to,
        from,
        method: 'push',
        direction: 'forward',
        delta: 1,
        hints: {},
      })

      const result = store.commitNavigation()
      expect(result).not.toBeNull()
      expect(result!.added.length).toBe(1)
      expect(store.state.lastNavigation?.method).toBe('push')
      expect(store.state.lastNavigation?.direction).toBe('forward')
      expect(store.state.currentRoute).toBe(to)
    })

    it('commitNavigation 触发 onNavigationCommit', () => {
      const fn = vi.fn()
      store.onNavigationCommit(fn)

      store.prepareNavigation({
        containerId: 'c1',
        to: mockRoute('detail', '/detail'),
        from: mockRoute('home', '/home'),
        method: 'push',
        direction: 'forward',
        delta: 1,
        hints: {},
      })

      store.commitNavigation()
      expect(fn).toHaveBeenCalledTimes(1)
      expect(fn.mock.calls[0]![0].method).toBe('push')
    })

    it('无 preparedNavigation 时 commitNavigation 返回 null', () => {
      expect(store.commitNavigation()).toBeNull()
    })

    it('clearPreparedNavigation 清空暂存', () => {
      store.prepareNavigation({
        containerId: 'c1',
        to: mockRoute('detail', '/detail'),
        from: null,
        method: 'push',
        direction: 'forward',
        delta: 1,
        hints: {},
      })
      store.clearPreparedNavigation()
      expect(store.commitNavigation()).toBeNull()
    })
  })

  describe('initFirstEntry', () => {
    it('初始化首个条目', () => {
      store.initFirstEntry('c1', mockRoute('home', '/home'))
      expect(store.getStack('c1').length).toBe(1)
      expect(store.state.currentRoute?.name).toBe('home')
    })

    it('栈已有条目时不重复初始化', () => {
      store.initFirstEntry('c1', mockRoute('home', '/home'))
      store.initFirstEntry('c1', mockRoute('home', '/home'))
      expect(store.getStack('c1').length).toBe(1)
    })
  })

  describe('setReady', () => {
    it('设置 ready 为 true', () => {
      store.setReady()
      expect(store.state.ready).toBe(true)
    })

    it('触发 onStateChange', () => {
      const fn = vi.fn()
      store.onStateChange(fn)
      store.setReady()
      expect(fn).toHaveBeenCalled()
    })
  })
})

describe('CoreStore 守卫', () => {
  let store: ReturnType<typeof createCoreStore>

  beforeEach(() => {
    store = createCoreStore()
  })

  it('注册守卫并执行', async () => {
    store.addGuard(() => ({ cache: true }))
    const result = await store.runGuards(mockRoute('a', '/a'), mockRoute('b', '/b'), 'forward')
    expect(result.cache).toBe(true)
  })

  it('后注册的守卫覆盖前者', async () => {
    store.addGuard(() => ({ cache: true }))
    store.addGuard(() => ({ cache: false }))
    const result = await store.runGuards(mockRoute('a', '/a'), mockRoute('b', '/b'), 'forward')
    expect(result.cache).toBe(false)
  })

  it('取消注册后不再执行', async () => {
    const cancel = store.addGuard(() => ({ cache: false }))
    cancel()
    const result = await store.runGuards(mockRoute('a', '/a'), mockRoute('b', '/b'), 'forward')
    expect(result.cache).toBeUndefined()
  })

  it('支持异步守卫', async () => {
    store.addGuard(async () => {
      return { constCache: true }
    })
    const result = await store.runGuards(mockRoute('a', '/a'), mockRoute('b', '/b'), 'forward')
    expect(result.constCache).toBe(true)
  })
})

describe('CoreStore destroy', () => {
  let store: ReturnType<typeof createCoreStore>

  beforeEach(() => {
    store = createCoreStore()
    store.ensureStack('c1')
    const stack = store.state.stacks.get('c1')!
    stack.push(
      mockEntry({ id: 'e1', name: 'home' }),
      mockEntry({ id: 'e2', name: 'detail' }),
      mockEntry({ id: 'e3', name: 'profile' }),
    )
  })

  it('按 name 销毁', () => {
    store.destroy('detail')
    expect(store.getIncludeList('c1')).toEqual(['home', 'profile'])
  })

  it('按 name 数组批量销毁', () => {
    store.destroy(['detail', 'profile'])
    expect(store.getIncludeList('c1')).toEqual(['home'])
  })

  it('条件函数销毁', () => {
    store.destroy((entry) => entry.id === 'e2')
    expect(store.getIncludeList('c1')).toEqual(['home', 'profile'])
  })

  it('ALL 清空所有容器', () => {
    store.ensureStack('c2')
    store.state.stacks.get('c2')!.push(mockEntry({ id: 'e4', name: 'settings' }))
    store.destroy('ALL')
    expect(store.getIncludeList('c1')).toEqual([])
    expect(store.getIncludeList('c2')).toEqual([])
  })

  it('destroy 触发 onStateChange', () => {
    const fn = vi.fn()
    store.onStateChange(fn)
    store.destroy('detail')
    expect(fn).toHaveBeenCalled()
  })

  it('destroy 销毁关联的 channelId', () => {
    const destroyFn = vi.fn()
    store.setChannelRegistry({ destroy: destroyFn })
    store.state.stacks.get('c1')![1]!.channelId = 'ch-2'
    store.destroy('detail')
    expect(destroyFn).toHaveBeenCalledWith('ch-2')
  })
})

describe('CoreStore 事件订阅', () => {
  it('onStateChange 返回取消函数', () => {
    const store = createCoreStore()
    const fn = vi.fn()
    const cancel = store.onStateChange(fn)
    store.setReady()
    expect(fn).toHaveBeenCalledTimes(1)
    cancel()
    store.setReady()
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('onNavigationCommit 返回取消函数', () => {
    const store = createCoreStore()
    store.setStackManager(createMockStackManager())
    const fn = vi.fn()
    const cancel = store.onNavigationCommit(fn)

    store.prepareNavigation({
      containerId: 'c1',
      to: mockRoute('a', '/a'),
      from: null,
      method: 'push',
      direction: 'forward',
      delta: 1,
      hints: {},
    })
    store.commitNavigation()
    expect(fn).toHaveBeenCalledTimes(1)

    cancel()
    store.prepareNavigation({
      containerId: 'c1',
      to: mockRoute('b', '/b'),
      from: mockRoute('a', '/a'),
      method: 'push',
      direction: 'forward',
      delta: 1,
      hints: {},
    })
    store.commitNavigation()
    expect(fn).toHaveBeenCalledTimes(1)
  })
})
