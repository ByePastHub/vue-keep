import type { ScrollPosition } from '../types/public'
import { getContainerKey } from './container-detect'

// 抓取所有滚动容器的当前位置
export function captureScrollPositions(containers: Element[]): Map<string, ScrollPosition> {
  const positions = new Map<string, ScrollPosition>()

  for (const el of containers) {
    const key = getContainerKey(el)

    // iOS 弹性滚动 clamp
    const maxTop = el.scrollHeight - el.clientHeight
    const maxLeft = el.scrollWidth - el.clientWidth
    const top = Math.max(0, Math.min(el.scrollTop, maxTop))
    const left = Math.max(0, Math.min(el.scrollLeft, maxLeft))

    positions.set(key, {
      top,
      left,
      scrollWidth: el.scrollWidth,
      scrollHeight: el.scrollHeight,
    })
  }

  return positions
}
