# 模块 00：工程骨架搭建

> 阶段：Phase 1 | 预估：1 天 | 前置依赖：无 | 状态：✅ 已完成

## 目标

搭建完整的 pnpm monorepo 工程骨架，包括 TypeScript 配置、代码规范、Git 钩子、CI 流水线、changeset 版本管理。完成后所有后续模块可以在此骨架上直接开发。

---

## 任务清单

### T00-01：初始化 monorepo 根目录

- [✅] 清除旧代码，在仓库根目录搭建 monorepo
- [✅] 创建根 `package.json`，设置 `"private": true`，`"packageManager": "pnpm@10.33.2"`
- [✅] 创建 `pnpm-workspace.yaml`
- [✅] 创建 `.npmrc`
- [✅] 创建 `.gitignore`

**验收**：`pnpm install` 能正常执行 ✅

### T00-02：TypeScript 基础配置

- [✅] 创建 `tsconfig.base.json`（含 `ignoreDeprecations: "6.0"` 兼容 TS 6.x）
- [✅] 创建根 `tsconfig.json`，使用 project references 引用各子包

**验收**：`npx tsc --noEmit` 不报配置错误 ✅

### T00-03：创建 packages/core 子包骨架

- [✅] 创建 `packages/core/package.json`（@bye_past/vue-keep 2.0.0-alpha.0）
- [✅] 创建 `packages/core/tsconfig.json` + `tsconfig.build.json`
- [✅] 创建 `packages/core/tsup.config.ts`
- [✅] 创建 `packages/core/src/index.ts`
- [✅] 创建目录结构：store/router/components/composables/event-channel/scroll/animation/devtools/utils/types

**验收**：`tsc --noEmit` 通过，`tsup` 构建成功 ✅

### T00-04：创建 packages/devtools 子包骨架

- [✅] 创建 `packages/devtools/package.json`（@bye_past/vue-keep-devtools）
- [✅] 创建 `packages/devtools/tsconfig.json` + `tsup.config.ts`
- [✅] 创建 `packages/devtools/src/index.ts`

**验收**：tsc 不报错，tsup 构建成功 ✅

### T00-05：安装公共开发依赖

- [✅] 根目录安装：typescript vue vue-router @vue/test-utils vitest happy-dom eslint prettier husky lint-staged commitlint @changesets/cli tsup size-limit 等
- [✅] packages/core 安装 peer 依赖为 devDependencies

**验收**：`pnpm install` 无报错 ✅

### T00-06：ESLint + Prettier 配置

- [✅] 创建 `.eslintrc.cjs`
- [✅] 创建 `.prettierrc`
- [✅] 创建 `.editorconfig`

**验收**：`pnpm lint` 能执行 ✅

### T00-07：Git 钩子（Husky + lint-staged + commitlint）

- [✅] 配置 `.husky/pre-commit` + `.husky/commit-msg`
- [✅] 创建 `lint-staged.config.js`
- [✅] 创建 `commitlint.config.cjs`

**验收**：husky 钩子配置就绪 ✅

### T00-08：Changeset 版本管理

- [✅] 初始化 `.changeset/`
- [✅] 配置 `config.json`（linked packages、public access、baseBranch: master）

**验收**：changeset 配置就绪 ✅

### T00-09：GitHub Actions CI

- [✅] 创建 `.github/workflows/ci.yml`
- [✅] 创建 `.github/workflows/release.yml`
- [✅] 创建 `.github/workflows/size-limit.yml`

**验收**：workflow 文件语法正确 ✅

### T00-10：根 package.json scripts 完善

- [✅] 添加所有 workspace scripts（dev/build/test/typecheck/lint/size/changeset/version/release）

**验收**：`pnpm build`、`pnpm test`、`pnpm typecheck` 都能执行 ✅

### T00-11：创建项目元文件

- [✅] LICENSE（MIT）
- [✅] SECURITY.md
- [✅] CONTRIBUTING.md
- [✅] CLAUDE.md
- [✅] `.github/ISSUE_TEMPLATE/bug_report.yml`
- [✅] `.github/ISSUE_TEMPLATE/feature_request.yml`
- [✅] `.github/PULL_REQUEST_TEMPLATE.md`
- [✅] `.github/FUNDING.yml`

**验收**：GitHub 模板文件就绪 ✅

---

## 完成标准

- [✅] `pnpm install` 无报错
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm build` 能执行
- [✅] `pnpm test` 通过（含占位测试）
- [✅] Git 钩子配置就绪
- [✅] changeset 配置就绪
- [✅] CI workflow 文件就绪
- [✅] 目录结构与规划一致

## 备注

- TypeScript 6.0.3 废弃了 `baseUrl`，tsup DTS 生成依赖它，已在 tsconfig.base.json 中添加 `"ignoreDeprecations": "6.0"` 兼容
- 原 `newVueKeep/` 目录层已去除，所有内容直接在仓库根目录
