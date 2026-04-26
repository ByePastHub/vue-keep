import { isBrowser } from '../utils/env'

const AUTO_FIXED_ATTR = 'data-vue-keep-fixed-auto'
const markedElements = new WeakSet<HTMLElement>()
const fixedOffsetOverrides = new WeakMap<HTMLElement, number>()
const rootOffsetElements = new WeakMap<HTMLElement, Element>()

interface MarkFixedElementsOptions {
  offsetY?: number // 纵向偏移覆盖值
  rootOffset?: boolean // 是否按页面根节点位置计算补偿
}

// 解析 CSS 像素值
function parsePixel(value: string): number | null {
  if (!value.endsWith('px')) return null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

// 计算 fixed 元素需要回到原视口位置的纵向偏移
function resolveAutoOffsetY(element: HTMLElement): number {
  const rect = element.getBoundingClientRect()
  const style = window.getComputedStyle(element)
  const top = parsePixel(style.top)
  const bottom = parsePixel(style.bottom)
  const shouldUseTop = top !== null && (bottom === null || top <= bottom)

  if (shouldUseTop) return top - rect.top
  if (bottom !== null) return window.innerHeight - bottom - rect.bottom

  return 0
}

// 判断 fixed 元素更接近顶部锚点还是底部锚点
function shouldUseTopAnchor(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element)
  const top = parsePixel(style.top)
  const bottom = parsePixel(style.bottom)
  return top !== null && (bottom === null || top <= bottom)
}

// 基于页面根节点计算 fixed 元素补偿，进入页首帧需要在 transform 定位上下文生效前预置
function resolveRootOffsetY(root: Element, element: HTMLElement): number {
  const rect = root.getBoundingClientRect()
  if (shouldUseTopAnchor(element)) return -rect.top
  return window.innerHeight - rect.bottom
}

// 收集页面根节点内当前参与布局的 fixed 元素
function collectFixedElements(root: Element): HTMLElement[] {
  if (!isBrowser) return []
  const elements = Array.from(root.querySelectorAll<HTMLElement>('*'))
  return elements.filter((element) => window.getComputedStyle(element).position === 'fixed')
}

// 标记 fixed 元素，让内置动画 CSS 能在离开页补偿滚动偏移
export function markFixedElements(root: Element, options: MarkFixedElementsOptions = {}) {
  if (!isBrowser) return
  collectFixedElements(root).forEach((element) => {
    let offsetY: number
    if (options.offsetY !== undefined) {
      offsetY = options.offsetY
      fixedOffsetOverrides.set(element, options.offsetY)
      rootOffsetElements.delete(element)
    } else if (options.rootOffset) {
      offsetY = resolveRootOffsetY(root, element)
      fixedOffsetOverrides.delete(element)
      rootOffsetElements.set(element, root)
    } else {
      offsetY = resolveAutoOffsetY(element)
      fixedOffsetOverrides.delete(element)
      rootOffsetElements.delete(element)
    }
    markedElements.add(element)
    element.setAttribute(AUTO_FIXED_ATTR, '')
    element.style.setProperty('--vue-keep-auto-fixed-offset-y', `${offsetY}px`)
  })
}

// 刷新当前动画中的 fixed 元素偏移，滚动恢复后需要重新同步
export function refreshMarkedFixedElementOffsets(root: ParentNode = document) {
  if (!isBrowser) return
  const elements = Array.from(root.querySelectorAll<HTMLElement>(`[${AUTO_FIXED_ATTR}]`))
  elements.forEach((element) => {
    if (!markedElements.has(element)) return
    const overrideOffset = fixedOffsetOverrides.get(element)
    const root = rootOffsetElements.get(element)
    const offsetY =
      overrideOffset ?? (root ? resolveRootOffsetY(root, element) : resolveAutoOffsetY(element))
    element.style.setProperty('--vue-keep-auto-fixed-offset-y', `${offsetY}px`)
  })
}

// 清理由 markFixedElements 写入的 fixed 元素标记
export function unmarkFixedElements(root: Element) {
  if (!isBrowser) return
  const elements = Array.from(root.querySelectorAll<HTMLElement>(`[${AUTO_FIXED_ATTR}]`))
  elements.forEach((element) => {
    if (!markedElements.has(element)) return
    fixedOffsetOverrides.delete(element)
    rootOffsetElements.delete(element)
    element.style.removeProperty('--vue-keep-auto-fixed-offset-y')
    element.removeAttribute(AUTO_FIXED_ATTR)
  })
}
