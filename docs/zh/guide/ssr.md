# SSR

## SSR 安全

Vue Keep 的所有浏览器 API 调用都有 SSR 安全检查。在服务端渲染时：

- 不访问 `window`、`document`、`history`
- 不注册 `ResizeObserver`
- 滚动相关功能自动跳过
- 页面栈不会在服务端初始化

## Nuxt 3 集成

```ts
// plugins/vue-keep.client.ts
import { createKeepRouter } from '@bye_past/vue-keep'
import '@bye_past/vue-keep/animations.css'

export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()

  const keepRouter = createKeepRouter({
    router,
    transition: 'slide',
    scrollBehavior: 'auto',
  })

  nuxtApp.vueApp.use(keepRouter)
})
```

注意文件名以 `.client.ts` 结尾，确保只在客户端执行。

## 注意事项

- Vue Keep 是纯客户端库，不影响 SSR 的 HTML 输出
- 页面栈状态在客户端 hydration 后才开始管理
- 如果使用 `persist: true`，刷新恢复依赖浏览器 `history.state` 标识，仅在客户端可用
- DevTools 集成仅在客户端生效
