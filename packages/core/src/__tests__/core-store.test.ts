import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createCoreStore } from '../store/core-store'
import type { PageStackEntry } from '../types/public'
import type { StackManager, ApplyResult } from '../types/internal'

// 创建 mock 栈条目
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

// 创建 mock StackManager
function createMockStackManager(): StackManager {
  return {
    apply(stack, params): ApplyResult {
      const entry = mockEntry({
        id: `entry-${stack.length + 1}`,
        name: (params.to as any).name ?? 'page',
        fullPath: params.to.fullPath,
        route: params.to,
        depth: 0,
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

describe('createCoreStore', () => {
  let store: ReturnType<typeof createCoreStore>

  beforeEach(() => {
    store = createCoreStore()
  })

  describe('初始状态', () => {
    it('stacks 为空 Map', () => {
      expect(store.state.stacks.size).toBe(0)
    })

    it('currentRoute 为 null', () => {
      expect(store.state.currentRoute).toBeNull()
    })

    it('lastNavigation 为 null', () => {
      expect(store.state.lastNavigation).toBeNull()
    })

    it('ready 为 false', () => {
      expect(store.state.ready).toBe(false)
    })
  })

  describe('ensureStack / getStack / destroyStack', () => {
    it('ensureStack 创建空栈', () => {
      store.ensureStack('c1')
      expect(store.getStack('c1')).toEqual([])
    })

    it('ensureStack 重复调用不覆盖', () => {
      store.setStackManager(createMockStackManager())
      store.ensureStack('c1')
      store.initFirstEntry('c1', mockRoute('home', '/home'))
      store.ensureStack('c1')
      expect(store.getStack('c1').length).toBe(1)
    })

    it('destroyStack 移除容器', () => {
      store.ensureStack('c1')
      store.destroyStack('c1')
      expect(store.getStack('c1')).toEqual([])
      expect(store.state.stacks.has('c1')).toBe(false)
    })

    it('destroyStack 触发 onStateChange', () => {
      const fn = vi.fn()
      store.onStateChange(fn)
      store.ensureStack('c1')
      store.destroyStack('c1')
      expect(fn).toHaveBeenCalled()
    })

    it('destroyStack 销毁关联的 channelId', () => {
      const destroyFn = vi.fn()
      store.setChannelRegistry({ destroy: destroyFn })
      store.ensureStack('c1')
      const stack = store.state.stacks.get('c1')!
      stack.push(mockEntry({ channelId: 'ch-1' }))
      store.destroyStack('c1')
      expect(destroyFn).toHaveBeenCalledWith('ch-1')
    })
  })

  describe('getIncludeList', () => {
    it('返回栈中所有条目的 name', () => {
      store.ensureStack('c1')
      const stack = store.state.stacks.get('c1')!
      stack.push(mockEntry({ name: 'home' }))
      stack.push(mockEntry({ name: 'detail', id: 'e2' }))
      expect(store.getIncludeList('c1')).toEqual(['home', 'detail'])
    })

    it('不存在的容器返回空数组', () => {
      expect(store.getIncludeList('none')).toEqual([])
    })
  })

  describe('getEntry / getCurrentEntry', () => {
    it('getEntry 按 id 查找', () => {
      store.ensureStack('c1')
      const stack = store.state.stacks.get('c1')!
      const entry = mockEntry({ id: 'e1', name: 'home' })
      stack.push(entry)
      expect(store.getEntry('c1', 'e1')).toBe(entry)
    })

    it('getEntry 找不到返回 undefined', () => {
      store.ensureStack('c1')
      expect(store.getEntry('c1', 'nope')).toBeUndefined()
    })

    it('getCurrentEntry 返回栈顶', () => {
      store.ensureStack('c1')
      const stack = store.state.stacks.get('c1')!
      stack.push(mockEntry({ id: 'e1' }))
      stack.push(mockEntry({ id: 'e2' }))
      expect(store.getCurrentEntry('c1')?.id).toBe('e2')
    })

    it('getCurrentEntry 空栈返回 undefined', () => {
      store.ensureStack('c1')
      expect(store.getCurrentEntry('c1')).toBeUndefined()
    })
  })

  describe('ensureInStack', () => {
    it('条目不存在时添加', () => {
      store.ensureStack('c1')
      const entry = mockEntry({ id: 'e1' })
      store.ensureInStack('c1', entry)
      expect(store.getStack('c1').length).toBe(1)
    })

    it('条目已存在时 no-op', () => {
      store.ensureStack('c1')
      const entry = mockEntry({ id: 'e1' })
      store.ensureInStack('c1', entry)
      store.ensureInStack('c1', entry)
      expect(store.getStack('c1').length).toBe(1)
    })
  })

  describe('updateEntry', () => {
    it('更新条目字段', () => {
      store.ensureStack('c1')
      const stack = store.state.stacks.get('c1')!
      stack.push(mockEntry({ id: 'e1', name: 'home' }))
      const updated = store.updateEntry('c1', 'e1', { name: 'home-v2' })
      expect(updated?.name).toBe('home-v2')
    })

    it('更新后触发 onStateChange', () => {
      const fn = vi.fn()
      store.onStateChange(fn)
      store.ensureStack('c1')
      store.state.stacks.get('c1')!.push(mockEntry({ id: 'e1' }))
      store.updateEntry('c1', 'e1', { name: 'updated' })
      expect(fn).toHaveBeenCalled()
    })

    it('不存在的条目返回 undefined', () => {
      store.ensureStack('c1')
      expect(store.updateEntry('c1', 'nope', { name: 'x' })).toBeUndefined()
    })
  })
})
