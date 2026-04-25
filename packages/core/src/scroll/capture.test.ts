import { describe, it, expect, beforeEach } from 'vitest'
import { captureScrollPositions } from './capture'

describe('captureScrollPositions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('正确抓取 scrollTop 和 scrollLeft', () => {
    const div = document.createElement('div')
    div.setAttribute('data-scroll-container', 'test')
    Object.defineProperty(div, 'scrollTop', { value: 100, writable: true })
    Object.defineProperty(div, 'scrollLeft', { value: 50, writable: true })
    Object.defineProperty(div, 'scrollHeight', { value: 1000 })
    Object.defineProperty(div, 'scrollWidth', { value: 500 })
    Object.defineProperty(div, 'clientHeight', { value: 300 })
    Object.defineProperty(div, 'clientWidth', { value: 200 })

    const positions = captureScrollPositions([div])
    const pos = positions.get('test')
    expect(pos).toBeDefined()
    expect(pos!.top).toBe(100)
    expect(pos!.left).toBe(50)
    expect(pos!.scrollHeight).toBe(1000)
    expect(pos!.scrollWidth).toBe(500)
  })

  it('iOS 弹性滚动值被 clamp 到合法范围', () => {
    const div = document.createElement('div')
    div.setAttribute('data-scroll-container', 'bounce')
    Object.defineProperty(div, 'scrollTop', { value: -20, writable: true })
    Object.defineProperty(div, 'scrollLeft', { value: 999, writable: true })
    Object.defineProperty(div, 'scrollHeight', { value: 500 })
    Object.defineProperty(div, 'scrollWidth', { value: 300 })
    Object.defineProperty(div, 'clientHeight', { value: 300 })
    Object.defineProperty(div, 'clientWidth', { value: 200 })

    const positions = captureScrollPositions([div])
    const pos = positions.get('bounce')
    expect(pos!.top).toBe(0) // clamp 负值到 0
    expect(pos!.left).toBe(100) // clamp 到 scrollWidth - clientWidth
  })

  it('多个容器各自独立抓取', () => {
    const div1 = document.createElement('div')
    div1.setAttribute('data-scroll-container', 'a')
    Object.defineProperty(div1, 'scrollTop', { value: 10 })
    Object.defineProperty(div1, 'scrollLeft', { value: 0 })
    Object.defineProperty(div1, 'scrollHeight', { value: 500 })
    Object.defineProperty(div1, 'scrollWidth', { value: 300 })
    Object.defineProperty(div1, 'clientHeight', { value: 300 })
    Object.defineProperty(div1, 'clientWidth', { value: 300 })

    const div2 = document.createElement('div')
    div2.setAttribute('data-scroll-container', 'b')
    Object.defineProperty(div2, 'scrollTop', { value: 200 })
    Object.defineProperty(div2, 'scrollLeft', { value: 30 })
    Object.defineProperty(div2, 'scrollHeight', { value: 1000 })
    Object.defineProperty(div2, 'scrollWidth', { value: 600 })
    Object.defineProperty(div2, 'clientHeight', { value: 400 })
    Object.defineProperty(div2, 'clientWidth', { value: 300 })

    const positions = captureScrollPositions([div1, div2])
    expect(positions.size).toBe(2)
    expect(positions.get('a')!.top).toBe(10)
    expect(positions.get('b')!.top).toBe(200)
  })

  it('空容器列表返回空 Map', () => {
    const positions = captureScrollPositions([])
    expect(positions.size).toBe(0)
  })
})
