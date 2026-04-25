# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

`@bye_past/vue-keep` 2.0 是一个 Vue 3 页面缓存库，复刻微信小程序页面栈体验 —— 前进刷新、返回保留状态和滚动位置。当前版本 v2.0.0-alpha.0。

## 工程结构

pnpm monorepo（pnpm@10.33.2）：

- `packages/core` — 核心库 `@bye_past/vue-keep`
- `packages/devtools` — DevTools 插件 `@bye_past/vue-keep-devtools`（尚未实现，占位）
- `docs/tasks/` — 分阶段实现任务文档（00-16）
- `playground/*` — 示例项目

两个包通过 Changesets linked 策略同步版本。

## 常用命令

- `pnpm build` — 构建所有包（tsup，ESM + CJS + .d.ts）
- `pnpm test` — 运行所有测试（vitest run）
- `pnpm -F @bye_past/vue-keep test` — 只跑 core 测试
- `pnpm typecheck` — TypeScript 类型检查
- `pnpm lint` — ESLint 检查（带缓存）
- `pnpm dev` — watch 模式构建 core
- `pnpm size` — 检查 core 包体积（目标 gzip < 5KB）
- `pnpm changeset` — 创建变更集
- `pnpm release` — 构建 + changeset publish

运行单个测试文件：`pnpm -F @bye_past/vue-keep exec vitest run src/__tests__/stack-manager.test.ts`

## 核心架构

插件入口 `createKeepRouter(options)` 返回 Vue Plugin，install 时按顺序：

1. `resolveOptions` 解析配置
2. `createCoreStore` + `createStackManager` + `IntentTracker` 初始化状态
3. `bindRouter` 绑定 Vue Router 的 beforeEach/afterEach 钩子
4. `setupNameResolver` 确保路由组件有稳定的组件名（KeepAlive 依赖 include 匹配名称）
5. `createKeepMethods` 生成导航方法集（push/replace/back/reLaunch/switchTab）
6. provide 注入 store、options、keepRouter 到 app

关键模块职责：

- **CoreStore**（`store/core-store.ts`）— 页面栈状态、导航守卫、监听器
- **StackManager**（`store/stack-manager.ts`）— 栈操作（push/replace/back/reLaunch/switchTab），LRU 淘汰
- **IntentTracker**（`router/intent-tracker.ts`）— 跟踪用户导航意图（cache/constCache/destroy/metadata）
- **NavigationInfo**（`router/navigation-info.ts`）— 从 router history 解析导航方向和方法
- **KeepRouterView**（`components/KeepRouterView.ts`）— 替代 `<router-view>` 的核心组件，管理 KeepAlive include 列表
- **KeepPageShell**（`components/KeepPageShell.ts`）— 页面包装组件
- **ContainerResolver**（`router/container-resolver.ts`）— 嵌套路由容器解析
- **persistence**（`store/persistence.ts`）— 状态持久化（createKeepState/readKeepState）

Composables：`useKeepRouter`、`usePageCache`、`useNavigationDirection`、`usePageStack`

## 代码风格

- Prettier：无分号、单引号、尾逗号、100 字符宽度、2 空格缩进
- ESLint：`@typescript-eslint/no-explicit-any` 关闭，未使用变量用 `_` 前缀
- TypeScript strict 模式 + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `verbatimModuleSyntax`
- 测试环境：happy-dom，全局定义 `__DEV__: true`
- 测试文件放在 `packages/core/src/__tests__/` 下

## CI

GitHub Actions：push/PR 到 master 触发 typecheck → lint → test → build → size check。Release 走 Changesets 自动发布。
