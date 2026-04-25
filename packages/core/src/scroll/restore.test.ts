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

  it('快速连续切换时，新的恢复不会被上一次残留的兜底逻辑覆盖', async () => {
    const div = document.createElement('div')
    div.setAttribute('data-scroll-container', 'test')
    document.body.appendChild(div)

    const oldPositions = new Map<string, ScrollPosition>([['test', { top: 0, left: 0 }]])
    const newPositions = new Map<string, ScrollPosition>([['test', { top: 200, left: 0 }]])

    // 模拟「Tab 切到 Home（restore 还没跑完）→ 又切到 Explore」的场景
    const oldPromise = restoreScrollPositions([div], oldPositions, { timeout: 80 })
    // 上一次 restore 在跑的同时，立刻发起新的 restore
    const newPromise = restoreScrollPositions([div], newPositions, { timeout: 80 })

    await Promise.all([oldPromise, newPromise])

    // 新的位置应该生效
    expect(div.scrollTop).toBe(200)

    // 等待超过上一次 restore 的 timeout，确保上一次的 setTimeout 不会再触发把位置改回 0
    await new Promise((r) => setTimeout(r, 120))
    expect(div.scrollTop).toBe(200)
  })
})
