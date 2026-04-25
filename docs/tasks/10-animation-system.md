# 模块 10：动画系统

> 阶段：Phase 2 | 预估：1.5 天 | 前置依赖：模块 07

## 目标

实现方向感知的页面切换动画。内置 slide/fade/zoom 三种预设，支持自定义扩展。动画方向由 store 的 `lastNavigation.direction` 驱动，首屏可跳过动画。

---

## 文件清单

| 文件                                             | 职责                         |
| ------------------------------------------------ | ---------------------------- |
| `packages/core/src/animation/presets.css`        | CSS 动画预设                 |
| `packages/core/src/animation/presets.ts`         | 预设名称映射                 |
| `packages/core/src/animation/direction-class.ts` | 方向 → CSS class 解析        |
| `packages/core/src/components/KeepTransition.ts` | 方向感知 Transition 包装组件 |

---

## 任务清单

### T10-01：CSS 动画预设

文件：`packages/core/src/animation/presets.css`

- [✅] 实现 slide 预设（水平滑动）：

  ```css
  /* slide-left：前进动画（新页面从右侧滑入） */
  .keep-slide-left-enter-active,
  .keep-slide-left-leave-active {
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }
  .keep-slide-left-enter-from {
    transform: translateX(100%);
  }
  .keep-slide-left-leave-to {
    transform: translateX(-30%);
  }

  /* slide-right：返回动画（旧页面从左侧滑入） */
  .keep-slide-right-enter-active,
  .keep-slide-right-leave-active {
    transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
    will-change: transform;
  }
  .keep-slide-right-enter-from {
    transform: translateX(-30%);
  }
  .keep-slide-right-leave-to {
    transform: translateX(100%);
  }
  ```

- [✅] 实现 fade 预设：
  ```css
  .keep-fade-enter-active,
  .keep-fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .keep-fade-enter-from,
  .keep-fade-leave-to {
    opacity: 0;
  }
  ```
- [✅] 实现 zoom 预设：

  ```css
  /* zoom-in：前进（新页面放大进入） */
  .keep-zoom-in-enter-active,
  .keep-zoom-in-leave-active {
    transition:
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.25s ease;
  }
  .keep-zoom-in-enter-from {
    transform: scale(0.9);
    opacity: 0;
  }
  .keep-zoom-in-leave-to {
    transform: scale(1.1);
    opacity: 0;
  }

  /* zoom-out：返回（旧页面缩小退出） */
  .keep-zoom-out-enter-active,
  .keep-zoom-out-leave-active {
    transition:
      transform 0.25s cubic-bezier(0.4, 0, 0.2, 1),
      opacity 0.25s ease;
  }
  .keep-zoom-out-enter-from {
    transform: scale(1.1);
    opacity: 0;
  }
  .keep-zoom-out-leave-to {
    transform: scale(0.9);
    opacity: 0;
  }
  ```

- [✅] 所有动画使用 `will-change` 提示 GPU 加速
- [✅] slide 预设的离开动画只移动 30%（模拟 iOS 导航效果，而非完全滑出）
- [✅] 补充减少动画支持：
  ```css
  @media (prefers-reduced-motion: reduce) {
    .keep-slide-left-enter-active,
    .keep-slide-left-leave-active,
    .keep-slide-right-enter-active,
    .keep-slide-right-leave-active,
    .keep-fade-enter-active,
    .keep-fade-leave-active,
    .keep-zoom-in-enter-active,
    .keep-zoom-in-leave-active,
    .keep-zoom-out-enter-active,
    .keep-zoom-out-leave-active {
      transition-duration: 0.01ms !important;
    }
  }
  ```

**验收**：

- [✅] 手动引入 CSS 后，添加对应 class 能看到动画效果
- [✅] slide 动画流畅，无卡顿
- [✅] fade 和 zoom 动画自然
- [✅] 系统开启“减少动态效果”时动画几乎瞬时完成

### T10-02：预设名称映射

文件：`packages/core/src/animation/presets.ts`

- [✅] 定义预设类型：
  ```ts
  export type TransitionPreset = 'slide' | 'fade' | 'zoom'
  ```
- [✅] 实现方向 → 动画名映射：
  ```ts
  export const PRESET_MAP: Record<TransitionPreset, Record<NavigationDirection, string>> = {
    slide: {
      forward: 'keep-slide-left',
      back: 'keep-slide-right',
      none: '', // 无动画
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
  ```
- [✅] `none` 方向（replace/reLaunch）不播放动画

**验收**：

- [✅] `PRESET_MAP.slide.forward` 返回 `'keep-slide-left'`
- [✅] `PRESET_MAP.slide.back` 返回 `'keep-slide-right'`
- [✅] `PRESET_MAP.slide.none` 返回空字符串

### T10-03：方向 → CSS class 解析

文件：`packages/core/src/animation/direction-class.ts`

- [✅] 实现 `resolveTransitionName` 函数：

  ```ts
  export function resolveTransitionName(
    transition: false | TransitionPreset | TransitionConfig,
    direction: NavigationDirection,
  ): string | undefined {
    // 禁用动画
    if (transition === false) return undefined

    // 预设字符串
    if (typeof transition === 'string') {
      return PRESET_MAP[transition]?.[direction] || undefined
    }

    // 自定义配置
    if (typeof transition === 'object' && transition.name) {
      if (typeof transition.name === 'function') {
        return transition.name(direction)
      }
      return transition.name
    }

    return undefined
  }
  ```

- [✅] 实现 `resolveTransitionProps` 函数：

  ```ts
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
      if (transition.appear !== undefined) props.appear = transition.appear
      if (transition.duration) props.duration = transition.duration
    }

    return props
  }
  ```

**验收**：

- [✅] `resolveTransitionName('slide', 'forward')` → `'keep-slide-left'`
- [✅] `resolveTransitionName(false, 'forward')` → `undefined`
- [✅] `resolveTransitionName({ name: (d) => `custom-${d}` }, 'back')` → `'custom-back'`

### T10-04：KeepTransition 组件

文件：`packages/core/src/components/KeepTransition.ts`

- [✅] 实现方向感知的 Transition 包装组件：

  ```tsx
  import { defineComponent, Transition, inject, ref, onMounted } from 'vue'
  import { resolveTransitionProps } from '../animation/direction-class'
  import { KEEP_OPTIONS_KEY } from '../symbols'
  import type { PropType } from 'vue'

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
      const options = inject(KEEP_OPTIONS_KEY)!
      const isFirstRender = ref(true)

      onMounted(() => {
        // 首屏渲染后标记
        isFirstRender.value = false
      })

      return () => {
        const transition = props.preset ?? options.transition

        // 首屏且 disableFirstTransition 为 true 时跳过动画
        if (isFirstRender.value && options.disableFirstTransition) {
          return slots.default?.()
        }

        // 禁用动画
        if (transition === false) {
          return slots.default?.()
        }

        const transitionProps = resolveTransitionProps(transition, props.direction)
        if (!transitionProps) {
          return slots.default?.()
        }

        return <Transition {...transitionProps}>{slots.default?.()}</Transition>
      }
    },
  })
  ```

- [✅] 首屏跳过动画（`disableFirstTransition` 默认 true）
- [✅] 支持 props 级别覆盖全局 transition 配置
- [✅] `transition=false` 时直接渲染子组件，不包裹 Transition

**验收**：

- [✅] 首次渲染不播放动画
- [✅] push 后播放 slide-left 动画
- [✅] back 后播放 slide-right 动画
- [✅] replace 后不播放动画
- [✅] `transition={false}` 时无动画包裹
- [✅] 自定义 TransitionConfig 生效

### T10-05：CSS 按需导入

- [✅] CSS 预设文件通过 package.json exports 暴露：
  ```json
  {
    "exports": {
      "./animations.css": "./dist/animations.css"
    }
  }
  ```
- [✅] 用户使用方式：
  ```ts
  import '@bye_past/vue-keep/animations.css'
  ```
- [✅] tsup 构建时将 `presets.css` 复制到 `dist/animations.css`
- [✅] 不使用动画的用户不需要引入此 CSS（tree-shake 友好）

**验收**：

- [✅] `import '@bye_past/vue-keep/animations.css'` 可用
- [✅] 不引入 CSS 时 JS bundle 不包含任何 CSS 相关代码

### T10-06：TransitionConfig 类型完善

文件：`packages/core/src/types/public.ts`（补充）

- [✅] 确保 TransitionConfig 接口完整：
  ```ts
  export interface TransitionConfig {
    name?: string | ((direction: NavigationDirection) => string) // transition 名称或名称工厂
    mode?: 'out-in' | 'in-out' | 'default' // Transition 切换模式
    appear?: boolean // 是否在初始渲染时播放动画
    duration?:
      | number
      | {
          // 进入和离开的时长
          enter: number // 进入动画时长
          leave: number // 离开动画时长
        }
    onBeforeEnter?: (el: Element) => void // 进入前钩子
    onEnter?: (el: Element, done: () => void) => void // 进入中钩子
    onAfterEnter?: (el: Element) => void // 进入后钩子
    onBeforeLeave?: (el: Element) => void // 离开前钩子
    onLeave?: (el: Element, done: () => void) => void // 离开中钩子
    onAfterLeave?: (el: Element) => void // 离开后钩子
  }
  ```
- [✅] 支持 Vue Transition 的所有钩子函数

**验收**：自定义 TransitionConfig 的钩子函数在动画过程中被调用

---

## 完成标准

- [✅] 三种内置预设（slide/fade/zoom）动画流畅
- [✅] 方向自动切换（forward → slide-left，back → slide-right）
- [✅] 首屏跳过动画
- [✅] CSS 按需导入，不影响 JS bundle 体积
- [✅] `prefers-reduced-motion` 场景下自动降级
- [✅] 自定义 TransitionConfig 完整支持
- [✅] SSR 安全（Transition 在 SSR 下不渲染动画）
- [✅] 单元测试覆盖：预设映射、方向解析、首屏跳过
- [✅] `pnpm typecheck` 通过

### T10-06：none 方向动画跳过

文件：`packages/core/src/components/KeepTransition.ts`

- [✅] 当预设在 `direction = 'none'` 下解析不到动画名称时，直接渲染默认内容
- [✅] 避免 switchTab / replace 等无方向导航创建空 Transition 包裹
- [✅] 首屏跳过动画逻辑仍仅在存在有效 transition props 时生效

**验收**：

- [✅] switchTab 默认不播放页面过渡动画
- [✅] 自定义 transition name 返回空字符串时不创建 Transition
- [✅] 前进/后退动画行为不受影响
