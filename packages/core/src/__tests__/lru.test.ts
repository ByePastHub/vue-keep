import { describe, it, expect } from 'vitest'
import { evictLeastRecentlyUsed } from '../utils/lru'
import type { PageStackEntry } from '../types/public'

function mockEntry(id: string, lastActiveAt: number, constCache = false): PageStackEntry {
  return {
    id,
    position: 0,
    fullPath: `/${id}`,
    name: id,
    route: {} as any,
    constCache,
    tabKey: null,
    depth: 0,
    createdAt: lastActiveAt,
    lastActiveAt,
    scrollPositions: new Map(),
    channelId: null,
    metadata: {},
  }
}

describe('evictLeastRecentlyUsed', () => {
  it('栈未超限时不淘汰', () => {
    const stack = [mockEntry('a', 1), mockEntry('b', 2)]
    const evicted = evictLeastRecentlyUsed(stack, 3, () => true)
    expect(evicted).toEqual([])
    expect(stack.length).toBe(2)
  })

  it('淘汰最久未激活的条目', () => {
    const stack = [mockEntry('a', 1), mockEntry('b', 2), mockEntry('c', 3), mockEntry('d', 4)]
    const evicted = evictLeastRecentlyUsed(stack, 2, () => true)
    expect(evicted.length).toBe(2)
    expect(evicted[0]!.id).toBe('a')
    expect(evicted[1]!.id).toBe('b')
    expect(stack.length).toBe(2)
  })

  it('constCache 条目不被淘汰', () => {
    const stack = [
      mockEntry('a', 1, true), // constCache
      mockEntry('b', 2),
      mockEntry('c', 3),
      mockEntry('d', 4),
    ]
    const evicted = evictLeastRecentlyUsed(stack, 2, (e) => !e.constCache)
    expect(evicted.length).toBe(2)
    expect(evicted[0]!.id).toBe('b')
    expect(evicted[1]!.id).toBe('c')
    expect(stack.some((e) => e.id === 'a')).toBe(true)
  })

  it('当前激活条目不被淘汰', () => {
    const currentId = 'd'
    const stack = [mockEntry('a', 1), mockEntry('b', 2), mockEntry('c', 3), mockEntry('d', 4)]
    const evicted = evictLeastRecentlyUsed(stack, 2, (e) => e.id !== currentId)
    expect(evicted.length).toBe(2)
    expect(stack.some((e) => e.id === 'd')).toBe(true)
  })

  it('所有候选都不可淘汰时停止', () => {
    const stack = [mockEntry('a', 1, true), mockEntry('b', 2, true), mockEntry('c', 3, true)]
    const evicted = evictLeastRecentlyUsed(stack, 1, () => false)
    expect(evicted).toEqual([])
    expect(stack.length).toBe(3)
  })
})
