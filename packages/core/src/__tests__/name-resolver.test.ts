import { describe, it, expect } from 'vitest'
import { resolveComponentName, ensureComponentName } from '../utils/name-resolver'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

function mockRoute(
  depth: number,
  component: any,
  routeName?: string,
  path?: string,
): RouteLocationNormalizedLoaded {
  const matched = Array.from({ length: depth + 1 }, (_, i) => ({
    name: i === depth ? routeName : undefined,
    path: i === depth ? (path ?? '/test') : '/',
    components: i === depth ? { default: component } : {},
  }))
  return { matched } as unknown as RouteLocationNormalizedLoaded
}

describe('resolveComponentName', () => {
  it('优先使用组件自身的 name', () => {
    const name = resolveComponentName(mockRoute(0, { name: 'MyPage' }), 0)
    expect(name).toBe('MyPage')
  })

  it('组件没有 name 时使用路由 name', () => {
    const name = resolveComponentName(mockRoute(0, {}, 'detail'), 0)
    expect(name).toBe('detail')
  })

  it('都没有时基于路径生成名称', () => {
    const name = resolveComponentName(mockRoute(0, {}, undefined, '/order'), 0)
    expect(name).toMatch(/^__vue_keep_/)
  })

  it('没有匹配的 matched 返回空字符串', () => {
    const route = { matched: [] } as unknown as RouteLocationNormalizedLoaded
    expect(resolveComponentName(route, 0)).toBe('')
  })
})

describe('ensureComponentName', () => {
  it('给没有 name 的组件注入 name', () => {
    const comp = {} as any
    ensureComponentName(comp, 'injected')
    expect(comp.name).toBe('injected')
  })

  it('不覆盖已有的 name', () => {
    const comp = { name: 'existing' } as any
    ensureComponentName(comp, 'injected')
    expect(comp.name).toBe('existing')
  })

  it('null/undefined 组件不报错', () => {
    expect(() => ensureComponentName(null, 'test')).not.toThrow()
    expect(() => ensureComponentName(undefined, 'test')).not.toThrow()
  })
})
