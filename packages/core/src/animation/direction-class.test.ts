import { describe, it, expect } from 'vitest'
import { resolveTransitionName, resolveTransitionProps } from './direction-class'

describe('resolveTransitionName', () => {
  it('预设字符串 slide + forward → keep-slide-left', () => {
    expect(resolveTransitionName('slide', 'forward')).toBe('keep-slide-left')
  })

  it('预设字符串 slide + back → keep-slide-right', () => {
    expect(resolveTransitionName('slide', 'back')).toBe('keep-slide-right')
  })

  it('预设字符串 slide + none → undefined', () => {
    expect(resolveTransitionName('slide', 'none')).toBeUndefined()
  })

  it('false → undefined', () => {
    expect(resolveTransitionName(false, 'forward')).toBeUndefined()
  })

  it('自定义 name 函数', () => {
    const config = { name: (d: string) => `custom-${d}` }
    expect(resolveTransitionName(config, 'back')).toBe('custom-back')
  })

  it('自定义 name 字符串', () => {
    const config = { name: 'my-transition' }
    expect(resolveTransitionName(config, 'forward')).toBe('my-transition')
  })

  it('空对象 → undefined', () => {
    expect(resolveTransitionName({}, 'forward')).toBeUndefined()
  })
})

describe('resolveTransitionProps', () => {
  it('false → null', () => {
    expect(resolveTransitionProps(false, 'forward')).toBeNull()
  })

  it('预设返回 name', () => {
    const props = resolveTransitionProps('fade', 'forward')
    expect(props).toEqual({ name: 'keep-fade' })
  })

  it('none 方向返回 null', () => {
    expect(resolveTransitionProps('slide', 'none')).toBeNull()
  })

  it('自定义配置包含 mode 和 duration', () => {
    const config = {
      name: 'custom',
      mode: 'out-in' as const,
      duration: 300,
    }
    const props = resolveTransitionProps(config, 'forward')
    expect(props).toEqual({ name: 'custom', mode: 'out-in', duration: 300 })
  })

  it('自定义配置包含 appear', () => {
    const config = { name: 'custom', appear: true }
    const props = resolveTransitionProps(config, 'forward')
    expect(props).toEqual({ name: 'custom', appear: true })
  })
})
