import { describe, it, expect } from 'vitest'
import { resolveTabKey } from '../utils/tab-key'
import type { RouteLocationNormalized } from 'vue-router'

function mockRoute(opts: {
  tabKey?: string
  topName?: string
  topPath?: string
}): RouteLocationNormalized {
  return {
    meta: opts.tabKey ? { keep: { tabKey: opts.tabKey } } : {},
    matched: [
      {
        name: opts.topName,
        path: opts.topPath ?? '/',
      },
    ],
  } as unknown as RouteLocationNormalized
}

describe('resolveTabKey', () => {
  it('优先使用 meta.keep.tabKey', () => {
    expect(resolveTabKey(mockRoute({ tabKey: 'my-tab', topName: 'home' }))).toBe('my-tab')
  })

  it('其次使用顶层路由 name', () => {
    expect(resolveTabKey(mockRoute({ topName: 'home' }))).toBe('home')
  })

  it('最后使用顶层路由 path', () => {
    expect(resolveTabKey(mockRoute({ topPath: '/home' }))).toBe('/home')
  })

  it('没有 matched 返回 null', () => {
    const route = { meta: {}, matched: [] } as unknown as RouteLocationNormalized
    expect(resolveTabKey(route)).toBeNull()
  })
})
