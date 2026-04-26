import { defineComponent, h, inject, ref, onMounted, Transition, type PropType } from 'vue'
import type { NavigationDirection, TransitionConfig, TransitionPreset } from '../types/public'
import { KEEP_OPTIONS_KEY } from '../symbols'
import type { KeepOptionsResolved } from '../types/public'
import { resolveTransitionProps } from '../animation/direction-class'
import {
  markFixedElements,
  refreshMarkedFixedElementOffsets,
  unmarkFixedElements,
} from '../animation/fixed-elements'

// 判断动画配置是否为对象配置
function resolveTransitionConfig(
  transition: false | TransitionPreset | TransitionConfig,
): TransitionConfig | null {
  return typeof transition === 'object' && transition !== null ? transition : null
}

// 按页面根节点预置 fixed 补偿，避免首帧闪动并兼容顶部/底部固定元素
function markRootFixedElements(el: Element): void {
  markFixedElements(el, { rootOffset: true })
}

// 下一帧刷新 fixed 补偿，等待动画 active 类和 transform 定位上下文生效
function refreshFixedElementsOnNextFrame(el: Element): void {
  if (typeof requestAnimationFrame !== 'function') {
    refreshMarkedFixedElementOffsets(el)
    return
  }
  requestAnimationFrame(() => {
    refreshMarkedFixedElementOffsets(el)
  })
}

// 合并内置 fixed 冻结钩子和用户自定义动画钩子
function mergeTransitionHooks(
  transitionProps: ReturnType<typeof resolveTransitionProps>,
  config: TransitionConfig | null,
) {
  if (!transitionProps) return transitionProps

  return {
    ...transitionProps,
    onBeforeEnter: (el: Element) => {
      markRootFixedElements(el)
      config?.onBeforeEnter?.(el)
    },
    onEnter: (el: Element) => {
      markRootFixedElements(el)
      refreshFixedElementsOnNextFrame(el)
    },
    onAfterEnter: (el: Element) => {
      unmarkFixedElements(el)
      config?.onAfterEnter?.(el)
    },
    onEnterCancelled: (el: Element) => {
      unmarkFixedElements(el)
    },
    onBeforeLeave: (el: Element) => {
      markRootFixedElements(el)
      config?.onBeforeLeave?.(el)
    },
    onAfterLeave: (el: Element) => {
      unmarkFixedElements(el)
      config?.onAfterLeave?.(el)
    },
    onLeaveCancelled: (el: Element) => {
      unmarkFixedElements(el)
    },
  }
}

export const KeepTransition = defineComponent({
  name: 'KeepTransition',
  props: {
    direction: {
      type: String as PropType<NavigationDirection>,
      required: true,
    },
    preset: {
      type: [Boolean, String, Object] as PropType<false | TransitionPreset | TransitionConfig>,
      default: undefined,
    },
  },
  setup(props, { slots }) {
    const options = inject(KEEP_OPTIONS_KEY) as KeepOptionsResolved | null
    const isFirstRender = ref(true)

    onMounted(() => {
      isFirstRender.value = false
    })

    return () => {
      const transition = props.preset ?? options?.transition ?? false

      if (transition === false) {
        return slots.default?.()
      }

      const transitionProps = resolveTransitionProps(transition, props.direction)
      const shouldSkipFirstTransition =
        isFirstRender.value && (options?.disableFirstTransition ?? true)

      if (!transitionProps) {
        return slots.default?.()
      }

      return h(
        Transition,
        shouldSkipFirstTransition
          ? { name: '' }
          : mergeTransitionHooks(transitionProps, resolveTransitionConfig(transition)),
        slots.default,
      )
    }
  },
})
