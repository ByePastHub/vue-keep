import { nextTick } from 'vue'
import type { ScrollPosition } from '../types/public'
import { ensureDocumentScrollSpace, cleanupDocumentScrollSpace } from './document-placeholder'
import { applyPositions, watchResize } from './resize-watcher'

// 三道防线恢复滚动位置
export async function restoreScrollPositions(
  containers: Element[],
  positions: Map<string, ScrollPosition>,
  options?: { timeout?: number },
): Promise<void> {
  const timeout = options?.timeout ?? 600

  const shouldCleanupDocumentSpace = ensureDocumentScrollSpace(positions)

  // 第一道防线：同步恢复，避免缓存页先以顶部位置绘制一帧
  applyPositions(containers, positions)

  // 第二道防线：nextTick 后再次恢复，覆盖 DOM 激活后的尺寸变化
  await nextTick()
  applyPositions(containers, positions)

  // 第三道防线：ResizeObserver 监听高度变化
  const { promise, cleanup } = watchResize(containers, positions)

  // 第四道防线：超时兜底
  const timer = setTimeout(() => {
    applyPositions(containers, positions)
    cleanup()
  }, timeout)

  await Promise.race([promise, new Promise<void>((r) => setTimeout(r, timeout))])
  clearTimeout(timer)
  applyPositions(containers, positions)
  cleanup()
  cleanupDocumentScrollSpace(shouldCleanupDocumentSpace)
}
