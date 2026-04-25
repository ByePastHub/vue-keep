# 简介

## 什么是 Vue Keep

Vue Keep 是一个 Vue 3 页面缓存库，复刻微信小程序的页面栈体验。它通过接管 Vue Router 的导航行为，实现**前进刷新、返回保留状态和滚动位置**的移动端交互模式。

用 `<KeepRouterView>` 替换 `<router-view>`，即可获得完整的页面缓存能力。

## 解决什么问题

在传统 SPA 中，页面切换会销毁组件实例，导致：

- 从详情页返回列表页，列表滚动位置丢失
- 表单填写到一半跳转其他页面，返回后数据清空
- 长列表加载了大量数据，返回后需要重新请求

Vue Keep 通过页面栈管理解决这些问题：

| 操作                | 行为                             |
| ------------------- | -------------------------------- |
| 前进（push）        | 创建新页面实例，缓存当前页面     |
| 返回（back）        | 恢复缓存的页面实例，销毁当前页面 |
| 替换（replace）     | 销毁当前页面，创建新页面         |
| 重启（reLaunch）    | 清空所有缓存，创建新页面         |
| 切 Tab（switchTab） | 切换到 Tab 页面，保留 Tab 子栈   |

## 与原生 KeepAlive 的区别

Vue 内置的 `<KeepAlive>` 是一个通用的组件缓存方案，但用于页面缓存时存在局限：

| 特性         | KeepAlive                    | Vue Keep               |
| ------------ | ---------------------------- | ---------------------- |
| 缓存策略     | 基于组件名的 include/exclude | 基于页面栈的自动管理   |
| 导航方向感知 | 无                           | 自动识别前进/后退/替换 |
| 滚动恢复     | 需手动实现                   | 自动恢复               |
| LRU 淘汰     | 简单的 max 限制              | 支持 constCache 保护   |
| 页面通信     | 无                           | EventChannel           |
| 动画         | 需手动配置                   | 方向感知的内置预设     |

## 与微信小程序页面栈的对比

Vue Keep 的 API 设计参考了微信小程序的页面栈模型：

| 微信小程序          | Vue Keep                    |
| ------------------- | --------------------------- |
| `wx.navigateTo`     | `keepRouter.push`           |
| `wx.redirectTo`     | `keepRouter.replace`        |
| `wx.navigateBack`   | `keepRouter.back`           |
| `wx.reLaunch`       | `keepRouter.reLaunch`       |
| `wx.switchTab`      | `keepRouter.switchTab`      |
| `onShow` / `onHide` | `onPageShow` / `onPageHide` |
| `EventChannel`      | `useEventChannel`           |

## 特性列表

- 🗂 **页面栈管理** — 5 种导航方法，精确控制缓存生命周期
- 📜 **滚动恢复** — 自动检测容器，支持多容器和懒加载
- 🎬 **方向感知动画** — slide / fade / zoom 预设，自动切换方向
- 📡 **页面通信** — EventChannel 跨页面数据传递
- 🔒 **constCache** — 常驻缓存保护，不被 LRU 淘汰
- 🪆 **嵌套路由** — 多层 KeepRouterView 独立管理
- 🧩 **TypeScript** — 完整类型定义，声明合并扩展
- 📦 **轻量** — gzip < 5KB，Tree-shakable
- 🛠 **DevTools** — Vue DevTools 集成，可视化调试
