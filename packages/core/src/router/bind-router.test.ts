import { beforeEach, describe, expect, it } from 'vitest'
import type { ScrollPosition } from '../types/public'
import { shouldSkipIOSNativeBackTransition, syncLeavingPageOffset } from './bind-router'

describe('syncLeavingPageOffset', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('style')
  })

  it('同步离开页滚动偏移和固定元素反向补偿', () => {
    const positions = new Map<string, ScrollPosition>([['__document__', { top: 120, left: 8 }]])

    syncLeavingPageOffset(positions)

    const style = document.documentElement.style
    expect(style.getPropertyValue('--vue-keep-leave-top')).toBe('-120px')
    expect(style.getPropertyValue('--vue-keep-leave-left')).toBe('-8px')
    expect(style.getPropertyValue('--vue-keep-fixed-offset-y')).toBe('120px')
    expect(style.getPropertyValue('--vue-keep-fixed-offset-x')).toBe('8px')
  })

  it('返回已滚动页面时按目标滚动位补偿离开页位置', () => {
    const leavingPositions = new Map<string, ScrollPosition>([
      ['__document__', { top: 0, left: 0 }],
    ])
    const targetPositions = new Map<string, ScrollPosition>([
      ['__document__', { top: 860, left: 12 }],
    ])

    syncLeavingPageOffset(leavingPositions, targetPositions)

    const style = document.documentElement.style
    expect(style.getPropertyValue('--vue-keep-leave-top')).toBe('860px')
    expect(style.getPropertyValue('--vue-keep-leave-left')).toBe('12px')
    expect(style.getPropertyValue('--vue-keep-fixed-offset-y')).toBe('0px')
    expect(style.getPropertyValue('--vue-keep-fixed-offset-x')).toBe('0px')
  })

  it('缺少文档滚动位置时写入零值补偿', () => {
    syncLeavingPageOffset(new Map())

    const style = document.documentElement.style
    expect(style.getPropertyValue('--vue-keep-leave-top')).toBe('0px')
    expect(style.getPropertyValue('--vue-keep-leave-left')).toBe('0px')
    expect(style.getPropertyValue('--vue-keep-fixed-offset-y')).toBe('0px')
    expect(style.getPropertyValue('--vue-keep-fixed-offset-x')).toBe('0px')
  })
})

describe('shouldSkipIOSNativeBackTransition', () => {
  it('iOS Safari 原生返回时跳过 vue-keep 返回动画', () => {
    const nav = {
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Safari/604.1',
      platform: 'iPhone',
      maxTouchPoints: 5,
    }

    expect(
      shouldSkipIOSNativeBackTransition(null, { type: 'pop', direction: 'back', delta: -1 }, nav),
    ).toBe(true)
  })

  it('iOS 微信内置浏览器原生返回时保留 vue-keep 返回动画', () => {
    const nav = {
      userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 MicroMessenger/8.0.47',
      platform: 'iPhone',
      maxTouchPoints: 5,
    }

    expect(
      shouldSkipIOSNativeBackTransition(null, { type: 'pop', direction: 'back', delta: -1 }, nav),
    ).toBe(false)
  })
})
