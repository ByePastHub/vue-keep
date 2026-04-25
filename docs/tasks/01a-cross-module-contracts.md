# 模块 01A：跨模块架构契约

> 阶段：Phase 1 | 预估：0.5 天 | 前置依赖：模块 01 | 状态：✅ 已完成

## 目标

在进入 Store、路由绑定、组件渲染之前，先冻结跨模块共享的运行时契约，避免后续出现"模块各自可实现，但拼不起来"的返工。

---

## 已完成任务

- [✅] T01A-01: IntentTracker — 单例导航意图追踪器（set/consume/peek/clear）
- [✅] T01A-02: NavigationIntent 契约 — 已在 types/internal.ts 中定义
- [✅] T01A-03: ContainerResolver — 容器注册/注销/按深度解析
- [✅] T01A-03b: resolveContainerId — 默认容器 ID 生成规则（keep:depth:parentKey:viewName）
- [✅] T01A-04: resolveTabKey — switchTab tab 身份解析（meta.tabKey > name > path）
- [✅] T01A-05: KeepPageShell — 延迟到模块 07 实现（需要组件渲染上下文）
- [✅] T01A-06: createKeepScrollBehavior — 滚动行为协作（back 时返回 false）
- [✅] resolveComponentName / ensureComponentName — 组件名称解析
- [✅] uid — 唯一 ID 生成器

## 文件清单

| 文件                                 | 职责             | 状态 |
| ------------------------------------ | ---------------- | ---- |
| `src/router/intent-tracker.ts`       | 导航意图追踪器   | ✅   |
| `src/router/container-resolver.ts`   | 容器注册与解析   | ✅   |
| `src/utils/container-id.ts`          | 容器 ID 生成规则 | ✅   |
| `src/utils/name-resolver.ts`         | 组件名称解析     | ✅   |
| `src/utils/tab-key.ts`               | Tab 身份解析     | ✅   |
| `src/utils/uid.ts`                   | 唯一 ID 生成     | ✅   |
| `src/scroll/keep-scroll-behavior.ts` | 滚动行为协作     | ✅   |

## 测试覆盖

- `intent-tracker.test.ts` — 6 个测试（set/consume/peek/clear/覆盖/hasPending）
- `container-resolver.test.ts` — 5 个测试（注册/注销/按深度解析/无匹配/getAll）
- `container-id.test.ts` — 4 个测试（顶层/子层name/子层path/不同tab）
- `name-resolver.test.ts` — 7 个测试（组件name/路由name/兜底/空matched/ensureComponentName）
- `uid.test.ts` — 3 个测试（非空/唯一/前缀）
- `tab-key.test.ts` — 4 个测试（tabKey/name/path/空matched）
- `keep-scroll-behavior.test.ts` — 4 个测试（back/forward/fallback/none）

## 完成标准

- [✅] 所有跨模块共享对象的创建时机唯一且职责清晰
- [✅] 容器 ID、tab 身份、导航意图都形成书面契约
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过（46 个测试）
- [✅] `pnpm build` 通过
