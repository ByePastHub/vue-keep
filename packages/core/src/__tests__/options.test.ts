import { describe, it, expect } from 'vitest'
import type { Router } from 'vue-router'
import { resolveOptions } from '../utils/options'

const mockRouter = {} as Router

describe('resolveOptions', () => {
  it('只传 router 时填充所有默认值', () => {
    const resolved = resolveOptions({ router: mockRouter })

    expect(resolved.router).toBe(mockRouter)
    expect(resolved.max).toBe(10)
    expect(resolved.exclude).toBeUndefined()
    expect(resolved.include).toBeUndefined()
    expect(resolved.scrollBehavior).toBe('auto')
    expect(resolved.persist).toBe(true)
    expect(resolved.transition).toBe('slide')
    expect(resolved.namespace).toBe('[vue-keep]')
    expect(resolved.disableFirstTransition).toBe(true)
    expect(resolved.onBeforeEvict).toBeUndefined()
  })

  it('用户传入的值覆盖默认值', () => {
    const evictFn = () => true
    const resolved = resolveOptions({
      router: mockRouter,
      max: 20,
      scrollBehavior: 'none',
      persist: false,
      transition: 'fade',
      namespace: '[my-app]',
      disableFirstTransition: false,
      onBeforeEvict: evictFn,
    })

    expect(resolved.max).toBe(20)
    expect(resolved.scrollBehavior).toBe('none')
    expect(resolved.persist).toBe(false)
    expect(resolved.transition).toBe('fade')
    expect(resolved.namespace).toBe('[my-app]')
    expect(resolved.disableFirstTransition).toBe(false)
    expect(resolved.onBeforeEvict).toBe(evictFn)
  })

  it('transition 可以设为 false 关闭动画', () => {
    const resolved = resolveOptions({ router: mockRouter, transition: false })
    expect(resolved.transition).toBe(false)
  })

  it('max 支持按 depth 配置', () => {
    const resolved = resolveOptions({ router: mockRouter, max: { 0: 5, 1: 10 } })
    expect(resolved.max).toEqual({ 0: 5, 1: 10 })
  })
})
