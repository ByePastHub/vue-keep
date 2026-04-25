import { describe, it, expect } from 'vitest'
import { ContainerResolver } from '../router/container-resolver'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

function mockRoute(matchedLength: number): RouteLocationNormalizedLoaded {
  return {
    matched: Array.from({ length: matchedLength }, (_, i) => ({
      path: `/level-${i}`,
      components: {},
    })),
  } as unknown as RouteLocationNormalizedLoaded
}

describe('ContainerResolver', () => {
  it('注册和获取容器', () => {
    const resolver = new ContainerResolver()
    resolver.register('c1', 0)

    expect(resolver.get('c1')).toEqual({ containerId: 'c1', depth: 0 })
    expect(resolver.size).toBe(1)
  })

  it('注销容器', () => {
    const resolver = new ContainerResolver()
    resolver.register('c1', 0)
    resolver.unregister('c1')

    expect(resolver.get('c1')).toBeNull()
    expect(resolver.size).toBe(0)
  })

  it('根据路由 matched 深度解析容器', () => {
    const resolver = new ContainerResolver()
    resolver.register('root', 0)
    resolver.register('nested', 1)

    // matched 长度 1 → depth 0
    expect(resolver.resolve(mockRoute(1))?.containerId).toBe('root')
    // matched 长度 2 → depth 1
    expect(resolver.resolve(mockRoute(2))?.containerId).toBe('nested')
  })

  it('没有匹配的容器返回 null', () => {
    const resolver = new ContainerResolver()
    resolver.register('root', 0)

    expect(resolver.resolve(mockRoute(3))).toBeNull()
  })

  it('getAll 返回所有容器', () => {
    const resolver = new ContainerResolver()
    resolver.register('a', 0)
    resolver.register('b', 1)

    const all = resolver.getAll()
    expect(all).toHaveLength(2)
    expect(all.map((c) => c.containerId).sort()).toEqual(['a', 'b'])
  })
})
