import { inject, computed, type ComputedRef } from 'vue'
import { KEEP_STORE_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import type { NavigationDirection } from '../types/public'

export function useNavigationDirection(): ComputedRef<NavigationDirection> {
  const store = inject(KEEP_STORE_KEY) as CoreStore
  return computed(() => store.state.lastNavigation?.direction ?? 'none')
}
