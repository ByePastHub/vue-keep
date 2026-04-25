import { describe, expect, it } from 'vitest'
import { KeepRouterView } from './KeepRouterView'

describe('KeepRouterView', () => {
  it('未传 transition 时不应覆盖全局动画配置', () => {
    const transitionProp = KeepRouterView.props.transition as { default?: unknown }

    expect(transitionProp.default).toBeUndefined()
  })
})
