# Repository Guidelines

## 项目结构与模块组织

本仓库是 `@bye_past/vue-keep` 的 pnpm monorepo。核心库代码位于 `packages/core/src`，按能力拆分为 `components`、`composables`、`router`、`scroll`、`store`、`utils`、`animation`、`event-channel` 和 `devtools`。测试文件使用 `*.test.ts`，可与源码同目录放置，也可放在 `packages/core/src/__tests__`。文档位于 `docs`，示例应用位于 `playground/basic`、`playground/ecommerce` 和 `playground/showcase`。

## 构建、测试与开发命令

请在仓库根目录使用 pnpm 10.x：

- `pnpm install`：安装 workspace 依赖。
- `pnpm dev`：监听并构建 `packages/core`。
- `pnpm build`：构建 `packages/*` 下的所有包。
- `pnpm test`：运行所有包的测试。
- `pnpm typecheck`：运行 TypeScript 类型检查。
- `pnpm lint`：运行 ESLint。
- `pnpm docs:dev`：启动本地 VitePress 文档。
- `pnpm dev:playground` / `pnpm dev:showcase`：启动示例应用。

## 编码风格与命名约定

使用 TypeScript、Vue 3 和 ESM。格式遵循 Prettier：两空格缩进、无分号、单引号、尾随逗号、单行 100 字符。Vue `v-model` 默认使用 `defineModel`。前端异步操作统一使用 `async` / `await`。每个函数都需要添加简洁的中文用途注释，代码注释使用中文。

TypeScript 字段注释采用行内中文注释：

```ts
interface PageQuery {
  pageNum: number // 页码
  pageSize: number // 每页数量
}
```

文件命名应清晰描述职责，例如 `keep-scroll-behavior.ts`、`container-resolver.ts` 和 `*.test.ts`。除非与现有集成边界一致，否则避免使用 `any`。

## 测试规范

核心包使用 Vitest 和 `happy-dom`，配置见 `packages/core/vitest.config.ts`。测试文件需匹配 `packages/core/src/**/*.test.ts`。涉及路由缓存、滚动恢复、栈管理、持久化或公开 composable 的行为变更时，必须补充或更新测试。提交前运行 `pnpm test`；仅验证核心包时运行 `pnpm -F @bye_past/vue-keep test`。

## 提交与 Pull Request 规范

历史提交采用 conventional 风格并带 emoji 标记，例如 `feat: :sparkles: 添加...`、`fix: :bug: 修复...`、`test: :white_check_mark: 添加...`、`release: :rocket: v1.2.1`。每个提交聚焦一个变更。

PR 需说明问题背景、实现摘要、测试结果，并在适用时关联 issue。涉及 UI、文档或 playground 的变更，应提供截图或复现步骤。影响发版说明的包变更需运行 `pnpm changeset` 添加 changeset。

## 安全与配置提示

不要提交 `dist`、`coverage`、`node_modules` 等生成产物。公共 API 应通过 `packages/core/src/index.ts` 导出；除非明确支持，否则不要暴露内部 router 或 store 类型。
