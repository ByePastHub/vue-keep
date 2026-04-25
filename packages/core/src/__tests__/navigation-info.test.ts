import { describe, it, expect } from 'vitest'
import { resolveNavigation } from '../router/navigation-info'
import type { NavigationIntent, NavigationInfo } from '../types/internal'

function makeIntent(method: string, delta = 0): NavigationIntent {
  return { method: method as any, delta, sentAt: Date.now() }
}

function makeInfo(type: 'pop' | 'push', direction: string, delta = 1): NavigationInfo {
  return { type, direction: direction as any, delta }
}

describe('resolveNavigation', () => {
  it('intent=push + info=push/forward → Push/forward', () => {
    const result = resolveNavigation(makeIntent('push', 1), makeInfo('push', 'forward'))
    expect(result.method).toBe('push')
    expect(result.direction).toBe('forward')
  })

  it('intent=replace → Replace/none', () => {
    const result = resolveNavigation(makeIntent('replace'), makeInfo('push', 'unknown', 0))
    expect(result.method).toBe('replace')
    expect(result.direction).toBe('none')
  })

  it('intent=back → Back/back', () => {
    const result = resolveNavigation(makeIntent('back', -1), null)
    expect(result.method).toBe('back')
    expect(result.direction).toBe('back')
    expect(result.delta).toBe(-1)
  })

  it('intent=reLaunch → ReLaunch/none', () => {
    const result = resolveNavigation(makeIntent('reLaunch'), makeInfo('push', 'unknown', 0))
    expect(result.method).toBe('reLaunch')
    expect(result.direction).toBe('none')
  })

  it('intent=switchTab → SwitchTab/none', () => {
    const result = resolveNavigation(makeIntent('switchTab'), makeInfo('push', 'unknown', 0))
    expect(result.method).toBe('switchTab')
    expect(result.direction).toBe('none')
  })

  it('无 intent + pop/back → Back/back', () => {
    const result = resolveNavigation(null, makeInfo('pop', 'back', 1))
    expect(result.method).toBe('back')
    expect(result.direction).toBe('back')
  })

  it('无 intent + pop/forward → Push/forward', () => {
    const result = resolveNavigation(null, makeInfo('pop', 'forward', 1))
    expect(result.method).toBe('push')
    expect(result.direction).toBe('forward')
  })

  it('无 intent 无 info（初始化） → Push/none', () => {
    const result = resolveNavigation(null, null)
    expect(result.method).toBe('push')
    expect(result.direction).toBe('none')
    expect(result.delta).toBe(0)
  })
})
