import { readFileSync } from 'node:fs'
import { describe, it, expect } from 'vitest'
import { PRESET_MAP } from './presets'

describe('PRESET_MAP', () => {
  it('slide forward → keep-slide-left', () => {
    expect(PRESET_MAP.slide.forward).toBe('keep-slide-left')
  })

  it('slide back → keep-slide-right', () => {
    expect(PRESET_MAP.slide.back).toBe('keep-slide-right')
  })

  it('slide none → 空字符串', () => {
    expect(PRESET_MAP.slide.none).toBe('')
  })

  it('fade forward/back 相同', () => {
    expect(PRESET_MAP.fade.forward).toBe('keep-fade')
    expect(PRESET_MAP.fade.back).toBe('keep-fade')
  })

  it('zoom forward → keep-zoom-in', () => {
    expect(PRESET_MAP.zoom.forward).toBe('keep-zoom-in')
  })

  it('zoom back → keep-zoom-out', () => {
    expect(PRESET_MAP.zoom.back).toBe('keep-zoom-out')
  })

  it('内置动画根节点保留长页面高度并提供 fixed 补偿', () => {
    const css = readFileSync('src/animation/presets.css', 'utf-8')

    expect(css).toContain('min-height: 100dvh;')
    expect(css).not.toMatch(/^\s*height:\s*100dvh;/m)
    expect(css).toContain('.keep-slide-left-leave-active [data-vue-keep-fixed-auto]')
    expect(css).toContain('.keep-slide-right-enter-active [data-vue-keep-fixed-auto]')
    expect(css).toContain('.keep-fade-leave-active [data-vue-keep-fixed-auto]')
    expect(css).toContain('.keep-zoom-out-enter-active [data-vue-keep-fixed-auto]')
    expect(css).toContain('.keep-zoom-out-leave-active [data-vue-keep-fixed-auto]')
    expect(css).toContain('var(--vue-keep-auto-fixed-offset-y, var(--vue-keep-fixed-offset-y, 0));')
  })
})
