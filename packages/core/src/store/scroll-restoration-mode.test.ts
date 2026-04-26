import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  disableNativeScrollRestoration,
  isIOSWebKitBrowser,
  isWeChatBrowser,
  isReloadNavigation,
  resolveNativeScrollRestorationMode,
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

  it('识别 iPhone WebKit 浏览器', () => {
    const nav = {
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1',
      platform: 'iPhone',
      maxTouchPoints: 5,
    }

    expect(isIOSWebKitBrowser(nav)).toBe(true)
  })

  it('识别微信内置浏览器', () => {
    const nav = {
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 MicroMessenger/8.0.47',
      platform: 'iPhone',
      maxTouchPoints: 5,
    }

    expect(isWeChatBrowser(nav)).toBe(true)
  })

  it('iPadOS 桌面模式下保留原生滚动恢复', () => {
    const nav = {
      userAgent:
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) AppleWebKit/605.1.15 Safari/605.1.15',
      platform: 'MacIntel',
      maxTouchPoints: 5,
    }

    expect(resolveNativeScrollRestorationMode(nav)).toBe('auto')
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
