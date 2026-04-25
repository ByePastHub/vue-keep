import { describe, it, expect, beforeEach } from 'vitest'
import { genId, resetIdCounter } from '../store/id-allocator'

describe('id-allocator', () => {
  beforeEach(() => {
    resetIdCounter()
  })

  it('生成非空字符串', () => {
    const id = genId()
    expect(id).toBeTruthy()
    expect(typeof id).toBe('string')
  })

  it('连续生成的 ID 不重复', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 1000; i++) {
      ids.add(genId())
    }
    expect(ids.size).toBe(1000)
  })

  it('ID 格式为 vk_{自增}_{时间戳base36}', () => {
    const id = genId()
    expect(id).toMatch(/^vk_\d+_[a-z0-9]+$/)
  })

  it('resetIdCounter 重置计数器', () => {
    genId()
    genId()
    resetIdCounter()
    const id = genId()
    expect(id).toMatch(/^vk_1_/)
  })
})
