# 动画

## 内置预设

Vue Keep 提供三种方向感知的动画预设：

| 预设    | 前进效果 | 后退效果 |
| ------- | -------- | -------- |
| `slide` | 从右滑入 | 从左滑入 |
| `fade`  | 淡入     | 淡入     |
| `zoom`  | 放大进入 | 缩小进入 |

### 全局配置

```ts
createKeepRouter({
  router,
  transition: 'slide', // 'slide' | 'fade' | 'zoom'
})
```

### 引入 CSS

```ts
import '@bye_past/vue-keep/animations.css'
```

## 无方向导航

`replace`、`reLaunch`、`switchTab` 等导航方向为 `none` 时，内置预设不会播放页面过渡动画。若自定义 `TransitionConfig.name` 返回空字符串，Vue Keep 会直接渲染页面内容，不创建空的 `Transition` 包裹。

## 固定元素

内置动画会在 enter / leave 阶段自动冻结页面内 `position: fixed` 元素的当前视口位置，避免头部、底栏、悬浮按钮等固定元素因动画容器 transform 改变定位上下文而闪烁或掉到底部。业务组件无需添加额外标记。

## 单个容器配置

```vue
<KeepRouterView :transition="'fade'" />
```

## 自定义动画

### 使用 TransitionConfig

```ts
createKeepRouter({
  router,
  transition: {
    name: (direction) => `my-${direction}`,
    mode: 'out-in',
    duration: 300,
  },
})
```

### 自定义 CSS

```css
/* 前进动画 */
.my-forward-enter-active,
.my-forward-leave-active {
  transition: all 0.3s ease;
}
.my-forward-enter-from {
  transform: translateX(100%);
}
.my-forward-leave-to {
  transform: translateX(-30%);
}

/* 后退动画 */
.my-back-enter-active,
.my-back-leave-active {
  transition: all 0.3s ease;
}
.my-back-enter-from {
  transform: translateX(-100%);
}
.my-back-leave-to {
  transform: translateX(30%);
}
```

## 禁用动画

```ts
// 全局禁用
createKeepRouter({
  router,
  transition: false,
})

// 单个容器禁用
<KeepRouterView :transition="false" />
```

## 首屏跳过

默认情况下，首次渲染不播放动画（`disableFirstTransition: true`）。可以关闭：

```ts
createKeepRouter({
  router,
  transition: 'slide',
  disableFirstTransition: false, // 首屏也播放动画
})
```

## 无障碍

内置 CSS 预设包含 `prefers-reduced-motion` 媒体查询，当用户系统设置了减少动画时，自动禁用过渡效果：

```css
@media (prefers-reduced-motion: reduce) {
  /* 所有动画时长设为 0 */
}
```
