import type { NavigationDirection, TransitionConfig, TransitionPreset } from '../types/public'
import { PRESET_MAP } from './presets'

export interface TransitionProps {
  name: string
  mode?: 'out-in' | 'in-out' | 'default'
  appear?: boolean
  duration?: number | { enter: number; leave: number }
}

export function resolveTransitionName(
  transition: false | TransitionPreset | TransitionConfig,
  direction: NavigationDirection,
): string | undefined {
  if (transition === false) return undefined

  if (typeof transition === 'string') {
    return PRESET_MAP[transition]?.[direction] || undefined
  }

  if (typeof transition === 'object' && transition.name) {
    if (typeof transition.name === 'function') {
      return transition.name(direction)
    }
    return transition.name
  }

  return undefined
}

export function resolveTransitionProps(
  transition: false | TransitionPreset | TransitionConfig,
  direction: NavigationDirection,
): TransitionProps | null {
  if (transition === false) return null

  const name = resolveTransitionName(transition, direction)
  if (!name) return null

  const props: TransitionProps = { name }

  if (typeof transition === 'object') {
    if (transition.mode) props.mode = transition.mode
    if (transition.appear != null) props.appear = transition.appear
    if (transition.duration) props.duration = transition.duration
  }

  return props
}
