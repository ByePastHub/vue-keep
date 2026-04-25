# 模块 14：构建与发布

> 阶段：Phase 3 | 预估：1 天 | 前置依赖：模块 00

## 目标

配置 tsup 构建、api-extractor 类型打平、size-limit 体积守门、GitHub Actions CI/CD 流水线。确保产出的 npm 包符合现代标准（ESM/CJS 双格式、正确的 exports 字段、gzip < 5KB）。

---

## 文件清单

| 文件                               | 职责               |
| ---------------------------------- | ------------------ |
| `packages/core/tsup.config.ts`     | tsup 构建配置      |
| `packages/core/api-extractor.json` | API Extractor 配置 |
| `packages/core/package.json`       | 包元信息和 exports |
| `.github/workflows/ci.yml`         | CI 流水线          |
| `.github/workflows/release.yml`    | 发布流水线         |
| `.github/workflows/size-limit.yml` | 体积检查           |
| `.size-limit.json`                 | size-limit 配置    |

---

## 任务清单

### T14-01：tsup 构建配置

文件：`packages/core/tsup.config.ts`

- [✅] 实现构建配置：

  ```ts
  import { defineConfig } from 'tsup'

  export default defineConfig({
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true, // 先生成 .d.ts，后续用 api-extractor 打平
    splitting: false,
    clean: true,
    treeshake: true,
    minify: false, // 让用户的打包工具处理压缩
    sourcemap: true,
    external: ['vue', 'vue-router'],
    define: {
      __DEV__: 'process.env.NODE_ENV !== "production"',
    },
    esbuildOptions(options) {
      options.banner = {
        js: '/* @bye_past/vue-keep v2.0.0 | MIT License */',
      }
    },
    onSuccess: 'cp src/animation/presets.css dist/animations.css',
  })
  ```

- [✅] 双格式输出：ESM（`.js`）和 CJS（`.cjs`）
- [✅] 外部依赖：`vue` 和 `vue-router` 不打包
- [✅] `__DEV__` 定义为 `process.env.NODE_ENV !== "production"`
- [✅] CSS 预设文件复制到 dist
- [✅] 生成 sourcemap

**验收**：

- [✅] `pnpm build` 产出 `dist/index.js`、`dist/index.cjs`、`dist/index.d.ts`
- [✅] `dist/animations.css` 存在
- [✅] ESM 格式使用 `import/export`
- [✅] CJS 格式使用 `require/module.exports`
- [✅] `vue` 和 `vue-router` 不在 bundle 中

### T14-02：api-extractor 类型打平

文件：`packages/core/api-extractor.json`

- [✅] 配置 API Extractor：
  ```json
  {
    "$schema": "https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json",
    "mainEntryPointFilePath": "./dist/index.d.ts",
    "bundledPackages": [],
    "dtsRollup": {
      "enabled": true,
      "untrimmedFilePath": "./dist/index.d.ts"
    },
    "apiReport": {
      "enabled": false
    },
    "docModel": {
      "enabled": false
    },
    "tsdocMetadata": {
      "enabled": false
    },
    "compiler": {
      "tsconfigFilePath": "./tsconfig.json"
    }
  }
  ```
- [✅] 将所有分散的 `.d.ts` 打平为单个 `index.d.ts`
- [✅] 在 `package.json` scripts 中添加：
  ```json
  {
    "scripts": {
      "build": "tsup && api-extractor run --local"
    }
  }
  ```

**验收**：

- [✅] `dist/index.d.ts` 包含所有公共类型
- [✅] 用户 `import { KeepRouter } from '@bye_past/vue-keep'` 有完整类型提示
- [✅] 内部类型不暴露

### T14-03：package.json exports 字段

文件：`packages/core/package.json`

- [✅] 完善 exports 字段：
  ```json
  {
    "name": "@bye_past/vue-keep",
    "version": "2.0.0",
    "type": "module",
    "main": "./dist/index.cjs",
    "module": "./dist/index.js",
    "types": "./dist/index.d.ts",
    "exports": {
      ".": {
        "types": "./dist/index.d.ts",
        "import": "./dist/index.js",
        "require": "./dist/index.cjs"
      },
      "./animations.css": "./dist/animations.css"
    },
    "files": ["dist", "README.md", "LICENSE"],
    "sideEffects": ["*.css"],
    "peerDependencies": {
      "vue": "^3.4.0",
      "vue-router": "^4.2.0"
    },
    "keywords": [
      "vue",
      "vue3",
      "keep-alive",
      "page-cache",
      "router",
      "scroll-restoration",
      "page-stack",
      "navigation"
    ],
    "repository": {
      "type": "git",
      "url": "https://github.com/user/vue-keep"
    },
    "license": "MIT"
  }
  ```
- [✅] `sideEffects` 标记 CSS 文件，避免被 tree-shake
- [✅] `files` 只包含必要文件
- [✅] `peerDependencies` 指定最低版本

**验收**：

- [✅] `npm pack` 后包内容正确
- [✅] Webpack/Vite/Rollup 都能正确解析 exports
- [✅] CSS 不被 tree-shake 掉

### T14-04：size-limit 体积守门

文件：`.size-limit.json`（根目录）

- [✅] 配置体积检查：
  ```json
  [
    {
      "name": "ESM bundle (gzip)",
      "path": "packages/core/dist/index.js",
      "limit": "5 kB",
      "gzip": true,
      "import": "{ createKeepRouter, useKeepRouter }"
    },
    {
      "name": "Full bundle (gzip)",
      "path": "packages/core/dist/index.js",
      "limit": "6 kB",
      "gzip": true
    },
    {
      "name": "CSS (gzip)",
      "path": "packages/core/dist/animations.css",
      "limit": "1 kB",
      "gzip": true
    }
  ]
  ```
- [✅] 在根 `package.json` 添加 script：
  ```json
  {
    "scripts": {
      "size": "size-limit",
      "size:why": "size-limit --why"
    }
  }
  ```
- [✅] 安装依赖：`size-limit`、`@size-limit/preset-small-lib`

**验收**：

- [✅] `pnpm size` 显示各入口的 gzip 体积
- [✅] ESM bundle gzip < 5KB
- [✅] 超限时 CI 报错

### T14-05：CI 流水线

文件：`.github/workflows/ci.yml`

- [✅] 实现 CI 流水线：

  ```yaml
  name: CI

  on:
    push:
      branches: [main, master]
    pull_request:
      branches: [main, master]

  jobs:
    lint:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm lint

    typecheck:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm typecheck

    test:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm test

    build:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm build
        - run: pnpm size
  ```

- [✅] 4 个并行 job：lint、typecheck、test、build+size
- [✅] 使用 pnpm cache 加速

**验收**：

- [✅] PR 提交后自动运行 CI
- [✅] 任一 job 失败时 PR 标红

### T14-06：发布流水线

文件：`.github/workflows/release.yml`

- [✅] 实现基于 changeset 的自动发布：

  ```yaml
  name: Release

  on:
    push:
      branches: [main, master]

  concurrency: ${{ github.workflow }}-${{ github.ref }}

  jobs:
    release:
      runs-on: ubuntu-latest
      permissions:
        contents: write
        packages: write
        pull-requests: write
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: pnpm
            registry-url: 'https://registry.npmjs.org'
        - run: pnpm install --frozen-lockfile
        - run: pnpm build

        - name: Create Release Pull Request or Publish
          uses: changesets/action@v1
          with:
            publish: pnpm changeset publish
            version: pnpm changeset version
            commit: 'chore: version packages'
            title: 'chore: version packages'
          env:
            GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
            NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
  ```

- [✅] 使用 `changesets/action` 自动创建版本 PR 或发布
- [✅] 需要配置 `NPM_TOKEN` secret

**验收**：

- [✅] 合并 changeset PR 后自动发布到 npm
- [✅] CHANGELOG.md 自动生成
- [✅] GitHub Release 自动创建

### T14-07：体积检查 PR 评论

文件：`.github/workflows/size-limit.yml`

- [✅] 实现 PR 体积对比评论：

  ```yaml
  name: Size Limit

  on:
    pull_request:
      branches: [main, master]

  jobs:
    size:
      runs-on: ubuntu-latest
      permissions:
        pull-requests: write
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm build

        - uses: andresz1/size-limit-action@v1
          with:
            github_token: ${{ secrets.GITHUB_TOKEN }}
            build_script: build
            skip_step: build
  ```

- [✅] PR 中自动评论体积变化

**验收**：PR 评论中显示体积变化百分比

---

## 完成标准

- [✅] `pnpm build` 产出正确的 ESM/CJS/d.ts/CSS
- [✅] exports 字段被所有主流打包工具正确解析
- [✅] gzip < 5KB（不含 CSS）
- [✅] CI 自动运行 lint/typecheck/test/build/size
- [✅] changeset 自动版本管理和发布
- [✅] PR 体积对比评论
