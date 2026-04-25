# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

`@bye_past/vue-keep` 2.0 是一个 Vue 3 页面缓存库，复刻微信小程序页面栈体验 —— 前进刷新、返回保留状态和滚动位置。当前版本 v2.0.0-alpha.0。peer 依赖 `vue ^3.4.0` 和 `vue-router ^4.2.0`，包体积红线 gzip < 5KB。

## 工程结构

pnpm monorepo（pnpm@10.33.2）：

- `packages/core` — 核心库 `@bye_past/vue-keep`（tsup 构建 ESM + CJS + .d.ts，CSS 通过 `./animations.css` 子路径暴露）
- `packages/devtools` — DevTools 插件 `@bye_past/vue-keep-devtools`（占位）
- `playground/basic`、`playground/ecommerce`、`playground/showcase` — 示例项目
- `docs/` — VitePress 文档（中英双语 `zh/`、`en/`）；`docs/tasks/` 是分阶段实现任务文档
- `PRD.md`、`AGENTS.md`、`CONTRIBUTING.md` — 产品需求、贡献规范

两个包通过 Changesets linked 策略同步版本。

## 常用命令

根目录：

- `pnpm build` — 构建 `packages/*`（tsup）
- `pnpm test` — 跑 `packages/*` 的测试（vitest run）
- `pnpm typecheck` — 全 workspace TypeScript 检查
- `pnpm lint` — ESLint（带 `--cache`）
- `pnpm size` — core 包体积检查（size-limit，目标 gzip < 5KB）
- `pnpm dev` — watch 构建 core
- `pnpm dev:showcase` / `pnpm dev:playground` — 启动示例
- `pnpm docs:dev` / `pnpm docs:build` — VitePress 文档
- `pnpm test:e2e` — ecommerce playground 的 E2E
- `pnpm changeset` / `pnpm release` — 变更集 / 构建并发布

只跑 core 测试：`pnpm -F @bye_past/vue-keep test`
跑单个测试文件：`pnpm -F @bye_past/vue-keep exec vitest run src/scroll/restore.test.ts`

提交时 husky + lint-staged 会自动跑 `eslint --fix` 和 `prettier --write`，commitlint 走 conventional 规范（项目历史习惯带 emoji，例如 `fix: :bug: ...`、`feat: :sparkles: ...`）。

## 核心架构

插件入口 `createKeepRouter(options)` 返回 Vue Plugin，install 时按顺序：

1. `resolveOptions` 解析配置
2. `createCoreStore` + `createStackManager` + `IntentTracker` 初始化状态
3. `bindRouter` 绑定 Vue Router 的 `beforeEach`/`afterEach`，并在导航前后做滚动捕获/恢复编排（参见下文）
4. `setupNameResolver` 确保路由组件有稳定的组件名（KeepAlive `include` 依赖名称匹配）
5. `createKeepMethods` 生成导航方法集（push/replace/back/reLaunch/switchTab）
6. provide 注入 store、options、keepRouter 到 app

关键模块职责：

- **CoreStore**（`store/core-store.ts`）— 页面栈状态、导航守卫、监听器，提供 `prepareNavigation` / `commitNavigation` 两阶段提交
- **StackManager**（`store/stack-manager.ts`）— 栈操作（push/replace/back/reLaunch/switchTab），LRU 淘汰（跳过 constCache）
- **IntentTracker**（`router/intent-tracker.ts`）— 跟踪用户编程式导航的意图（cache/constCache/destroy/metadata/channelId/targetTabKey）
- **NavigationInfo**（`router/navigation-info.ts`）— 消费 Vue Router 4.2+ 的 `history.listen` 解析方向 + delta，结合 intent 推断 method
- **KeepRouterView**（`components/KeepRouterView.ts`）— 替代 `<router-view>` 的核心组件，管理 KeepAlive `include` 列表，按 depth 计算 `containerId` 支持嵌套
- **KeepTransition**（`components/KeepTransition.ts`）— 方向感知动画包装
- **KeepPageShell** + **KeepAliveBridge**（`components/`）— 页面包装组件 + KeepAlive include 计算
- **ContainerResolver**（`router/container-resolver.ts`）— 嵌套路由容器解析
- **persistence**（`store/persistence.ts`）— 状态持久化（`createKeepState`/`readKeepState`/`injectInitialState`），通过 `history.state` 对齐刷新场景
- **scroll**（`scroll/`）— `captureScrollPositions` / `restoreScrollPositions`（同步立即应用 + nextTick + ResizeObserver + 600ms 兜底；模块内串行——新恢复启动时会中断上一次仍在跑的恢复，防止旧 observer/timer 闭包用旧 positions 覆盖新页面）
- **event-channel**（`event-channel/`）— 页面间数据回传通道（`channel.ts` + `registry.ts`）
- **animation**（`animation/`）— 内置 slide/fade/zoom 预设 + direction-class 工具

Composables：`useKeepRouter`、`usePageCache`、`useNavigationDirection`、`usePageStack`、`useEventChannel`、`useScrollRestoration`、`onPageShow`、`onPageHide`

公共 API 仅通过 `packages/core/src/index.ts` 导出；不要直接暴露 router 或 store 内部类型。

## 代码风格

- Prettier：无分号、单引号、尾逗号、100 字符宽度、2 空格缩进
- ESLint：`@typescript-eslint/no-explicit-any` 关闭，未使用变量用 `_` 前缀，启用 `prefer-const` + `eqeqeq smart`
- TypeScript strict + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes` + `verbatimModuleSyntax`
- Vue：`v-model` 默认使用 `defineModel`；前端异步统一 `async`/`await`；TS 字段注释用行内中文
- 测试环境：vitest + happy-dom，全局定义 `__DEV__: true`
- 测试文件命名 `*.test.ts`，可与源码同目录或放在 `packages/core/src/__tests__/` 下；构建产物（`dist/`）和 devtools 不计入覆盖率
- 文件命名走 kebab-case（如 `keep-scroll-behavior.ts`、`container-resolver.ts`）

## CI

GitHub Actions：push/PR 到 master 触发 typecheck → lint → test → build → size check。Release 走 Changesets 自动发布。
