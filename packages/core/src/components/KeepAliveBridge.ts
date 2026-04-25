import { computed, inject, type Ref } from 'vue'
import { KEEP_STORE_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import { matchName } from '../utils/match'
import type { NameMatcher } from '../types/public'

// 从 store 获取 include 列表，并应用 exclude/include 过滤
export function useKeepAliveInclude(
  containerId: Ref<string>,
  exclude?: NameMatcher,
  include?: NameMatcher,
) {
  const store = inject(KEEP_STORE_KEY) as CoreStore

  return computed(() => {
    const storeList = store.getIncludeList(containerId.value)

    if (include) {
      return storeList.filter((name) => matchName(include, name))
    }

    if (exclude) {
      return storeList.filter((name) => !matchName(exclude, name))
    }

    return storeList
  })
}
