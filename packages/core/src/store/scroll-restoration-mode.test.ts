import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  disableNativeScrollRestoration,
  isReloadNavigation,
  resetScrollOnReload,
} from './scroll-restoration-mode'

describe('scroll-restoration-mode', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('禁用浏览器原生滚动恢复', () => {
    disableNativeScrollRestoration()

    expect(history.scrollRestoration).toBe('manual')
  })

  it('识别刷新导航', () => {
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ])

    expect(isReloadNavigation()).toBe(true)
  })

  it('刷新导航时重置到顶部', () => {
    vi.spyOn(performance, 'getEntriesByType').mockReturnValue([
      { type: 'reload' } as PerformanceNavigationTiming,
    ])
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})

    resetScrollOnReload()

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0, behavior: 'auto' })
  })
})
