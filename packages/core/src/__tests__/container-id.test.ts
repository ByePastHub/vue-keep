import { describe, it, expect } from 'vitest'
import { resolveContainerId } from '../utils/container-id'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

function mockRoute(matched: Array<{ name?: string; path: string }>): RouteLocationNormalizedLoaded {
  return { matched } as unknown as RouteLocationNormalizedLoaded
}

describe('resolveContainerId', () => {
  it('顶层容器生成 keep:0:root:${viewName}', () => {
    const id = resolveContainerId({
      depth: 0,
      route: mockRoute([{ path: '/' }]),
      viewName: 'default',
    })
    expect(id).toBe('keep:0:root:default')
  })

  it('子层容器使用父路由 name', () => {
    const id = resolveContainerId({
      depth: 1,
      route: mockRoute([{ name: 'home', path: '/home' }, { path: '/home/list' }]),
      viewName: 'default',
    })
    expect(id).toBe('keep:1:home:default')
  })

  it('父路由没有 name 时使用 path', () => {
    const id = resolveContainerId({
      depth: 1,
      route: mockRoute([{ path: '/tabs' }, { path: '/tabs/list' }]),
      viewName: 'default',
    })
    expect(id).toBe('keep:1:/tabs:default')
  })

  it('不同 tab 下同 depth 的容器 ID 不同', () => {
    const idA = resolveContainerId({
      depth: 1,
      route: mockRoute([{ name: 'tabA', path: '/a' }, { path: '/a/sub' }]),
      viewName: 'default',
    })
    const idB = resolveContainerId({
      depth: 1,
      route: mockRoute([{ name: 'tabB', path: '/b' }, { path: '/b/sub' }]),
      viewName: 'default',
    })
    expect(idA).not.toBe(idB)
  })
})
