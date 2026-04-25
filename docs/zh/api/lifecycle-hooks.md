# onPageShow / onPageHide

页面生命周期钩子，类似微信小程序的 `onShow` / `onHide`。

## onPageShow

页面显示时触发（首次挂载 + 从缓存恢复）。

```ts
function onPageShow(handler: PageShowHandler): void

type PageShowHandler = (ctx: PageShowContext) => void

interface PageShowContext {
  isFirstShow: boolean // 是否首次显示
  direction: NavigationDirection // 导航方向
  from: RouteLocationNormalizedLoaded | null // 来源路由
}
```

### 示例

```vue
<script setup lang="ts">
import { onPageShow } from '@bye_past/vue-keep'

onPageShow((ctx) => {
  if (ctx.isFirstShow) {
    // 首次加载，请求数据
    fetchData()
  } else {
    // 从缓存恢复（如从详情页返回）
    // ctx.direction === 'back'
    refreshList()
  }
})
</script>
```

## onPageHide

页面隐藏时触发（被缓存 + 被销毁）。

```ts
function onPageHide(handler: PageHideHandler): void

type PageHideHandler = (ctx: PageHideContext) => void

interface PageHideContext {
  direction: NavigationDirection // 导航方向
  to: RouteLocationNormalizedLoaded | null // 目标路由
}
```

### 示例

```vue
<script setup lang="ts">
import { onPageHide } from '@bye_past/vue-keep'

onPageHide((ctx) => {
  // 页面被隐藏时保存草稿
  saveDraft()
})
</script>
```

## 与 Vue 生命周期的关系

| Vue Keep                          | Vue 原生                        | 触发时机       |
| --------------------------------- | ------------------------------- | -------------- |
| `onPageShow` (isFirstShow: true)  | `onMounted`                     | 首次挂载       |
| `onPageShow` (isFirstShow: false) | `onActivated`                   | 从缓存恢复     |
| `onPageHide`                      | `onDeactivated` / `onUnmounted` | 被缓存或被销毁 |

`onPageShow` / `onPageHide` 的优势在于提供了导航上下文（方向、来源/目标路由），并且首次显示不会重复触发。
