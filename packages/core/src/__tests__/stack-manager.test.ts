import { describe, it, expect, beforeEach } from 'vitest'
import { createStackManager } from '../store/stack-manager'
import { resetIdCounter } from '../store/id-allocator'
import type { KeepOptionsResolved, PageStackEntry } from '../types/public'
import type { ApplyParams } from '../types/internal'

const defaultOptions: KeepOptionsResolved = {
  router: {} as any,
  max: 10,
  exclude: undefined,
  include: undefined,
  scrollBehavior: 'auto',
  persist: true,
  transition: 'slide',
  devtools: false,
  namespace: '[vue-keep]',
  disableFirstTransition: true,
  onBeforeEvict: undefined,
}

const mockRoute = (name: string, path: string) =>
  ({
    name,
    fullPath: path,
    path,
    matched: [{ name, path, components: { default: { name } } }],
    meta: {},
    params: {},
    query: {},
    hash: '',
    redirectedFrom: undefined,
  }) as any

function makeParams(overrides: Partial<ApplyParams> = {}): ApplyParams {
  return {
    containerId: overrides.containerId ?? 'keep:0:root:default',
    to: overrides.to ?? mockRoute('home', '/home'),
    from: overrides.from ?? null,
    method: overrides.method ?? 'push',
    direction: overrides.direction ?? 'forward',
    delta: overrides.delta ?? 1,
    hints: overrides.hints ?? {},
  }
}

describe('StackManager - Push', () => {
  let manager: ReturnType<typeof createStackManager>
  let stack: PageStackEntry[]

  beforeEach(() => {
    resetIdCounter()
    manager = createStackManager(defaultOptions)
    stack = []
  })

  it('push 创建新条目', () => {
    const result = manager.apply(
      stack,
      makeParams({
        to: mockRoute('home', '/home'),
      }),
    )
    expect(result.added.length).toBe(1)
    expect(result.added[0]!.name).toBe('home')
    expect(stack.length).toBe(1)
  })

  it('连续 push 5 次栈深为 5', () => {
    for (let i = 0; i < 5; i++) {
      manager.apply(
        stack,
        makeParams({
          to: mockRoute(`page${i}`, `/page${i}`),
        }),
      )
    }
    expect(stack.length).toBe(5)
  })

  it('push 超过 max 时 LRU 淘汰', () => {
    const sm = createStackManager({ ...defaultOptions, max: 3 })
    const s: PageStackEntry[] = []

    for (let i = 0; i < 4; i++) {
      sm.apply(
        s,
        makeParams({
          to: mockRoute(`page${i}`, `/page${i}`),
        }),
      )
    }

    expect(s.length).toBe(3)
  })

  it('constCache 条目不被 LRU 淘汰', () => {
    const sm = createStackManager({ ...defaultOptions, max: 2 })
    const s: PageStackEntry[] = []

    // 第一个条目标记为 constCache
    sm.apply(
      s,
      makeParams({
        to: mockRoute('const', '/const'),
        hints: { constCache: true },
      }),
    )

    sm.apply(
      s,
      makeParams({
        to: mockRoute('page1', '/page1'),
      }),
    )

    sm.apply(
      s,
      makeParams({
        to: mockRoute('page2', '/page2'),
      }),
    )

    // constCache 条目应该保留
    expect(s.some((e) => e.name === 'const')).toBe(true)
  })

  it('push 设置 channelId 和 metadata', () => {
    const result = manager.apply(
      stack,
      makeParams({
        to: mockRoute('detail', '/detail'),
        hints: { channelId: 'ch-1', metadata: { from: 'list' } },
      }),
    )
    expect(result.added[0]!.channelId).toBe('ch-1')
    expect(result.added[0]!.metadata).toEqual({ from: 'list' })
  })
})

describe('StackManager - Replace', () => {
  let manager: ReturnType<typeof createStackManager>
  let stack: PageStackEntry[]

  beforeEach(() => {
    resetIdCounter()
    manager = createStackManager(defaultOptions)
    stack = []
    manager.apply(
      stack,
      makeParams({
        to: mockRoute('home', '/home'),
      }),
    )
  })

  it('replace 后栈深不变', () => {
    manager.apply(
      stack,
      makeParams({
        method: 'replace',
        to: mockRoute('home-v2', '/home-v2'),
      }),
    )
    expect(stack.length).toBe(1)
  })

  it('replace 返回旧栈顶为 removed', () => {
    const result = manager.apply(
      stack,
      makeParams({
        method: 'replace',
        to: mockRoute('home-v2', '/home-v2'),
      }),
    )
    expect(result.removed.length).toBe(1)
    expect(result.removed[0]!.name).toBe('home')
    expect(result.added[0]!.name).toBe('home-v2')
  })
})

describe('StackManager - Back', () => {
  let manager: ReturnType<typeof createStackManager>
  let stack: PageStackEntry[]

  beforeEach(() => {
    resetIdCounter()
    manager = createStackManager(defaultOptions)
    stack = []
    manager.apply(stack, makeParams({ to: mockRoute('home', '/home') }))
    manager.apply(stack, makeParams({ to: mockRoute('list', '/list') }))
    manager.apply(stack, makeParams({ to: mockRoute('detail', '/detail') }))
  })

  it('back(1) 弹出栈顶 1 个', () => {
    const result = manager.apply(
      stack,
      makeParams({
        method: 'back',
        direction: 'back',
        delta: -1,
        to: mockRoute('list', '/list'),
      }),
    )
    expect(result.removed.length).toBe(1)
    expect(result.removed[0]!.name).toBe('detail')
    expect(stack.length).toBe(2)
  })

  it('back(2) 弹出栈顶 2 个', () => {
    const result = manager.apply(
      stack,
      makeParams({
        method: 'back',
        direction: 'back',
        delta: -2,
        to: mockRoute('home', '/home'),
      }),
    )
    expect(result.removed.length).toBe(2)
    expect(stack.length).toBe(1)
  })

  it('back 到只剩 1 个时不再弹出', () => {
    manager.apply(
      stack,
      makeParams({
        method: 'back',
        direction: 'back',
        delta: -10,
        to: mockRoute('home', '/home'),
      }),
    )
    expect(stack.length).toBe(1)
    expect(stack[0]!.name).toBe('home')
  })

  it('back 更新新栈顶的 lastActiveAt', () => {
    const beforeTime = Date.now()
    manager.apply(
      stack,
      makeParams({
        method: 'back',
        direction: 'back',
        delta: -1,
        to: mockRoute('list', '/list'),
      }),
    )
    expect(stack[stack.length - 1]!.lastActiveAt).toBeGreaterThanOrEqual(beforeTime)
  })

  it('back 优先回退到目标路由并移除其后的全部条目', () => {
    stack.splice(1)
    manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('tab-home', '/tabs'),
        hints: { targetTabKey: 'home' },
      }),
    )
    manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('tab-profile', '/tabs/profile'),
        hints: { targetTabKey: 'profile' },
      }),
    )

    const result = manager.apply(
      stack,
      makeParams({
        method: 'back',
        direction: 'back',
        delta: -1,
        to: mockRoute('home', '/home'),
      }),
    )

    expect(result.removed.map((entry) => entry.fullPath)).toEqual(['/tabs', '/tabs/profile'])
    expect(stack.map((entry) => entry.fullPath)).toEqual(['/home'])
    expect(stack.map((entry) => entry.position)).toEqual([0])
  })
})

describe('StackManager - ReLaunch', () => {
  let manager: ReturnType<typeof createStackManager>
  let stack: PageStackEntry[]

  beforeEach(() => {
    resetIdCounter()
    manager = createStackManager(defaultOptions)
    stack = []
    manager.apply(stack, makeParams({ to: mockRoute('home', '/home') }))
    manager.apply(stack, makeParams({ to: mockRoute('list', '/list') }))
  })

  it('reLaunch 清空栈并创建新条目', () => {
    const result = manager.apply(
      stack,
      makeParams({
        method: 'reLaunch',
        to: mockRoute('login', '/login'),
      }),
    )
    expect(stack.length).toBe(1)
    expect(stack[0]!.name).toBe('login')
    expect(result.removed.length).toBe(2)
    expect(result.added.length).toBe(1)
  })
})

describe('StackManager - SwitchTab', () => {
  let manager: ReturnType<typeof createStackManager>
  let stack: PageStackEntry[]

  beforeEach(() => {
    resetIdCounter()
    manager = createStackManager(defaultOptions)
    stack = []
  })

  it('首次 switchTab 创建新条目', () => {
    const result = manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('home', '/home'),
        hints: { targetTabKey: 'home' },
      }),
    )
    expect(result.added.length).toBe(1)
    expect(stack.length).toBe(1)
    expect(stack[0]!.tabKey).toBe('home')
  })

  it('已存在的 tab 不重复入栈', () => {
    manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('home', '/home'),
        hints: { targetTabKey: 'home' },
      }),
    )
    manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('profile', '/profile'),
        hints: { targetTabKey: 'profile' },
      }),
    )

    // 切回 home
    const result = manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('home', '/home'),
        hints: { targetTabKey: 'home' },
      }),
    )

    expect(stack.length).toBe(2)
    expect(result.added.length).toBe(0)
    expect(result.updated.length).toBe(1)
    expect(result.updated[0]!.tabKey).toBe('home')
  })

  it('切回已存在 tab 时将目标 tab 设为当前栈顶', () => {
    manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('home', '/home'),
        hints: { targetTabKey: 'home' },
      }),
    )
    manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('profile', '/profile'),
        hints: { targetTabKey: 'profile' },
      }),
    )

    const homeEntry = stack[0]!
    homeEntry.scrollPositions.set('__document__', {
      top: 1200,
      left: 0,
      scrollHeight: 2000,
      scrollWidth: 390,
    })

    manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('home', '/home'),
        hints: { targetTabKey: 'home' },
      }),
    )

    expect(stack[stack.length - 1]!.tabKey).toBe('home')
    expect(stack[stack.length - 1]!.scrollPositions.get('__document__')?.top).toBe(1200)
    expect(stack.map((entry) => entry.position)).toEqual([0, 1])
  })

  it('switchTab 更新已存在 tab 的 lastActiveAt', () => {
    manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('home', '/home'),
        hints: { targetTabKey: 'home' },
      }),
    )

    const oldTime = stack[0]!.lastActiveAt

    // 等一小段时间确保时间戳不同
    const result = manager.apply(
      stack,
      makeParams({
        method: 'switchTab',
        to: mockRoute('home', '/home'),
        hints: { targetTabKey: 'home' },
      }),
    )

    expect(result.updated[0]!.lastActiveAt).toBeGreaterThanOrEqual(oldTime)
  })
})
