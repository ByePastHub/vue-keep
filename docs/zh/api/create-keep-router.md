# createKeepRouter

创建 Vue Keep 路由增强实例。

## 函数签名

```ts
function createKeepRouter(options: KeepOptions): KeepRouterPlugin
```

## KeepOptions

| 属性                     | 类型                                            | 默认值         | 说明                                      |
| ------------------------ | ----------------------------------------------- | -------------- | ----------------------------------------- |
| `router`                 | `Router`                                        | —              | **必传**，Vue Router 实例                 |
| `max`                    | `number \| Record<number, number>`              | `10`           | 页面栈最大深度。传对象时按 depth 分别限制 |
| `exclude`                | `NameMatcher`                                   | —              | 全局排除规则，匹配的页面不缓存            |
| `include`                | `NameMatcher`                                   | —              | 全局白名单，仅匹配的页面缓存              |
| `scrollBehavior`         | `ScrollBehaviorStrategy`                        | `'auto'`       | 滚动恢复策略                              |
| `persist`                | `boolean`                                       | `true`         | 是否启用刷新后 history.state 标识恢复     |
| `transition`             | `false \| TransitionPreset \| TransitionConfig` | `'slide'`      | 动画配置                                  |
| `devtools`               | `boolean`                                       | `false`        | 是否启用 Vue DevTools 集成                |
| `namespace`              | `string`                                        | `'[vue-keep]'` | 日志命名空间                              |
| `disableFirstTransition` | `boolean`                                       | `true`         | 是否跳过首屏动画                          |
| `onBeforeEvict`          | `(entry: PageStackEntry) => boolean \| void`    | —              | LRU 淘汰前钩子，返回 false 阻止淘汰       |

## 返回值

返回一个可通过 `app.use()` 安装的 `KeepRouter` 实例。安装后会：

1. 配置浏览器原生 `history.scrollRestoration`，非 iOS WebKit 使用 `manual`，iOS WebKit 保持 `auto` 以兼容系统返回快照
2. 注册 `<KeepRouterView>` 全局组件
3. 注入 `$keepRouter` 全局属性
4. 提供 `KEEP_STORE_KEY`、`KEEP_OPTIONS_KEY`、`KEEP_ROUTER_KEY` 等注入键
5. 将当前实例登记为组件外默认实例，供 `useKeepRouter()` / `getKeepRouter()` 在普通 TS 模块中使用

```ts
interface KeepRouterPlugin extends KeepRouter {
  install(app: App): void // 安装到 Vue 应用
}
```

## 示例

```ts
import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import { createKeepRouter } from '@bye_past/vue-keep'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    /* ... */
  ],
})

const keepRouter = createKeepRouter({
  router,
  max: 15,
  transition: 'slide',
  scrollBehavior: 'auto',
  devtools: import.meta.env.DEV,
})

const app = createApp(App)
app.use(router)
app.use(keepRouter)
app.mount('#app')
```

如果在请求拦截器、工具模块等组件外场景中导航，确保调用发生在 `app.use(keepRouter)` 之后：

```ts
import { useKeepRouter } from '@bye_past/vue-keep'

async function goLogin() {
  const keepRouter = useKeepRouter()
  await keepRouter.push('/login')
}
```
