import { describe, it, expect } from 'vitest'
import { createKeepScrollBehavior } from './keep-scroll-behavior'
import type { NavigationDirection } from '../types/public'

describe('createKeepScrollBehavior', () => {
  it('back 方向返回 false（交给 vue-keep 恢复）', () => {
    const dir: NavigationDirection = 'back'
    const scrollBehavior = createKeepScrollBehavior(() => dir)
    const result = scrollBehavior({} as any, {} as any, null)
    expect(result).toBe(false)
  })

  it('switchTab 方法返回 false，完全交给 vue-keep 恢复', () => {
    const dir: NavigationDirection = 'none'
    const scrollBehavior = createKeepScrollBehavior(
      () => dir,
      undefined,
      () => 'switchTab',
    )
    const result = scrollBehavior({} as any, {} as any, null)
    expect(result).toBe(false)
  })

  it('forward 方向使用 fallback', () => {
    const dir: NavigationDirection = 'forward'
    const fallback = () => ({ top: 42 })
    const scrollBehavior = createKeepScrollBehavior(() => dir, fallback)
    const result = scrollBehavior({} as any, {} as any, null)
    expect(result).toEqual({ top: 42 })
  })

  it('forward 方向无 fallback 时返回 { top: 0 }', () => {
    const dir: NavigationDirection = 'forward'
    const scrollBehavior = createKeepScrollBehavior(() => dir)
    const result = scrollBehavior({} as any, {} as any, null)
    expect(result).toEqual({ top: 0 })
  })

  it('none 方向无 fallback 无 savedPosition 时返回 { top: 0 }', () => {
    const dir: NavigationDirection = 'none'
    const scrollBehavior = createKeepScrollBehavior(() => dir)
    const result = scrollBehavior({} as any, {} as any, null)
    expect(result).toEqual({ top: 0 })
  })
})
