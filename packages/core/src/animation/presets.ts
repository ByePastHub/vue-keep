import type { NavigationDirection, TransitionPreset } from '../types/public'

export const PRESET_MAP: Record<TransitionPreset, Record<NavigationDirection, string>> = {
  slide: {
    forward: 'keep-slide-left',
    back: 'keep-slide-right',
    none: '',
  },
  fade: {
    forward: 'keep-fade',
    back: 'keep-fade',
    none: '',
  },
  zoom: {
    forward: 'keep-zoom-in',
    back: 'keep-zoom-out',
    none: '',
  },
}
