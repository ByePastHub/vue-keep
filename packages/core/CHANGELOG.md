# @bye_past/vue-keep

## 2.0.0-alpha.5

### Minor Changes

- 8330604: 新增 `getKeepRouter()` 与组件外 `useKeepRouter()` 支持，`createKeepRouter` 返回类型升级为 `KeepRouterPlugin`，可在纯 JS/TS 文件中直接访问导航方法。
- f21acb6: 新增 `@bye_past/vue-keep/auto-imports` 子入口，提供 `unplugin-auto-import` 可直接使用的自动导入 preset。

### Patch Changes

- a02b201: 修复 iOS 微信内置浏览器原生返回时返回动画被跳过的问题。
