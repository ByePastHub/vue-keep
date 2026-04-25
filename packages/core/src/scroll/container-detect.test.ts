import { describe, it, expect, beforeEach } from 'vitest'
import { detectScrollContainers, getContainerKey } from './container-detect'

describe('container-detect', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  describe('detectScrollContainers', () => {
    it('默认发现 document.scrollingElement', () => {
      const containers = detectScrollContainers()
      expect(containers.length).toBeGreaterThanOrEqual(1)
      const keys = containers.map(getContainerKey)
      expect(keys).toContain('__document__')
    })

    it('发现 [data-scroll-container] 标记的元素', () => {
      const div = document.createElement('div')
      div.setAttribute('data-scroll-container', 'list')
      document.body.appendChild(div)

      const containers = detectScrollContainers()
      expect(containers).toContain(div)
    })

    it('额外选择器正确匹配', () => {
      const div = document.createElement('div')
      div.className = 'my-scroll'
      document.body.appendChild(div)

      const containers = detectScrollContainers(null, ['.my-scroll'])
      expect(containers).toContain(div)
    })

    it('结果无重复', () => {
      const div = document.createElement('div')
      div.className = 'my-scroll'
      div.setAttribute('data-scroll-container', 'dup')
      document.body.appendChild(div)

      const containers = detectScrollContainers(null, ['.my-scroll'])
      const count = containers.filter((c) => c === div).length
      expect(count).toBe(1)
    })

    it('在指定 root 范围内搜索', () => {
      const root = document.createElement('div')
      const inner = document.createElement('div')
      inner.setAttribute('data-scroll-container', 'inner')
      root.appendChild(inner)
      document.body.appendChild(root)

      const outer = document.createElement('div')
      outer.setAttribute('data-scroll-container', 'outer')
      document.body.appendChild(outer)

      const containers = detectScrollContainers(root)
      const keys = containers.map(getContainerKey)
      expect(keys).toContain('inner')
      expect(keys).not.toContain('outer')
    })
  })

  describe('getContainerKey', () => {
    it('主滚动容器 key 为 __document__', () => {
      const el = document.scrollingElement || document.documentElement
      expect(getContainerKey(el)).toBe('__document__')
    })

    it('data-scroll-container 的值作为 key', () => {
      const div = document.createElement('div')
      div.setAttribute('data-scroll-container', 'my-list')
      expect(getContainerKey(div)).toBe('my-list')
    })

    it('有 id 的元素用 #id 作为 key', () => {
      const div = document.createElement('div')
      div.id = 'scroll-area'
      document.body.appendChild(div)
      expect(getContainerKey(div)).toBe('#scroll-area')
    })
  })
})
