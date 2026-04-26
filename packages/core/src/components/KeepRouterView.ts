import {
  defineComponent,
  h,
  inject,
  provide,
  computed,
  onUnmounted,
  KeepAlive,
  type PropType,
  type Component,
} from 'vue'
import { RouterView, useRoute } from 'vue-router'
import type { NameMatcher, TransitionConfig, TransitionPreset } from '../types/public'
import { KEEP_STORE_KEY, KEEP_OPTIONS_KEY, DEPTH_KEY, CONTAINER_ID_KEY } from '../symbols'
import type { CoreStore } from '../store/core-store'
import type { KeepOptionsResolved } from '../types/public'
import { useKeepAliveInclude } from './KeepAliveBridge'
import { isSSR } from '../utils/env'
import { KeepTransition } from './KeepTransition'

// 从路由 meta 中读取页面级动画配置
function resolveRouteTransition(
  route: any,
): false | TransitionPreset | TransitionConfig | undefined {
  return route?.meta?.keep?.transition
}

export const KeepRouterView = defineComponent({
  name: 'KeepRouterView',
  props: {
    max: { type: Number },
    cacheMax: { type: Number },
    exclude: { type: [String, Array, RegExp, Function] as PropType<NameMatcher> },
    include: { type: [String, Array, RegExp, Function] as PropType<NameMatcher> },
    containerId: { type: String },
    transition: {
      type: [Boolean, String, Object] as PropType<false | TransitionPreset | TransitionConfig>,
      default: undefined,
    },
    scrollContainers: { type: Array as PropType<string[]> },
  },
  setup(props, { slots }) {
    // SSR 安全：直接渲染 RouterView
    if (isSSR) {
      return () =>
        h(RouterView, null, {
          default: ({ Component }: { Component: Component | null }) =>
            Component ? h(Component) : null,
        })
    }

    const store = inject(KEEP_STORE_KEY) as CoreStore
    const options = inject(KEEP_OPTIONS_KEY) as KeepOptionsResolved

    // depth 自增
    const parentDepth = inject(DEPTH_KEY, -1)
    const depth = parentDepth + 1
    provide(DEPTH_KEY, depth)

    // containerId 计算
    const parentKey = inject(CONTAINER_ID_KEY, 'root')
    const route = useRoute()
    const cid = computed(() => {
      if (props.containerId) return props.containerId
      if (depth === 0) return `keep:0:root:default`
      const parentRecord = route.matched[depth - 1]
      const key =
        (parentRecord?.name && typeof parentRecord.name === 'string'
          ? parentRecord.name
          : parentRecord?.path) ?? parentKey
      return `keep:${depth}:${key}:default`
    })
    provide(CONTAINER_ID_KEY, cid.value)

    // 注册栈
    store.ensureStack(cid.value)
    onUnmounted(() => store.destroyStack(cid.value))

    // include 列表
    const effectiveInclude = useKeepAliveInclude(cid, props.exclude, props.include)

    return () =>
      h(RouterView, null, {
        default: ({ Component, route }: { Component: Component | null; route: any }) => {
          if (!Component) return null

          const includeList = effectiveInclude.value
          const dir =
            store.state.pendingDirection ?? store.state.lastNavigation?.direction ?? 'none'
          const transitionDir =
            store.state.pendingTransitionDirection ??
            store.state.lastNavigation?.transitionDirection ??
            dir
          const currentEntry = store.getCurrentEntry(cid.value)

          // 渲染页面组件
          const pageVNode = h(Component, { key: route.fullPath })

          // KeepAlive 包裹
          const keepAliveVNode = h(
            KeepAlive,
            {
              include: includeList,
              max:
                props.cacheMax ?? props.max ?? (typeof options.max === 'number' ? options.max : 10),
            },
            () => pageVNode,
          )

          // 如果用户提供了自定义 slot
          if (slots.default) {
            return slots.default({
              Component,
              route,
              direction: dir,
              containerId: cid.value,
              renderPage: () => pageVNode,
              state: {
                stack: store.getStack(cid.value),
                current: currentEntry,
                depth,
              },
            })
          }

          // Transition 包裹（支持 props > 当前路由 meta > 来源路由 meta > 全局配置）
          const tc =
            props.transition ??
            resolveRouteTransition(route) ??
            resolveRouteTransition(store.state.lastNavigation?.from) ??
            options.transition ??
            false
          if (tc !== false) {
            return h(
              KeepTransition,
              {
                direction: transitionDir,
                preset: tc,
              },
              () => keepAliveVNode,
            )
          }

          return keepAliveVNode
        },
      })
  },
})
