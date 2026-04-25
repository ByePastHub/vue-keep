import { describe, it, expect } from 'vitest'
import { createKeepScrollBehavior } from '../scroll/keep-scroll-behavior'
import type { NavigationDirection } from '../types/public'
import type { RouteLocationNormalized } from 'vue-router'

const mockRoute = {} as RouteLocationNormalized

describe('createKeepScrollBehavior', () => {
  it('返回时返回 false（交给 vue-keep 处理）', () => {
    const direction: NavigationDirection = 'back'
    const behavior = createKeepScrollBehavior(() => direction)

    const result = behavior(mockRoute, mockRoute, null)
    expect(result).toBe(false)
  })

  it('前进时默认滚动到顶部', () => {
    const direction: NavigationDirection = 'forward'
    const behavior = createKeepScrollBehavior(() => direction)

    const result = behavior(mockRoute, mockRoute, null)
    expect(result).toEqual({ top: 0 })
  })

  it('前进时使用 fallback', () => {
    const direction: NavigationDirection = 'forward'
    const fallback = () => ({ top: 100, left: 0 })
    const behavior = createKeepScrollBehavior(() => direction, fallback)

    const result = behavior(mockRoute, mockRoute, null)
    expect(result).toEqual({ top: 100, left: 0 })
  })

  it('none 方向使用 fallback 或默认行为', () => {
    const direction: NavigationDirection = 'none'
    const behavior = createKeepScrollBehavior(() => direction)

    const result = behavior(mockRoute, mockRoute, null)
    expect(result).toEqual({ top: 0 })
  })
})
