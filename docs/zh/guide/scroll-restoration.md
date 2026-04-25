# 滚动恢复

## 自动恢复机制

Vue Keep 在页面被缓存时自动保存滚动位置，返回时自动恢复。恢复采用三层防御策略：

1. **nextTick** — 立即尝试恢复
2. **ResizeObserver** — 等待 DOM 高度稳定后恢复（处理懒加载图片等场景）
3. **超时兜底** — 600ms 后强制恢复

### 默认行为

- `back` 导航：恢复保存的滚动位置
- `push` / `replace` 导航：滚动到顶部
- `reLaunch` / `switchTab`：滚动到顶部

## 滚动行为策略

```ts
createKeepRouter({
  router,
  scrollBehavior: 'auto', // 默认值
})
```

| 策略       | 说明                      |
| ---------- | ------------------------- |
| `'auto'`   | back 恢复，其他滚动到顶部 |
| `'always'` | 所有方向都恢复            |
| `'none'`   | 禁用滚动恢复              |
| `function` | 自定义函数                |

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
