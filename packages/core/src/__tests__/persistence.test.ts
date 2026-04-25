import { describe, it, expect } from 'vitest'
import { createKeepState, readKeepState } from '../store/persistence'

describe('persistence', () => {
  describe('createKeepState', () => {
    it('创建正确的 state 对象', () => {
      const state = createKeepState('vk_1', 0, 'push')
      expect(state.__vueKeepId).toBe('vk_1')
      expect(state.__vueKeepPosition).toBe(0)
      expect(state.__vueKeepContainerId).toBe('keep:0:root:default')
    })
  })

  describe('readKeepState', () => {
    it('从合法 state 中读取', () => {
      const state = {
        __vueKeepId: 'vk_1',
        __vueKeepPosition: 0,
        __vueKeepContainerId: 'keep:0:root:default',
      }
      const result = readKeepState(state)
      expect(result).not.toBeNull()
      expect(result!.__vueKeepId).toBe('vk_1')
    })

    it('null 输入返回 null', () => {
      expect(readKeepState(null)).toBeNull()
    })

    it('非对象输入返回 null', () => {
      expect(readKeepState('string')).toBeNull()
    })

    it('缺少 __vueKeepId 返回 null', () => {
      expect(readKeepState({ foo: 'bar' })).toBeNull()
    })

    it('__vueKeepId 非字符串返回 null', () => {
      expect(readKeepState({ __vueKeepId: 123 })).toBeNull()
    })

    it('缺少可选字段时使用默认值', () => {
      const result = readKeepState({ __vueKeepId: 'vk_1' })
      expect(result!.__vueKeepPosition).toBe(0)
      expect(result!.__vueKeepContainerId).toBe('keep:0:root:default')
    })
  })
})
