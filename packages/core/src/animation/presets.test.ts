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
})
