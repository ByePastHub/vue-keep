import type { ScrollPosition } from '../types/public'
import { isBrowser } from '../utils/env'

let placeholder: HTMLElement | null = null
let lockCount = 0

// 确保文档拥有足够高度，避免恢复滚动时被浏览器夹到顶部
export function ensureDocumentScrollSpace(positions: Map<string, ScrollPosition>): boolean {
  if (!isBrowser) return false
  const position = positions.get('__document__')
  if (!position || position.top <= 0) return false

  lockCount++

  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0
  const requiredHeight = Math.max(position.scrollHeight ?? 0, position.top + viewportHeight)
  const currentHeight = Math.max(
    document.documentElement.scrollHeight,
    document.body?.scrollHeight ?? 0,
  )

  if (currentHeight >= requiredHeight) return true

  if (!placeholder) {
    placeholder = document.createElement('div')
    placeholder.setAttribute('data-vue-keep-scroll-placeholder', '')
    placeholder.style.cssText = 'height:0;min-height:0;pointer-events:none;visibility:hidden;'
    document.body.appendChild(placeholder)
  }

  placeholder.style.height = `${requiredHeight - currentHeight}px`
  return true
}

// 清理文档滚动占位节点
export function cleanupDocumentScrollSpace(locked = true): void {
  if (!locked) return
  if (lockCount > 0) {
    lockCount--
  }
  if (lockCount > 0 || !placeholder) return
  placeholder.remove()
  placeholder = null
}
