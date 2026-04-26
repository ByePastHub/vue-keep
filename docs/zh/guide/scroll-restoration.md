# 滚动恢复

## 自动恢复机制

Vue Keep 在页面被缓存时自动保存滚动位置，返回时自动恢复。恢复采用多层防御策略：

1. **同步恢复** — 在恢复流程开始时立即应用位置，避免先绘制顶部一帧
2. **nextTick** — DOM 更新后再次恢复
3. **ResizeObserver** — 等待 DOM 高度稳定后恢复（处理懒加载图片等场景）
4. **超时兜底** — 600ms 后强制恢复

对于 document 主滚动，Vue Keep 会在恢复前临时预留文档高度，防止浏览器因页面高度不足把目标滚动值夹到顶部。

### 默认行为

- `back` 导航：恢复保存的滚动位置
- `push` / `replace` 导航：滚动到顶部
- `reLaunch`：滚动到顶部
- `switchTab`：由 Vue Keep 接管，不交给 Vue Router 原生滚动

## 滚动行为策略

```ts
createKeepRouter({
  router,
  scrollBehavior: 'auto', // 默认值
})
```

| 策略       | 说明                                                                    |
| ---------- | ----------------------------------------------------------------------- |
| `'auto'`   | back 恢复，push/replace/reLaunch 滚动到顶部，switchTab 由 Vue Keep 接管 |
| `'always'` | 所有方向都恢复                                                          |
| `'none'`   | 禁用滚动恢复                                                            |
| `function` | 自定义函数                                                              |

### 自定义滚动行为

```ts
createKeepRouter({
  router,
  scrollBehavior(to, from, direction, savedPositions) {
    if (direction === 'back') {
      return false // 使用保存的位置
    }
    return { top: 0 }
  },
})
```

## 刷新滚动位置

Vue Keep 安装时会配置浏览器原生 `history.scrollRestoration`。非 iOS WebKit 环境会设置为 `manual`，避免浏览器在刷新后自动回到刷新前的滚动位置；iOS WebKit 会保持 `auto`，避免系统级返回手势预览上一页时出现空白。

当检测到当前页面是刷新进入时，Vue Keep 会在初始化完成后主动滚动到顶部。页面缓存状态不会跨刷新保留，刷新更接近一次冷启动。

## 自定义滚动容器

默认情况下，Vue Keep 自动检测以下滚动容器：

1. `document.scrollingElement`（页面主滚动）
2. 带 `data-scroll-container` 属性的元素

### 标记滚动容器

```html
<div data-scroll-container="product-list" style="overflow: auto; height: 400px">
  <!-- 长列表内容 -->
</div>
```

`data-scroll-container` 的值用作容器的唯一标识，确保恢复到正确的容器。

### 通过 Props 指定

```vue
<KeepRouterView :scroll-containers="['.my-scroll-area', '#sidebar']" />
```

## createKeepScrollBehavior

如果你需要与 Vue Router 的 `scrollBehavior` 配合使用：

```ts
import { createKeepScrollBehavior } from '@bye_past/vue-keep'

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: createKeepScrollBehavior({
    fallback: () => ({ top: 0 }),
  }),
})
```

## useScrollRestoration

在组件内手动控制滚动恢复：

```vue
<script setup lang="ts">
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

// 手动保存当前滚动位置
scroll.save()

// 手动恢复
scroll.restore()

// 暂停自动恢复
scroll.pause()

// 恢复自动恢复
scroll.resume()

// 注册额外的滚动容器
scroll.registerContainer('.dynamic-list')
</script>
```

## 已知限制

- `switchTab` 在 document 主滚动、短页面与长页面反复切换时仍可能出现可见闪烁；当前版本已避免 Vue Router 和浏览器原生滚动干预，但该场景仍需后续继续优化。
