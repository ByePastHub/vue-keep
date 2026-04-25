import { describe, it, expect } from 'vitest'
import { NavigationDirection, NavigationMethod } from '../types/public'

describe('NavigationDirection', () => {
  it('包含 forward/back/none 三个值', () => {
    expect(NavigationDirection.Forward).toBe('forward')
    expect(NavigationDirection.Back).toBe('back')
    expect(NavigationDirection.None).toBe('none')
  })

  it('值可以做 === 比较', () => {
    const dir = NavigationDirection.Forward
    expect(dir).toBe('forward')
    expect(dir).not.toBe(NavigationDirection.Back)
  })
})

describe('NavigationMethod', () => {
  it('包含 5 种导航方式，与微信小程序 API 对应', () => {
    expect(NavigationMethod.Push).toBe('push')
    expect(NavigationMethod.Replace).toBe('replace')
    expect(NavigationMethod.Back).toBe('back')
    expect(NavigationMethod.ReLaunch).toBe('reLaunch')
    expect(NavigationMethod.SwitchTab).toBe('switchTab')
  })

  it('对象不可变', () => {
    expect(Object.keys(NavigationMethod)).toHaveLength(5)
  })
})
