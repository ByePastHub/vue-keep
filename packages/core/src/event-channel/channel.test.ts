import { describe, it, expect, vi } from 'vitest'
import { createEventChannel } from './channel'

describe('createEventChannel', () => {
  it('emit 触发 on 注册的监听器', () => {
    const ch = createEventChannel<{ msg: string }>('ch-1')
    const handler = vi.fn()
    ch.on('msg', handler)
    ch.emit('msg', 'hello')
    expect(handler).toHaveBeenCalledWith('hello')
  })

  it('on 返回取消函数，调用后不再触发', () => {
    const ch = createEventChannel<{ msg: string }>('ch-2')
    const handler = vi.fn()
    const off = ch.on('msg', handler)
    off()
    ch.emit('msg', 'hello')
    expect(handler).not.toHaveBeenCalled()
  })

  it('once 只触发一次', () => {
    const ch = createEventChannel<{ msg: string }>('ch-3')
    const handler = vi.fn()
    ch.once('msg', handler)
    ch.emit('msg', 'first')
    ch.emit('msg', 'second')
    expect(handler).toHaveBeenCalledTimes(1)
    expect(handler).toHaveBeenCalledWith('first')
  })

  it('off 移除指定监听器', () => {
    const ch = createEventChannel<{ msg: string }>('ch-4')
    const h1 = vi.fn()
    const h2 = vi.fn()
    ch.on('msg', h1)
    ch.on('msg', h2)
    ch.off('msg', h1)
    ch.emit('msg', 'test')
    expect(h1).not.toHaveBeenCalled()
    expect(h2).toHaveBeenCalledWith('test')
  })

  it('off 不传 handler 移除该事件所有监听器', () => {
    const ch = createEventChannel<{ msg: string }>('ch-5')
    const h1 = vi.fn()
    const h2 = vi.fn()
    ch.on('msg', h1)
    ch.on('msg', h2)
    ch.off('msg')
    ch.emit('msg', 'test')
    expect(h1).not.toHaveBeenCalled()
    expect(h2).not.toHaveBeenCalled()
  })

  it('destroy 后 emit 被忽略', () => {
    const ch = createEventChannel<{ msg: string }>('ch-6')
    const handler = vi.fn()
    ch.on('msg', handler)
    ch.destroy()
    ch.emit('msg', 'hello')
    expect(handler).not.toHaveBeenCalled()
  })

  it('destroy 后 on 返回空取消函数', () => {
    const ch = createEventChannel<{ msg: string }>('ch-7')
    ch.destroy()
    const off = ch.on('msg', vi.fn())
    expect(typeof off).toBe('function')
    off() // 不报错
  })

  it('多个事件互不干扰', () => {
    const ch = createEventChannel<{ a: number; b: string }>('ch-8')
    const ha = vi.fn()
    const hb = vi.fn()
    ch.on('a', ha)
    ch.on('b', hb)
    ch.emit('a', 42)
    expect(ha).toHaveBeenCalledWith(42)
    expect(hb).not.toHaveBeenCalled()
  })
})
