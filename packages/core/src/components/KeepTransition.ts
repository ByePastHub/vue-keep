import { defineComponent, h, inject, ref, onMounted, Transition, type PropType } from 'vue'
import type { NavigationDirection, TransitionConfig, TransitionPreset } from '../types/public'
import { KEEP_OPTIONS_KEY } from '../symbols'
import type { KeepOptionsResolved } from '../types/public'
import { resolveTransitionProps } from '../animation/direction-class'

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
        shouldSkipFirstTransition ? { name: '' } : transitionProps,
        slots.default,
      )
    }
  },
})
