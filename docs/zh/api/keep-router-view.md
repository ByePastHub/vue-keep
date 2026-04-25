# KeepRouterView

替代 `<router-view>` 的缓存路由视图组件。

## Props

| Prop               | 类型                                            | 默认值   | 说明                                   |
| ------------------ | ----------------------------------------------- | -------- | -------------------------------------- |
| `max`              | `number`                                        | —        | 当前容器的页面栈最大深度，覆盖全局 max |
| `cacheMax`         | `number`                                        | —        | KeepAlive 缓存实例上限                 |
| `exclude`          | `NameMatcher`                                   | —        | 当前容器的排除规则                     |
| `include`          | `NameMatcher`                                   | —        | 当前容器的白名单规则                   |
| `containerId`      | `string`                                        | 自动生成 | 手动指定容器 ID                        |
| `transition`       | `false \| TransitionPreset \| TransitionConfig` | 继承全局 | 当前容器的动画配置                     |
| `scrollContainers` | `string[]`                                      | —        | 额外的滚动容器 CSS 选择器              |

## 基本用法

```vue
<template>
  <KeepRouterView />
</template>
```

## 带 Props

```vue
<template>
  <KeepRouterView :max="5" :transition="'fade'" :scroll-containers="['.my-list']" />
</template>
```

## 嵌套使用

```vue
<!-- 父级路由组件 -->
<template>
  <div class="layout">
    <header>Header</header>
    <KeepRouterView />
    <footer>Footer</footer>
  </div>
</template>
```

嵌套的 `<KeepRouterView>` 会自动递增 depth，渲染对应层级的路由组件。

## 禁用动画

```vue
<KeepRouterView :transition="false" />
```
