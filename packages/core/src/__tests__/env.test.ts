import { describe, it, expect } from 'vitest'
import { isBrowser, isSSR, hasHistory } from '../utils/env'

describe('env', () => {
  it('isBrowser 在 happy-dom 下为 true', () => {
    expect(isBrowser).toBe(true)
  })

  it('isSSR 与 isBrowser 互斥', () => {
    expect(isSSR).toBe(!isBrowser)
  })

  it('hasHistory 在浏览器环境下为 true', () => {
    expect(hasHistory).toBe(true)
  })
})
