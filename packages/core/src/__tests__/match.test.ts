import { describe, it, expect } from 'vitest'
import type { RouteLocationNormalized } from 'vue-router'
import { matchName } from '../utils/match'

// 构造最小路由对象用于测试
const mockRoute = { name: 'test', path: '/test', fullPath: '/test' } as RouteLocationNormalized

describe('matchName', () => {
  it('字符串精确匹配', () => {
    expect(matchName('home', 'home', mockRoute)).toBe(true)
    expect(matchName('home', 'about', mockRoute)).toBe(false)
  })

  it('正则匹配', () => {
    expect(matchName(/^detail/, 'detail-123', mockRoute)).toBe(true)
    expect(matchName(/^detail/, 'home', mockRoute)).toBe(false)
  })

  it('数组匹配（字符串 + 正则混合）', () => {
    const matcher = ['home', /^detail/]
    expect(matchName(matcher, 'home', mockRoute)).toBe(true)
    expect(matchName(matcher, 'detail-456', mockRoute)).toBe(true)
    expect(matchName(matcher, 'about', mockRoute)).toBe(false)
  })

  it('函数匹配', () => {
    const matcher = (name: string) => name.startsWith('order')
    expect(matchName(matcher, 'orderList', mockRoute)).toBe(true)
    expect(matchName(matcher, 'home', mockRoute)).toBe(false)
  })

  it('函数匹配可以访问 route 参数', () => {
    const matcher = (_name: string, route: RouteLocationNormalized) => route.path === '/test'
    expect(matchName(matcher, 'any', mockRoute)).toBe(true)
    expect(
      matchName(matcher, 'any', { ...mockRoute, path: '/other' } as RouteLocationNormalized),
    ).toBe(false)
  })
})
