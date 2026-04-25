import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { KeepTransition } from './KeepTransition'
import { KEEP_OPTIONS_KEY } from '../symbols'

const Child = defineComponent({
  name: 'TransitionChild',
  setup() {
    // 渲染测试子组件
    return () => h('div', 'child')
  },
})

describe('KeepTransition', () => {
  it('无导航方向时直接渲染默认内容', () => {
    const wrapper = mount(KeepTransition, {
      props: {
        direction: 'none',
        preset: 'slide',
      },
      slots: {
        default: () => h(Child),
      },
      global: {
        provide: {
          [KEEP_OPTIONS_KEY as symbol]: {
            transition: 'slide',
            disableFirstTransition: false,
          },
        },
      },
    })

    expect(wrapper.findComponent(Child).exists()).toBe(true)
    expect(wrapper.find('div').text()).toBe('child')
  })
})
