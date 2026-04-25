# vue-keep 2.0 任务总索引

> 本目录包含 vue-keep 2.0 重构的全部任务文档，按模块拆分。每个模块内的任务按顺序执行，模块间的依赖关系见下方。

## 模块列表

| 编号 | 模块                                              | 阶段      | 预估 | 说明                                                           |
| ---- | ------------------------------------------------- | --------- | ---- | -------------------------------------------------------------- |
| 00   | [工程骨架](./00-project-setup.md)                 | Phase 1   | 1d   | monorepo、tsconfig、pnpm、changeset、CI                        |
| 01   | [核心类型与常量](./01-types-and-constants.md)     | Phase 1   | 0.5d | 所有 public/internal 类型定义、枚举、Symbol                    |
| 01A  | [跨模块架构契约](./01a-cross-module-contracts.md) | Phase 1   | 0.5d | 统一导航意图、容器解析、页面壳、tab 身份规则                   |
| 02   | [核心 Store](./02-core-store.md)                  | Phase 1   | 1d   | shallowReactive 全局状态、id 分配器                            |
| 03   | [栈管理器](./03-stack-manager.md)                 | Phase 1   | 2d   | push/replace/back/reLaunch/switchTab/LRU/destroy               |
| 04   | [路由绑定](./04-router-binding.md)                | Phase 1   | 2d   | history.listen、beforeEach/afterEach、方向判定、意图追踪       |
| 05   | [组件名解析](./05-name-resolver.md)               | Phase 1   | 0.5d | 异步组件 name 注入、包装组件策略                               |
| 06   | [插件工厂](./06-plugin-factory.md)                | Phase 1   | 0.5d | createKeepRouter、app.use install                              |
| 07   | [KeepRouterView 组件](./07-keep-router-view.md)   | Phase 1   | 1.5d | 主组件 TSX、slot 作用域、嵌套 depth                            |
| 08   | [Composables](./08-composables.md)                | Phase 2   | 2d   | useKeepRouter/usePageCache/useNavigationDirection/usePageStack |
| 09   | [滚动恢复](./09-scroll-restoration.md)            | Phase 2   | 2d   | 容器发现、抓取、恢复、ResizeObserver                           |
| 10   | [动画系统](./10-animation-system.md)              | Phase 2   | 1.5d | CSS 预设、KeepTransition、方向感知                             |
| 11   | [页面数据回传](./11-event-channel.md)             | Phase 2   | 1.5d | EventChannel、registry、与 push 结合                           |
| 12   | [生命周期 Hook](./12-lifecycle-hooks.md)          | Phase 2   | 0.5d | onPageShow/onPageHide                                          |
| 13   | [DevTools 插件](./13-devtools.md)                 | Phase 3   | 2d   | timeline、inspector、手动销毁                                  |
| 14   | [构建与发布](./14-build-and-publish.md)           | Phase 1-3 | 1.5d | tsup、api-extractor、exports、size-limit                       |
| 15   | [测试](./15-testing.md)                           | Phase 1-3 | 4d   | 单元测试、组件测试、E2E、视觉回归                              |
| 16   | [文档与示例](./16-docs-and-demos.md)              | Phase 3   | 5d   | VitePress、电商 Demo、Playground、动画画廊、迁移指南           |

## 依赖关系图

```
00 工程骨架
 └─► 01 类型与常量
      └─► 01A 跨模块架构契约
           └─► 02 核心 Store
                ├─► 03 栈管理器
                │    └─► 04 路由绑定
                │         ├─► 05 组件名解析
                │         └─► 06 插件工厂
                │              └─► 07 KeepRouterView 组件
                │                   ├─► 08 Composables
                │                   ├─► 09 滚动恢复
                │                   ├─► 10 动画系统
                │                   ├─► 11 页面数据回传
                │                   └─► 12 生命周期 Hook
                └─► 13 DevTools（可独立开发）

14 构建与发布 ← 依赖 00，贯穿所有阶段
15 测试 ← 依赖对应模块，贯穿所有阶段
16 文档与示例 ← 依赖 07+，Phase 3 集中交付
```

## 阶段划分

### Phase 1 — MVP Alpha（模块 00-07 + 01A + 14 基础 + 15 单元测试）

验收：`keepRouter.push → 返回，详情页 onActivated 触发，列表页仍在 DOM`

### Phase 2 — Beta 功能齐全（模块 08-12 + 15 E2E）

验收：滚动恢复、动画、eventChannel、嵌套路由、onPageShow 全部可用

### Phase 3 — RC（模块 13 + 14 完善 + 16）

验收：DevTools 面板可见、文档站可访问、电商 Demo 完整可跑

### Phase 4 — 正式发布

验收：npm publish 成功、StackBlitz 模板可用、awesome-vue PR 提交

## 任务状态标记

每个任务使用以下标记：

- `[ ]` 未开始
- `[~]` 进行中
- `[x]` 已完成
- `[!]` 阻塞/有问题
