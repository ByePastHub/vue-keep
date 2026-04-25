# 模块 15：测试

> 阶段：Phase 1-3（贯穿所有阶段） | 预估：3 天 | 前置依赖：各模块实现

## 目标

建立完整的测试体系：Vitest 单元测试覆盖核心逻辑，@vue/test-utils 组件测试覆盖渲染行为，Playwright E2E 测试覆盖真实用户场景。目标：store/ 和 router/ 100% 行覆盖。

---

## 文件清单

| 文件                                                   | 职责                     |
| ------------------------------------------------------ | ------------------------ |
| `packages/core/vitest.config.ts`                       | Vitest 配置              |
| `packages/core/test/unit/stack-manager.test.ts`        | 栈管理器测试             |
| `packages/core/test/unit/navigation-info.test.ts`      | 导航方向判定测试         |
| `packages/core/test/unit/intent-tracker.test.ts`       | 意图追踪器测试           |
| `packages/core/test/unit/core-store.test.ts`           | CoreStore 测试           |
| `packages/core/test/unit/name-resolver.test.ts`        | 组件名解析测试           |
| `packages/core/test/unit/lru.test.ts`                  | LRU 淘汰测试             |
| `packages/core/test/unit/match.test.ts`                | NameMatcher 测试         |
| `packages/core/test/unit/container-resolver.test.ts`   | 容器解析测试             |
| `packages/core/test/unit/event-channel.test.ts`        | EventChannel 测试        |
| `packages/core/test/unit/keep-scroll-behavior.test.ts` | 滚动行为协作测试         |
| `packages/core/test/unit/persistence.test.ts`          | history.state 持久化测试 |
| `packages/core/test/unit/scroll-capture.test.ts`       | 滚动抓取测试             |
| `packages/core/test/unit/scroll-restore.test.ts`       | 滚动恢复测试             |
| `packages/core/test/unit/animation-presets.test.ts`    | 动画预设测试             |
| `packages/core/test/component/KeepRouterView.test.ts`  | KeepRouterView 组件测试  |
| `packages/core/test/component/KeepTransition.test.ts`  | KeepTransition 组件测试  |
| `packages/core/test/helpers/mock-router.ts`            | 模拟 Vue Router          |
| `packages/core/test/helpers/mock-store.ts`             | 模拟 CoreStore           |
| `packages/core/test/helpers/setup.ts`                  | 测试全局设置             |
| `playground/ecommerce/e2e/*.spec.ts`                   | Playwright E2E 测试      |

---

## 任务清单

### T15-01：Vitest 配置

文件：`packages/core/vitest.config.ts`

- [✅] 配置 Vitest：

  ```ts
  import { defineConfig } from 'vitest/config'
  import vue from '@vitejs/plugin-vue'
  import vueJsx from '@vitejs/plugin-vue-jsx'

  export default defineConfig({
    plugins: [vue(), vueJsx()],
    test: {
      environment: 'happy-dom',
      globals: true,
      setupFiles: ['./test/helpers/setup.ts'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.ts', 'src/**/*.tsx'],
        exclude: ['src/types/**', 'src/devtools/**', 'src/index.ts'],
        thresholds: {
          'src/store/': { lines: 100, branches: 95 },
          'src/router/': { lines: 100, branches: 95 },
        },
      },
    },
    define: {
      __DEV__: true,
    },
  })
  ```

- [✅] 使用 happy-dom 作为 DOM 环境
- [✅] 全局 setup 文件配置
- [✅] 覆盖率阈值：store/ 和 router/ 100% 行覆盖

**验收**：`pnpm test` 能运行所有测试

### T15-02：测试辅助工具

文件：`packages/core/test/helpers/mock-router.ts`

- [✅] 实现模拟 Vue Router：

  ```ts
  import { reactive, ref } from 'vue'
  import type { Router, RouteLocationNormalizedLoaded } from 'vue-router'

  export function createMockRouter(options?: {
    initialRoute?: Partial<RouteLocationNormalizedLoaded> // 初始路由快照
  }): Router & {
    simulatePush(to: string): void // 模拟 push 导航
    simulateBack(): void // 模拟后退导航
    simulatePopState(direction: 'back' | 'forward'): void // 模拟浏览器 popstate
    historyListeners: Set<Function> // 当前注册的 history 监听器集合
  } {
    const currentRoute = ref<RouteLocationNormalizedLoaded>({
      fullPath: '/',
      path: '/',
      name: 'home',
      params: {},
      query: {},
      hash: '',
      matched: [],
      meta: {},
      redirectedFrom: undefined,
      ...options?.initialRoute,
    } as RouteLocationNormalizedLoaded)

    const beforeEachGuards: Function[] = []
    const afterEachHooks: Function[] = []
    const historyListeners = new Set<Function>()

    const router = {
      currentRoute,
      options: {
        history: {
          listen(callback: Function) {
            historyListeners.add(callback)
            return () => historyListeners.delete(callback)
          },
        },
      },
      beforeEach(guard: Function) {
        beforeEachGuards.push(guard)
        return () => {
          const idx = beforeEachGuards.indexOf(guard)
          if (idx > -1) beforeEachGuards.splice(idx, 1)
        }
      },
      beforeResolve(guard: Function) {
        // 简化实现
        return () => {}
      },
      afterEach(hook: Function) {
        afterEachHooks.push(hook)
        return () => {
          const idx = afterEachHooks.indexOf(hook)
          if (idx > -1) afterEachHooks.splice(idx, 1)
        }
      },
      async push(to: any) {
        const route = resolveRoute(to)
        for (const guard of beforeEachGuards) {
          const result = await guard(route, currentRoute.value)
          if (result === false) return
        }
        const from = currentRoute.value
        currentRoute.value = route
        for (const hook of afterEachHooks) {
          hook(route, from, undefined)
        }
      },
      async replace(to: any) {
        return this.push(to)
      },
      go(delta: number) {
        // 模拟浏览器前进/后退
        historyListeners.forEach((fn) =>
          fn('', '', {
            type: 'pop',
            direction: delta < 0 ? 'back' : 'forward',
            delta,
          }),
        )
      },
      isReady() {
        return Promise.resolve()
      },

      // 测试辅助方法
      simulatePush(to: string) {
        historyListeners.forEach((fn) =>
          fn(to, currentRoute.value.fullPath, {
            type: 'push',
            direction: 'forward',
            delta: 1,
          }),
        )
      },
      simulateBack() {
        this.go(-1)
      },
      simulatePopState(direction: 'back' | 'forward') {
        historyListeners.forEach((fn) =>
          fn('', '', {
            type: 'pop',
            direction,
            delta: direction === 'back' ? -1 : 1,
          }),
        )
      },
      historyListeners,
    }

    return router as any
  }

  function resolveRoute(to: any): RouteLocationNormalizedLoaded {
    if (typeof to === 'string') {
      return {
        fullPath: to,
        path: to,
        name: to.slice(1) || 'home',
        params: {},
        query: {},
        hash: '',
        matched: [{ components: { default: { name: to.slice(1) || 'Home' } } }],
        meta: {},
        redirectedFrom: undefined,
      } as any
    }
    return { ...to, matched: to.matched || [] } as any
  }
  ```

**验收**：模拟 Router 能模拟 push/back/popState 行为

### T15-03：栈管理器单元测试

文件：`packages/core/test/unit/stack-manager.test.ts`

- [✅] 测试用例清单（至少 15 个）：

  ```ts
  describe('StackManager', () => {
    describe('Push', () => {
      it('push 后栈深增加 1')
      it('push 5 次后栈深为 5')
      it('在 position 2 push 新页面，position 3、4 被裁剪')
      it('push 到 max+1 时，最旧的非 constCache 条目被 LRU 淘汰')
      it('constCache 条目不被 LRU 淘汰')
      it('当前激活条目不被 LRU 淘汰')
    })

    describe('Replace', () => {
      it('replace 后栈深不变')
      it('旧栈顶的 name 从 includeList 中移除')
      it('新栈顶的 name 加入 includeList')
    })

    describe('Back', () => {
      it('back(1) 弹出栈顶 1 个')
      it('back(3) 弹出栈顶 3 个')
      it('back 到只剩 1 个时不再弹出')
      it('back(0) 不操作')
    })

    describe('ReLaunch', () => {
      it('reLaunch 后所有容器的栈都被清空')
      it('只有目标容器有一个新条目')
    })

    describe('SwitchTab', () => {
      it('已存在的 tab 不重复入栈')
      it('不存在的 tab 创建新条目')
      it('switchTab 不影响子栈')
      it('switchTab 通过 tabKey 命中已有 tab')
    })

    describe('evict', () => {
      it('按 name 移除')
      it('按 name 数组批量移除')
      it('ALL 清空')
      it('函数条件移除')
    })

    describe('getIncludeList', () => {
      it('返回栈中所有条目的 name')
      it('空栈返回空数组')
    })
  })
  ```

**验收**：所有测试通过，覆盖率 100%

### T15-04：导航方向判定测试

文件：`packages/core/test/unit/navigation-info.test.ts`

- [✅] 覆盖判定矩阵的所有 8 种组合：
  ```ts
  describe('resolveNavigation', () => {
    it('intent=push + info.push.forward → Push + forward')
    it('intent=replace + info.push.unknown → Replace + none')
    it('intent=back → Back + back')
    it('intent=reLaunch + info.push.unknown → ReLaunch + none')
    it('intent=switchTab + info.push.unknown → SwitchTab + none')
    it('no intent + info.pop.back → Back + back')
    it('no intent + info.pop.forward → Push + forward')
    it('no intent + no info（初始化） → Push + none')
  })
  ```

**验收**：8 种组合全部通过

### T15-05：意图追踪器测试

文件：`packages/core/test/unit/intent-tracker.test.ts`

- [✅] 测试用例：
  ```ts
  describe('IntentTracker', () => {
    it('set 后 take 返回设置的值')
    it('take 后再次 take 返回 null')
    it('peek 不消费值')
    it('set 覆盖之前的值')
  })
  ```

**验收**：所有测试通过

### T15-06：CoreStore 测试

文件：`packages/core/test/unit/core-store.test.ts`

- [✅] 测试用例：
  ```ts
  describe('CoreStore', () => {
    it('初始状态正确')
    it('ensureStack 创建新栈')
    it('destroyStack 删除栈')
    it('getIncludeList 返回正确列表')
    it('getCurrentEntry 返回最后激活的条目')
    it('prepareNavigation 暂存导航信息')
    it('commitNavigation 提交栈变更')
    it('导航失败时不提交')
    it('addGuard 注册守卫')
    it('runGuards 执行所有守卫')
    it('守卫返回 false 时取消导航')
    it('destroy 移除指定条目')
    it('onNavigationCommit 订阅触发')
    it('onStateChange 订阅触发')
    it('setReady 后 ready 为 true')
  })
  ```

**验收**：所有测试通过，覆盖率 100%

### T15-07：组件名解析测试

文件：`packages/core/test/unit/name-resolver.test.ts`

- [✅] 测试用例：
  ```ts
  describe('NameResolver', () => {
    it('有 name 的组件直接返回 name')
    it('有 __name 的组件返回 __name')
    it('无 name 但 route.name 是字符串时返回 route.name')
    it('route.name 是 Symbol 时返回 null')
    it('无 name 的组件被包装后有正确的 name')
    it('包装后的组件渲染结果与原组件一致')
    it('同一个组件多次调用返回同一个包装实例（WeakMap 缓存）')
    it('完全无 name 时打印开发警告')
  })
  ```

**验收**：所有测试通过

### T15-08：EventChannel 测试

文件：`packages/core/test/unit/event-channel.test.ts`

- [✅] 测试用例：

  ```ts
  describe('EventChannel', () => {
    it('on + emit 触发 handler')
    it('多个 handler 都被触发')
    it('once 只触发一次')
    it('off 移除指定 handler')
    it('off 不传 handler 移除所有')
    it('destroy 后 emit 被忽略')
    it('destroy 后 on 返回空函数')
    it('on 返回的取消函数能正确移除')
  })

  describe('ChannelRegistry', () => {
    it('create 后 get 返回通道')
    it('destroy 后 get 返回 undefined')
    it('clear 销毁所有通道')
    it('条目被 remove 后自动销毁对应 channel')
  })
  ```

**验收**：所有测试通过

### T15-09：LRU 和 NameMatcher 测试

文件：`packages/core/test/unit/lru.test.ts`

- [✅] 测试用例：
  ```ts
  describe('evictLeastRecentlyUsed', () => {
    it('栈 [A(t=1), B(t=2), C(t=3), D(t=4)]，max=2，淘汰 A 和 B')
    it('constCache 条目不被淘汰')
    it('当前激活条目不被淘汰')
    it('所有候选都不可淘汰时不淘汰')
    it('max 大于栈长时不淘汰')
  })
  ```

文件：`packages/core/test/unit/match.test.ts`

- [✅] 测试用例：
  ```ts
  describe('matchName', () => {
    it('字符串精确匹配')
    it('正则匹配')
    it('数组匹配')
    it('函数匹配')
    it('undefined 返回 false')
  })
  ```

**验收**：所有测试通过

### T15-10：滚动相关测试

文件：`packages/core/test/unit/scroll-capture.test.ts`

- [✅] 测试用例：
  ```ts
  describe('captureScrollPositions', () => {
    it('抓取单个容器的 scrollTop/scrollLeft')
    it('抓取多个容器')
    it('iOS 弹性滚动值被 clamp')
    it('主滚动容器 key 为 __document__')
  })
  ```

文件：`packages/core/test/unit/scroll-restore.test.ts`

- [✅] 测试用例：

  ```ts
  describe('restoreScrollPositions', () => {
    it('恢复单个容器的滚动位置')
    it('恢复多个容器')
    it('位置不存在时不操作')
  })

  describe('detectScrollContainers', () => {
    it('发现 document.scrollingElement')
    it('发现 [data-scroll-container] 元素')
    it('额外选择器正确匹配')
    it('结果无重复')
  })
  ```

**验收**：所有测试通过

### T15-11：容器解析与 scrollBehavior 测试

文件：`packages/core/test/unit/container-resolver.test.ts`

- [✅] 测试用例：
  ```ts
  describe('resolveContainerId', () => {
    it('顶层容器生成 keep:0:root:default')
    it('不同父页面下 depth=1 的容器 ID 不相同')
    it('显式传入 containerId 时覆盖默认规则')
  })
  ```

文件：`packages/core/test/unit/keep-scroll-behavior.test.ts`

- [✅] 测试用例：
  ```ts
  describe('createKeepScrollBehavior', () => {
    it('direction=back 时返回 false')
    it('direction=none 时走 fallback')
    it('没有 fallback 时默认返回 savedPosition 或 { top: 0 }')
  })
  ```

**验收**：容器解析和滚动协作测试全部通过

### T15-12：动画预设测试

文件：`packages/core/test/unit/animation-presets.test.ts`

- [✅] 测试用例：
  ```ts
  describe('resolveTransitionName', () => {
    it('slide + forward → keep-slide-left')
    it('slide + back → keep-slide-right')
    it('slide + none → undefined')
    it('fade + forward → keep-fade')
    it('zoom + forward → keep-zoom-in')
    it('zoom + back → keep-zoom-out')
    it('false → undefined')
    it('自定义函数 name')
  })
  ```

**验收**：所有测试通过

### T15-13：KeepRouterView 组件测试

文件：`packages/core/test/component/KeepRouterView.test.ts`

- [✅] 测试用例：
  ```ts
  describe('KeepRouterView', () => {
    it('默认渲染出 RouterView > KeepAlive > Component 结构')
    it('include 列表与 store 同步')
    it('自定义 slot 能拿到 Component、route、direction')
    it('自定义 slot 能拿到 state.stack')
    it('自定义 slot 调用 renderPage 后仍具备页面壳能力')
    it('嵌套时 depth 自动递增')
    it('exclude prop 过滤正确')
    it('include prop 过滤正确')
    it('unmount 时栈被销毁')
  })
  ```
- [✅] 使用 `@vue/test-utils` 的 `mount` + `provide` 注入模拟依赖

**验收**：所有测试通过

### T15-14：Playwright E2E 测试

文件：`playground/ecommerce/e2e/*.spec.ts`

- [✅] 8 个核心 E2E 用例：

  ```ts
  // e2e/scroll-restoration.spec.ts
  test('列表页滚动到底部 → 进入详情 → 返回 → 滚动位置恢复', async ({ page }) => {
    await page.goto('/list')
    await page.evaluate(() => window.scrollTo(0, 1000))
    await page.click('[data-testid="item-1"]')
    await page.waitForURL('/detail/1')
    await page.goBack()
    await page.waitForURL('/list')
    const scrollTop = await page.evaluate(() => document.documentElement.scrollTop)
    expect(scrollTop).toBeCloseTo(1000, -1)
  })

  // e2e/cache-preservation.spec.ts
  test('详情页返回列表页，列表页未刷新', async ({ page }) => {
    // 验证列表页的组件实例被保留
  })

  // e2e/tab-switch.spec.ts
  test('tab 切换保持子栈', async ({ page }) => {
    // tab A → push 子页面 → tab B → tab A → 子页面仍在
  })

  // e2e/relaunch.spec.ts
  test('reLaunch 清空所有栈', async ({ page }) => {
    // push 多个页面 → reLaunch → 只剩一个页面
  })

  // e2e/go-back-multi.spec.ts
  test('go(-3) 跨层返回', async ({ page }) => {
    // push A → B → C → D → go(-3) → 回到 A
  })

  // e2e/refresh-recovery.spec.ts
  test('刷新后恢复当前页面', async ({ page }) => {
    await page.goto('/list')
    await page.click('[data-testid="item-1"]')
    await page.waitForURL('/detail/1')
    await page.reload()
    expect(page.url()).toContain('/detail/1')
  })

  // e2e/multi-tab-isolation.spec.ts
  test('多 tab 栈隔离', async ({ page }) => {
    // tab A 的栈操作不影响 tab B
  })

  // e2e/incognito-fallback.spec.ts
  test('无痕模式降级正常', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    // 验证基本功能正常
  })
  ```

**验收**：所有 E2E 测试通过

### T15-15：Playwright 配置

文件：`playground/ecommerce/playwright.config.ts`

- [✅] 配置 Playwright：

  ```ts
  import { defineConfig } from '@playwright/test'

  export default defineConfig({
    testDir: './e2e',
    timeout: 30000,
    use: {
      baseURL: 'http://localhost:5173',
      trace: 'on-first-retry',
    },
    webServer: {
      command: 'pnpm dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  })
  ```

**验收**：`pnpm test:e2e` 能启动 dev server 并运行测试

### T15-16：测试全局设置

文件：`packages/core/test/helpers/setup.ts`

- [✅] 全局设置：

  ```ts
  import { vi } from 'vitest'

  // 模拟 __DEV__
  globalThis.__DEV__ = true

  // 模拟 console.warn 以便测试警告
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  // 清理
  afterEach(() => {
    vi.restoreAllMocks()
  })
  ```

**验收**：所有测试共享全局设置

### T15-17：非功能烟测

- [✅] 为动画系统补充“减少动态效果”测试：
  - 断言 `prefers-reduced-motion: reduce` 样式存在
  - 断言开启后过渡时长被压缩
- [✅] 增加源码静态安全检查：
  - 核心源码中不出现 `eval(`
  - 核心源码中不出现 `innerHTML =`

**验收**：

- [✅] reduced-motion 场景通过
- [✅] 静态安全检查通过

---

## 完成标准

- [✅] 单元测试覆盖所有核心模块
- [✅] store/ 和 router/ 100% 行覆盖
- [✅] 组件测试覆盖 KeepRouterView 和 KeepTransition
- [✅] 8 个 E2E 核心用例全部通过
- [✅] `pnpm test` 全部通过
- [✅] `pnpm test:e2e` 全部通过
- [✅] CI 中自动运行
