import { describe, it, expect, vi } from 'vitest'
import { createChannelRegistry } from './registry'

describe('createChannelRegistry', () => {
  it('create 创建通道并可通过 get 获取', () => {
    const reg = createChannelRegistry()
    const ch = reg.create('ch-1')
    expect(reg.get('ch-1')).toBe(ch)
    expect(reg.size).toBe(1)
  })

  it('destroy 销毁通道后 get 返回 undefined', () => {
    const reg = createChannelRegistry()
    const ch = reg.create<{ msg: string }>('ch-1')
    const handler = vi.fn()
    ch.on('msg', handler)

    reg.destroy('ch-1')
    expect(reg.get('ch-1')).toBeUndefined()
    expect(reg.size).toBe(0)

    // 销毁后 emit 不触发
    ch.emit('msg', 'hello')
    expect(handler).not.toHaveBeenCalled()
  })

  it('destroy 不存在的通道不报错', () => {
    const reg = createChannelRegistry()
    expect(() => reg.destroy('nonexistent')).not.toThrow()
  })

  it('clear 销毁所有通道', () => {
    const reg = createChannelRegistry()
    const ch1 = reg.create<{ a: number }>('ch-1')
    const ch2 = reg.create<{ b: string }>('ch-2')
    const h1 = vi.fn()
    const h2 = vi.fn()
    ch1.on('a', h1)
    ch2.on('b', h2)

    reg.clear()
    expect(reg.size).toBe(0)
    expect(reg.get('ch-1')).toBeUndefined()
    expect(reg.get('ch-2')).toBeUndefined()

    // 销毁后 emit 不触发
    ch1.emit('a', 1)
    ch2.emit('b', 'x')
    expect(h1).not.toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it('size 正确反映通道数量', () => {
    const reg = createChannelRegistry()
    expect(reg.size).toBe(0)
    reg.create('a')
    reg.create('b')
    expect(reg.size).toBe(2)
    reg.destroy('a')
    expect(reg.size).toBe(1)
  })
})
