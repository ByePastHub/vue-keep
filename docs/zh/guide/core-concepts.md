# 核心概念

## 页面栈模型

Vue Keep 维护一个页面栈（Page Stack），类似浏览器的历史记录栈，但更精确地控制页面实例的创建和销毁。

```
初始状态:  [ Home ]

push /list: [ Home, List ]

push /detail/1: [ Home, List, Detail ]

back:       [ Home, List ]  ← Detail 被销毁，List 从缓存恢复

back:       [ Home ]        ← List 被销毁，Home 从缓存恢复
```

每个栈条目（`PageStackEntry`）包含：

- 唯一 ID
- 路由快照
- 滚动位置
- 缓存标记（constCache）
- 关联的 EventChannel

## 5 种导航方法

| 方法            | 栈操作   | 说明                             |
| --------------- | -------- | -------------------------------- |
| `push(to)`      | 入栈     | 创建新页面，缓存当前页面         |
| `replace(to)`   | 替换栈顶 | 销毁当前页面，创建新页面         |
| `back(delta?)`  | 出栈     | 销毁当前页面，恢复上一个缓存页面 |
| `reLaunch(to)`  | 清空重建 | 销毁所有缓存，创建新页面         |
| `switchTab(to)` | 切换 Tab | 切换到 Tab 页面，保留各 Tab 子栈 |

### push

```
栈: [ A, B ]
push(C)
栈: [ A, B, C ]  ← B 被缓存，C 是新实例
```

### replace

```
栈: [ A, B ]
replace(C)
栈: [ A, C ]  ← B 被销毁，C 是新实例
```

### back

```
栈: [ A, B, C ]
back()
栈: [ A, B ]  ← C 被销毁，B 从缓存恢复

back(2)
栈: [ A ]  ← B 被销毁，A 从缓存恢复
```

### reLaunch

```
栈: [ A, B, C ]
reLaunch(D)
栈: [ D ]  ← A、B、C 全部销毁
```

### switchTab

```
Tab 栈:
  home: [ Home, List ]
  cart: [ Cart ]

switchTab('cart')
激活 cart 栈: [ Cart ]
home 栈保留: [ Home, List ]
```

## 导航方向

每次导航都有一个方向（`NavigationDirection`）：

| 方向      | 触发条件                     |
| --------- | ---------------------------- |
| `forward` | push                         |
| `back`    | back、浏览器后退             |
| `none`    | replace、reLaunch、switchTab |

方向用于：

- 决定动画方向（slide-left vs slide-right）
- 决定是否恢复滚动位置（仅 back 时恢复）
- 传递给 `onPageShow` / `onPageHide` 回调

## KeepAlive include 同步

Vue Keep 内部使用 Vue 原生的 `<KeepAlive>` 组件，通过动态维护 `include` 数组来控制哪些组件被缓存：

```
push /list → include: ['Home', 'List']
push /detail → include: ['Home', 'List', 'Detail']
back → include: ['Home', 'List']  ← 'Detail' 被移除
```

这意味着组件必须有 `name`。Vue Keep 会自动为路由懒加载组件设置 name（通过 `setupNameResolver`）。

## constCache 保护

标记为 `constCache` 的页面不会被 LRU 淘汰：

```ts
// 方式 1：路由 meta
{
  path: '/',
  component: Home,
  meta: { keep: { constCache: true } }
}

// 方式 2：导航时指定
keepRouter.push('/important-page', { constCache: true })
```

当栈深度超过 `max` 时，LRU 淘汰策略会跳过 `constCache` 页面，优先淘汰最久未访问的普通页面。

## LRU 淘汰策略

当缓存页面数量超过 `max` 限制时，Vue Keep 使用 LRU（Least Recently Used）策略淘汰页面：

1. 按 `lastActiveAt` 时间戳排序
2. 跳过 `constCache: true` 的页面
3. 淘汰最久未访问的页面
4. 可通过 `onBeforeEvict` 钩子拦截淘汰

```ts
createKeepRouter({
  router,
  max: 10,
  onBeforeEvict(entry) {
    // 返回 false 阻止淘汰
    if (entry.name === 'ImportantPage') return false
  },
})
```
