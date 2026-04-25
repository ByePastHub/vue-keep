import type { PageStackEntry } from '../types/public'

// LRU 淘汰：从栈中移除最久未激活的条目，直到栈长度 <= max
export function evictLeastRecentlyUsed(
  stack: PageStackEntry[],
  max: number,
  canEvict: (entry: PageStackEntry) => boolean,
): PageStackEntry[] {
  if (stack.length <= max) return []

  const evicted: PageStackEntry[] = []

  while (stack.length > max) {
    // 找到最久未激活的可淘汰条目
    let oldestIdx = -1
    let oldestTime = Infinity

    for (let i = 0; i < stack.length; i++) {
      const entry = stack[i]!
      if (canEvict(entry) && entry.lastActiveAt < oldestTime) {
        oldestTime = entry.lastActiveAt
        oldestIdx = i
      }
    }

    if (oldestIdx === -1) break // 没有可淘汰的候选

    evicted.push(stack[oldestIdx]!)
    stack.splice(oldestIdx, 1)
  }

  return evicted
}
