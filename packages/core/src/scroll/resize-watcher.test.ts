import { describe, it, expect, vi, beforeEach } from 'vitest'
import { applyPositions } from './resize-watcher'
import type { ScrollPosition } from '../types/public'

describe('applyPositions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('恢复普通元素的滚动位置', () => {
    const div = document.createElement('div')
    div.setAttribute('data-scroll-container', 'test')
    document.body.appendChild(div)

    const positions = new Map<string, ScrollPosition>([['test', { top: 150, left: 30 }]])

    applyPositions([div], positions)
    expect(div.scrollTop).toBe(150)
    expect(div.scrollLeft).toBe(30)
  })

  it('主滚动容器使用 window.scrollTo', () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const el = document.scrollingElement || document.documentElement

    const positions = new Map<string, ScrollPosition>([['__document__', { top: 200, left: 0 }]])

    applyPositions([el], positions)
    expect(scrollTo).toHaveBeenCalledWith({
      top: 200,
      left: 0,
      behavior: 'auto',
    })
    scrollTo.mockRestore()
  })

  it('没有匹配的 position 时跳过', () => {
    const div = document.createElement('div')
    div.setAttribute('data-scroll-container', 'test')
    document.body.appendChild(div)

    const positions = new Map<string, ScrollPosition>()
    applyPositions([div], positions)
    expect(div.scrollTop).toBe(0)
  })
})
