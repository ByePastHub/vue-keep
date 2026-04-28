import { createApp, defineComponent, h, type App } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'
import { afterEach, describe, expect, it } from 'vitest'
import { createKeepRouter } from '../plugin'
import { getKeepRouter, useKeepRouter } from './useKeepRouter'

const EmptyPage = defineComponent({
  name: 'EmptyPage',
  setup() {
    return () => h('div')
  },
})

let mountedApps: App[] = []

/** 创建测试用路由实例 */
function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'home', component: EmptyPage },
      { path: '/login', name: 'login', component: EmptyPage },
    ],
  })
}

/** 卸载测试应用并清理宿主节点 */
function cleanupMountedApps(): void {
  for (const app of mountedApps) {
    app.unmount()
  }
  mountedApps = []
  document.body.innerHTML = ''
}

afterEach(() => {
  cleanupMountedApps()
})

describe('useKeepRouter', () => {
  it('createKeepRouter 返回可安装且可直接导航的实例', () => {
    const router = createTestRouter()
    const keepRouter = createKeepRouter({ router })

    expect(typeof keepRouter.install).toBe('function')
    expect(typeof keepRouter.push).toBe('function')
    expect(typeof keepRouter.replace).toBe('function')
    expect(typeof keepRouter.back).toBe('function')
  })

  it('组件外在 app.use 后可以直接获取默认实例', () => {
    const router = createTestRouter()
    const keepRouter = createKeepRouter({ router })
    const app = createApp(EmptyPage)

    app.use(router)
    app.use(keepRouter)

    expect(useKeepRouter()).toBe(keepRouter)
    expect(getKeepRouter()).toBe(keepRouter)

    const host = document.createElement('div')
    document.body.appendChild(host)
    app.mount(host)
    mountedApps.push(app)
  })

  it('组件内优先从 provide 注入中获取实例', () => {
    const router = createTestRouter()
    const keepRouter = createKeepRouter({ router })
    let injectedKeepRouter = null as ReturnType<typeof useKeepRouter> | null

    const KeepRoot = defineComponent({
      name: 'KeepRoot',
      setup() {
        injectedKeepRouter = useKeepRouter()
        return () => h('div')
      },
    })
    const app = createApp(KeepRoot)
    const host = document.createElement('div')

    app.use(router)
    app.use(keepRouter)
    document.body.appendChild(host)
    app.mount(host)
    mountedApps.push(app)

    expect(injectedKeepRouter).toBe(keepRouter)
  })

  it('应用卸载后清理组件外默认实例', () => {
    const router = createTestRouter()
    const keepRouter = createKeepRouter({ router })
    const app = createApp(EmptyPage)
    const host = document.createElement('div')

    app.use(router)
    app.use(keepRouter)
    document.body.appendChild(host)
    app.mount(host)

    expect(getKeepRouter()).toBe(keepRouter)

    app.unmount()
    document.body.innerHTML = ''

    expect(() => getKeepRouter()).toThrow('app.use(createKeepRouter(...))')
  })

  it('组件外在插件安装前调用会抛出明确错误', () => {
    expect(() => useKeepRouter()).toThrow('app.use(createKeepRouter(...))')
  })
})
