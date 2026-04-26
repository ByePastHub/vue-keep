import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  markFixedElements,
  refreshMarkedFixedElementOffsets,
  unmarkFixedElements,
} from './fixed-elements'

describe('fixed-elements', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('自动标记页面内任意 fixed 元素', () => {
    document.body.innerHTML = `
      <main>
        <header style="position: fixed; top: 0;"></header>
        <nav style="position: fixed; bottom: 0;"></nav>
        <button style="position: fixed; right: 24px; top: 320px;"></button>
        <section style="position: absolute;"></section>
      </main>
    `
    const root = document.querySelector('main') as HTMLElement
    const header = document.querySelector('header') as HTMLElement
    const tabBar = document.querySelector('nav') as HTMLElement
    const floating = document.querySelector('button') as HTMLElement
    const absolute = document.querySelector('section') as HTMLElement
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
    header.getBoundingClientRect = () => ({ top: -260, bottom: -204 }) as DOMRect
    tabBar.getBoundingClientRect = () => ({ top: 568, bottom: 624 }) as DOMRect
    floating.getBoundingClientRect = () => ({ top: 320, bottom: 368 }) as DOMRect

    markFixedElements(root)

    expect(header.hasAttribute('data-vue-keep-fixed-auto')).toBe(true)
    expect(header.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe('260px')
    expect(tabBar.hasAttribute('data-vue-keep-fixed-auto')).toBe(true)
    expect(tabBar.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe(
      `${window.innerHeight - 624}px`,
    )
    expect(floating.hasAttribute('data-vue-keep-fixed-auto')).toBe(true)
    expect(floating.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe('0px')
    expect(absolute.hasAttribute('data-vue-keep-fixed-auto')).toBe(false)
  })

  it('动画结束后清理内部 fixed 标记', () => {
    document.body.innerHTML = `
      <main>
        <nav style="position: fixed; bottom: 0;"></nav>
      </main>
    `
    const root = document.querySelector('main') as HTMLElement
    const tabBar = document.querySelector('nav') as HTMLElement
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(0)
    tabBar.getBoundingClientRect = () => ({ top: 828, bottom: 884 }) as DOMRect

    markFixedElements(root)
    unmarkFixedElements(root)

    expect(tabBar.hasAttribute('data-vue-keep-fixed-auto')).toBe(false)
    expect(tabBar.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe('')
  })

  it('离开页可以使用指定滚动值作为 fixed 补偿', () => {
    document.body.innerHTML = `
      <main>
        <header style="position: fixed; top: 0;"></header>
      </main>
    `
    const root = document.querySelector('main') as HTMLElement
    const header = document.querySelector('header') as HTMLElement
    vi.spyOn(window, 'scrollY', 'get').mockReturnValue(260)
    header.getBoundingClientRect = () => ({ top: 0, bottom: 56 }) as DOMRect

    markFixedElements(root, { offsetY: 260 })

    expect(header.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe('260px')
  })

  it('滚动恢复后可以按元素几何位置刷新 fixed 补偿', () => {
    document.body.innerHTML = `
      <main>
        <header style="position: fixed; top: 0;"></header>
      </main>
    `
    const root = document.querySelector('main') as HTMLElement
    const header = document.querySelector('header') as HTMLElement
    let top = 0
    header.getBoundingClientRect = () => ({ top, bottom: top + 56 }) as DOMRect

    markFixedElements(root)
    top = -260
    refreshMarkedFixedElementOffsets()

    expect(header.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe('260px')
  })

  it('底部 fixed 元素进入已滚动页面时保持在视口底部', () => {
    document.body.innerHTML = `
      <main>
        <nav style="position: fixed; bottom: 0;"></nav>
      </main>
    `
    const root = document.querySelector('main') as HTMLElement
    const tabBar = document.querySelector('nav') as HTMLElement
    tabBar.getBoundingClientRect = () => ({ top: 1114, bottom: 1170 }) as DOMRect

    markFixedElements(root)

    expect(tabBar.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe(
      `${window.innerHeight - 1170}px`,
    )
  })

  it('进入已滚动页面时按页面根节点预置 fixed 补偿', () => {
    document.body.innerHTML = `
      <main>
        <header style="position: fixed; top: 0;"></header>
        <nav style="position: fixed; bottom: 0;"></nav>
      </main>
    `
    const root = document.querySelector('main') as HTMLElement
    const header = document.querySelector('header') as HTMLElement
    const tabBar = document.querySelector('nav') as HTMLElement
    root.getBoundingClientRect = () => ({ top: -860, bottom: 1170 }) as DOMRect

    markFixedElements(root, { rootOffset: true })

    expect(header.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe('860px')
    expect(tabBar.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe(
      `${window.innerHeight - 1170}px`,
    )
  })

  it('离开页 fixed 元素刷新时保留指定补偿值', () => {
    document.body.innerHTML = `
      <main>
        <header style="position: fixed; top: 0;"></header>
      </main>
    `
    const root = document.querySelector('main') as HTMLElement
    const header = document.querySelector('header') as HTMLElement
    vi.spyOn(window, 'scrollY', 'get').mockReturnValueOnce(0).mockReturnValue(860)
    header.getBoundingClientRect = () => ({ top: 0, bottom: 56 }) as DOMRect

    markFixedElements(root, { offsetY: 0 })
    refreshMarkedFixedElementOffsets()

    expect(header.style.getPropertyValue('--vue-keep-auto-fixed-offset-y')).toBe('0px')
  })
})
