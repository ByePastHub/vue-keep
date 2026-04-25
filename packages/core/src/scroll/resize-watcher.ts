import type { ScrollPosition } from '../types/public'
import { getContainerKey } from './container-detect'
import { isBrowser } from '../utils/env'

// 将保存的滚动位置应用到容器
function applyPositions(containers: Element[], positions: Map<string, ScrollPosition>): void {
  for (const el of containers) {
    const key = getContainerKey(el)
    const pos = positions.get(key)
    if (!pos) continue

    if (el === document.scrollingElement || el === document.documentElement) {
      window.scrollTo({ top: pos.top, left: pos.left, behavior: 'auto' })
      continue
    }
    el.scrollTop = pos.top
    el.scrollLeft = pos.left
  }
}

export { applyPositions }

// ResizeObserver 监听高度变化，在内容尺寸变化时重新恢复滚动位置
export function watchResize(
  containers: Element[],
  positions: Map<string, ScrollPosition>,
): {
  promise: Promise<void>
  cleanup: () => void
} {
  let observer: ResizeObserver | null = null
  let settled = false

  const cleanup = () => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    settled = true
  }

  const promise = new Promise<void>((resolve) => {
    if (!isBrowser || typeof ResizeObserver === 'undefined') {
      resolve()
      return
    }

    let stableCount = 0
    let lastHeight = 0

    observer = new ResizeObserver((entries) => {
      if (settled) return

      applyPositions(containers, positions)

      const currentHeight = entries.reduce((sum, e) => sum + e.contentRect.height, 0)
      if (currentHeight === lastHeight) {
        stableCount++
        if (stableCount >= 2) {
          resolve()
          cleanup()
        }
      } else {
        stableCount = 0
      }
      lastHeight = currentHeight
    })

    for (const el of containers) {
      observer.observe(el)
    }
  })

  return { promise, cleanup }
}
