import { describe, it, expect, vi, beforeEach } from 'vitest'
import { warn, error, setNamespace } from '../utils/warn'

describe('warn', () => {
  beforeEach(() => {
    setNamespace('[vue-keep]')
  })

  it('warn 输出带命名空间的警告', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    warn('测试警告')
    expect(spy).toHaveBeenCalledWith('[vue-keep] 测试警告')
    spy.mockRestore()
  })

  it('error 输出带命名空间的错误', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    error('测试错误')
    expect(spy).toHaveBeenCalledWith('[vue-keep] 测试错误')
    spy.mockRestore()
  })

  it('setNamespace 修改命名空间', () => {
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {})
    setNamespace('[custom]')
    warn('自定义')
    expect(spy).toHaveBeenCalledWith('[custom] 自定义')
    spy.mockRestore()
  })
})
