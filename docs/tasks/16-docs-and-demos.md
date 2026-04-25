# 模块 16：文档与 Demo

> 阶段：Phase 3 | 预估：3 天 | 前置依赖：所有功能模块

## 目标

使用 VitePress 搭建中英双语文档站，包含快速上手、API 参考、Cookbook、迁移指南。同时完善 ecommerce playground 作为完整 Demo，提供 StackBlitz 在线体验入口。

---

## 文件清单

| 文件/目录                        | 职责                  |
| -------------------------------- | --------------------- |
| `docs/.vitepress/config.ts`      | VitePress 配置        |
| `docs/.vitepress/theme/index.ts` | 自定义主题            |
| `docs/zh/`                       | 中文文档              |
| `docs/en/`                       | 英文文档              |
| `playground/basic/`              | 最小 Hello World Demo |
| `playground/ecommerce/`          | 完整电商 Demo         |

---

## 任务清单

### T16-01：VitePress 配置

文件：`docs/.vitepress/config.ts`

- [✅] 实现双语配置：

  ```ts
  import { defineConfig } from 'vitepress'

  export default defineConfig({
    title: 'Vue Keep',
    description: 'Vue 页面缓存库，复刻微信小程序页面栈体验',

    locales: {
      zh: {
        label: '简体中文',
        lang: 'zh-CN',
        link: '/zh/',
        themeConfig: {
          nav: [
            { text: '指南', link: '/zh/guide/getting-started' },
            { text: 'API', link: '/zh/api/create-keep-router' },
            { text: 'Cookbook', link: '/zh/cookbook/scroll-restoration' },
          ],
          sidebar: {
            '/zh/guide/': [
              {
                text: '入门',
                items: [
                  { text: '简介', link: '/zh/guide/introduction' },
                  { text: '快速上手', link: '/zh/guide/getting-started' },
                  { text: '核心概念', link: '/zh/guide/core-concepts' },
                ],
              },
              {
                text: '进阶',
                items: [
                  { text: '导航方法', link: '/zh/guide/navigation-methods' },
                  { text: '页面缓存控制', link: '/zh/guide/cache-control' },
                  { text: '嵌套路由', link: '/zh/guide/nested-routes' },
                  { text: '动画', link: '/zh/guide/transitions' },
                  { text: '滚动恢复', link: '/zh/guide/scroll-restoration' },
                  { text: '页面通信', link: '/zh/guide/event-channel' },
                  { text: 'SSR', link: '/zh/guide/ssr' },
                ],
              },
            ],
            '/zh/api/': [
              {
                text: '核心',
                items: [
                  { text: 'createKeepRouter', link: '/zh/api/create-keep-router' },
                  { text: 'KeepRouterView', link: '/zh/api/keep-router-view' },
                ],
              },
              {
                text: 'Composables',
                items: [
                  { text: 'useKeepRouter', link: '/zh/api/use-keep-router' },
                  { text: 'usePageCache', link: '/zh/api/use-page-cache' },
                  { text: 'usePageStack', link: '/zh/api/use-page-stack' },
                  { text: 'useNavigationDirection', link: '/zh/api/use-navigation-direction' },
                  { text: 'useEventChannel', link: '/zh/api/use-event-channel' },
                  { text: 'useScrollRestoration', link: '/zh/api/use-scroll-restoration' },
                  { text: 'onPageShow / onPageHide', link: '/zh/api/lifecycle-hooks' },
                ],
              },
              {
                text: '类型',
                items: [{ text: '类型参考', link: '/zh/api/types' }],
              },
            ],
            '/zh/cookbook/': [
              {
                text: 'Cookbook',
                items: [
                  { text: '滚动恢复最佳实践', link: '/zh/cookbook/scroll-restoration' },
                  { text: '表单页面通信', link: '/zh/cookbook/form-communication' },
                  { text: 'Tab 切换保持', link: '/zh/cookbook/tab-switching' },
                  { text: '条件缓存', link: '/zh/cookbook/conditional-cache' },
                  { text: '与 UI 库集成', link: '/zh/cookbook/ui-library-integration' },
                ],
              },
            ],
          },
        },
      },
      en: {
        label: 'English',
        lang: 'en-US',
        link: '/en/',
        themeConfig: {
          nav: [
            { text: 'Guide', link: '/en/guide/getting-started' },
            { text: 'API', link: '/en/api/create-keep-router' },
            { text: 'Cookbook', link: '/en/cookbook/scroll-restoration' },
          ],
          // sidebar 结构与中文对称
        },
      },
    },

    themeConfig: {
      socialLinks: [{ icon: 'github', link: 'https://github.com/user/vue-keep' }],
      search: {
        provider: 'local',
      },
    },
  })
  ```

- [✅] 中英双语对称结构
- [✅] 本地搜索
- [✅] GitHub 链接

**验收**：`pnpm docs:dev` 能启动文档站，中英文切换正常

### T16-02：中文指南文档

目录：`docs/zh/guide/`

- [✅] `introduction.md` — 简介：
  - 什么是 Vue Keep
  - 解决什么问题（前进刷新、返回保留状态和滚动位置）
  - 与原生 KeepAlive 的区别
  - 与微信小程序页面栈的对比
  - 特性列表

- [✅] `getting-started.md` — 快速上手：
  - 安装（pnpm/npm/yarn）
  - 基本配置（createKeepRouter + app.use）
  - 替换 RouterView 为 KeepRouterView
  - 第一个缓存页面
  - 完整示例代码

- [✅] `core-concepts.md` — 核心概念：
  - 页面栈模型（图示）
  - 5 种导航方法（push/replace/back/reLaunch/switchTab）
  - 导航方向（forward/back/none）
  - KeepAlive include 同步机制
  - constCache 保护
  - LRU 淘汰策略

- [✅] `navigation-methods.md` — 导航方法详解：
  - 每种方法的栈操作图示
  - 代码示例
  - 与 Vue Router 原生方法的关系

- [✅] `cache-control.md` — 页面缓存控制：
  - route.meta.keep 配置
  - keepRouter.push 的 opts 参数
  - usePageCache composable
  - destroy 方法
  - constCache 使用场景

- [✅] `nested-routes.md` — 嵌套路由：
  - 多层 KeepRouterView
  - depth 自动递增
  - 父子栈独立
  - containerId 自定义

- [✅] `transitions.md` — 动画：
  - 内置预设（slide/fade/zoom）
  - CSS 引入方式
  - 自定义动画
  - 禁用动画
  - 首屏跳过

- [✅] `scroll-restoration.md` — 滚动恢复：
  - 自动恢复机制
  - 自定义滚动容器
  - createKeepScrollBehavior
  - useScrollRestoration

- [✅] `event-channel.md` — 页面通信：
  - EventChannel 概念
  - push 时传递事件
  - 目标页面 emit 数据
  - TypeScript 类型安全

- [✅] `ssr.md` — SSR：
  - Nuxt 3 集成
  - SSR 安全说明
  - 注意事项

**验收**：所有指南页面内容完整，代码示例可运行

### T16-03：中文 API 参考文档

目录：`docs/zh/api/`

- [✅] `create-keep-router.md`：
  - 函数签名
  - KeepOptions 所有配置项说明（类型、默认值、描述）
  - 返回值
  - 示例

- [✅] `keep-router-view.md`：
  - Props 说明
  - Slot 作用域变量
  - 默认渲染 vs 自定义渲染
  - 示例

- [✅] 每个 composable 一个文档页：
  - 函数签名
  - 参数说明
  - 返回值类型
  - 示例代码
  - 注意事项

- [✅] `types.md`：
  - 所有公共类型定义
  - 类型关系图
  - 声明合并说明

**验收**：API 文档覆盖所有公共 API，每个 API 有完整的类型签名和示例

### T16-04：中文 Cookbook 文档

目录：`docs/zh/cookbook/`

- [✅] `scroll-restoration.md` — 滚动恢复最佳实践：
  - 长列表滚动恢复
  - 多滚动容器
  - 懒加载图片场景
  - 虚拟滚动集成

- [✅] `form-communication.md` — 表单页面通信：
  - 列表页 → 表单页 → 返回带数据
  - EventChannel 完整示例
  - TypeScript 类型安全写法

- [✅] `tab-switching.md` — Tab 切换保持：
  - 底部 Tab 栏实现
  - switchTab 使用
  - 子栈保持

- [✅] `conditional-cache.md` — 条件缓存：
  - 根据来源页面决定是否缓存
  - beforeEach 守卫控制
  - destroy 清理

- [✅] `ui-library-integration.md` — 与 UI 库集成：
  - Element Plus
  - Vant
  - Naive UI
  - 常见问题和解决方案

**验收**：每个 Cookbook 有完整的场景描述和可运行代码

### T16-05：英文文档

目录：`docs/en/`

- [✅] 与中文文档结构完全对称
- [✅] 翻译所有指南、API、Cookbook 页面
- [✅] 代码示例保持一致
- [✅] 注意英文技术写作规范

**验收**：英文文档内容与中文一致，语言自然

### T16-06：迁移指南

文件：`docs/zh/guide/migration.md` + `docs/en/guide/migration.md`

- [✅] Breaking Changes 列表：
  - 不支持 Vue 2 / Vue Router 3
  - `max` 默认值变更
  - API 变更（destroy、cache/destroy 参数位置）
  - 动画 CSS 改为按需 import
  - 不再全局污染 history.prototype

- [✅] API 映射表（v1 → v2）：

  ```
  | v1 | v2 |
  |---|---|
  | Vue.use(keep, router) | app.use(createKeepRouter({ router })) |
  | destroy('name') | useKeepRouter().destroy('name') |
  | router.push({ cache: true }) | keepRouter.push(path, { cache: true }) |
  | beforeEach((to,from)=>{}) | keepRouter.beforeEach(guard) |
  ```

- [✅] 逐步迁移步骤
- [✅] 常见问题

**验收**：v1 用户能按照迁移指南顺利升级

### T16-07：playground/basic Demo

目录：`playground/basic/`

- [✅] 最小 Hello World Demo：
  ```
  playground/basic/
  ├── src/
  │   ├── App.vue
  │   ├── main.ts
  │   ├── router.ts
  │   └── pages/
  │       ├── Home.vue
  │       ├── List.vue
  │       └── Detail.vue
  ├── index.html
  ├── vite.config.ts
  ├── tsconfig.json
  └── package.json
  ```
- [✅] 展示最基本的用法：
  - createKeepRouter 配置
  - KeepRouterView 使用
  - keepRouter.push / back
  - 页面缓存效果

**验收**：`pnpm dev:basic` 能运行，展示基本缓存效果

### T16-08：playground/ecommerce Demo

目录：`playground/ecommerce/`

- [✅] 完整电商 Demo 页面：
  ```
  playground/ecommerce/
  ├── src/
  │   ├── App.vue
  │   ├── main.ts
  │   ├── router.ts
  │   ├── layouts/
  │   │   └── TabLayout.vue        # 底部 Tab 栏布局
  │   └── pages/
  │       ├── home/Home.vue         # 首页（推荐商品列表）
  │       ├── list/List.vue         # 商品列表（长列表 + 滚动恢复）
  │       ├── detail/Detail.vue     # 商品详情（动态路由 /detail/:id）
  │       ├── cart/Cart.vue         # 购物车（Tab 页）
  │       ├── checkout/Checkout.vue # 结算页
  │       ├── pay/PayResult.vue     # 支付结果（reLaunch 场景）
  │       ├── profile/Profile.vue   # 个人中心（Tab 页）
  │       └── address/AddressForm.vue # 地址编辑（EventChannel 场景）
  ├── e2e/                          # Playwright E2E 测试
  ├── index.html
  ├── vite.config.ts
  ├── tsconfig.json
  ├── playwright.config.ts
  └── package.json
  ```
- [✅] 展示所有核心功能：
  - 列表 → 详情 → 返回（滚动恢复）
  - Tab 切换（switchTab）
  - 支付完成 → reLaunch 回首页
  - 地址编辑 → 返回带数据（EventChannel）
  - constCache 保护首页
  - 自定义动画

**验收**：`pnpm dev:ecommerce` 能运行，所有场景可手动验证

### T16-09：StackBlitz 模板

- [✅] 创建 StackBlitz 在线模板：
  - 基于 playground/basic 简化
  - 在 README.md 中添加 "Open in StackBlitz" 按钮
  - 确保在线环境能正常运行
- [✅] 在文档首页添加 "Try it online" 链接

**验收**：点击链接能在 StackBlitz 中打开并运行

### T16-10：README.md

文件：`newVueKeep/README.md`（根目录）

- [✅] 包含：
  - 项目名称和一句话描述
  - 特性列表（带 emoji）
  - 快速安装和使用示例
  - 在线 Demo 链接
  - 文档链接
  - 与竞品对比表
  - License
- [✅] 中英双语（或英文为主，中文文档链接）

**验收**：README 信息完整，格式美观

### T16-11：文档部署配置

文件：`.github/workflows/preview-docs.yml`

- [✅] 实现文档预览部署：

  ```yaml
  name: Preview Docs

  on:
    pull_request:
      paths:
        - 'docs/**'

  jobs:
    deploy-preview:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: pnpm/action-setup@v4
        - uses: actions/setup-node@v4
          with:
            node-version: 20
            cache: pnpm
        - run: pnpm install --frozen-lockfile
        - run: pnpm docs:build
        # 部署到预览环境（Netlify/Vercel/GitHub Pages）
  ```

- [✅] 正式文档部署到 GitHub Pages 或 Netlify

**验收**：PR 修改文档时自动部署预览

---

## 完成标准

- [✅] VitePress 文档站中英双语完整
- [✅] 指南覆盖所有核心功能
- [✅] API 参考覆盖所有公共 API
- [✅] Cookbook 覆盖 5 个常见场景
- [✅] 迁移指南完整
- [✅] playground/basic 可运行
- [✅] playground/ecommerce 9 个页面完整
- [✅] StackBlitz 在线体验可用
- [✅] README.md 信息完整
- [✅] 文档部署流水线配置完成
