import { describe, it, expect } from 'vitest'
import { uid } from '../utils/uid'

describe('uid', () => {
  it('生成非空字符串', () => {
    expect(uid()).toBeTruthy()
  })

  it('每次调用生成不同的 ID', () => {
    const ids = new Set(Array.from({ length: 100 }, () => uid()))
    expect(ids.size).toBe(100)
  })

  it('以 vk_ 前缀开头', () => {
    expect(uid()).toMatch(/^vk_/)
  })
})
