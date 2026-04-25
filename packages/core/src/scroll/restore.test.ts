import { describe, it, expect, vi, beforeEach } from 'vitest'
import { restoreScrollPositions } from './restore'
import type { ScrollPosition } from '../types/public'

describe('restoreScrollPositions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('立即恢复滚动位置，避免返回时先闪到顶部', async () => {
    const div = document.createElement('div')
    div.setAttribute('data-scroll-container', 'test')
    document.body.appendChild(div)

    const positions = new Map<string, ScrollPosition>([['test', { top: 100, left: 0 }]])

    const promise = restoreScrollPositions([div], positions, { timeout: 50 })
    expect(div.scrollTop).toBe(100)
    await promise
  })

  it('恢复文档滚动前预留高度，避免切回缓存页时被夹到顶部', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {})
    const scrollingElement = document.scrollingElement || document.documentElement
    const positions = new Map<string, ScrollPosition>([
      ['__document__', { top: 1200, left: 0, scrollHeight: 2200 }],
    ])

    const promise = restoreScrollPositions([scrollingElement], positions, { timeout: 10 })

    expect(document.querySelector('[data-vue-keep-scroll-placeholder]')).not.toBeNull()
    expect(scrollTo).toHaveBeenCalledWith({ top: 1200, left: 0, behavior: 'auto' })

    await promise

    expect(document.querySelector('[data-vue-keep-scroll-placeholder]')).toBeNull()
  })

  it('空 positions 不报错', async () => {
    const div = document.createElement('div')
    div.setAttribute('data-scroll-container', 'test')
    document.body.appendChild(div)

    const positions = new Map<string, ScrollPosition>()
    await expect(restoreScrollPositions([div], positions, { timeout: 50 })).resolves.toBeUndefined()
  })

  it('超时后完成', async () => {
    const div = document.createElement('div')
    div.setAttribute('data-scroll-container', 'test')
    document.body.appendChild(div)

    const positions = new Map<string, ScrollPosition>([['test', { top: 50, left: 0 }]])

    await restoreScrollPositions([div], positions, { timeout: 10 })
    expect(div.scrollTop).toBe(50)
  })
})
