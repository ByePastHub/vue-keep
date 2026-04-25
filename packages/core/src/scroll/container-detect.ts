import { isBrowser } from '../utils/env'

// 获取滚动容器的唯一标识
function getContainerKey(el: Element): string {
  if (el === document.scrollingElement || el === document.documentElement) {
    return '__document__'
  }
  const attr = el.getAttribute('data-scroll-container')
  if (attr) return attr
  if (el.id) return `#${el.id}`
  return generateSelectorPath(el)
}

// 生成元素的选择器路径作为 fallback key
function generateSelectorPath(el: Element): string {
  const parts: string[] = []
  let current: Element | null = el
  while (current && current !== document.documentElement) {
    const tag = current.tagName.toLowerCase()
    const parent: Element | null = current.parentElement
    if (parent) {
      const currentTag = current.tagName
      const siblings = Array.from(parent.children).filter((c: Element) => c.tagName === currentTag)
      if (siblings.length > 1) {
        const idx = siblings.indexOf(current) + 1
        parts.unshift(`${tag}:nth-of-type(${idx})`)
      } else {
        parts.unshift(tag)
      }
    } else {
      parts.unshift(tag)
    }
    current = parent
  }
  return parts.join('>')
}

export { getContainerKey }

// 发现页面中的滚动容器
export function detectScrollContainers(
  root?: Element | null,
  extraSelectors?: string[],
): Element[] {
  if (!isBrowser) return []

  const containers: Element[] = []

  // 1. 主滚动容器
  const scrollingElement = document.scrollingElement || document.documentElement
  containers.push(scrollingElement)

  // 2. [data-scroll-container] 标记的元素
  const scope = root || document
  const marked = scope.querySelectorAll('[data-scroll-container]')
  marked.forEach((el) => containers.push(el))

  // 3. 额外选择器
  if (extraSelectors) {
    for (const selector of extraSelectors) {
      try {
        const els = scope.querySelectorAll(selector)
        els.forEach((el) => containers.push(el))
      } catch {
        // 无效选择器，跳过
      }
    }
  }

  // 去重
  return [...new Set(containers)]
}
