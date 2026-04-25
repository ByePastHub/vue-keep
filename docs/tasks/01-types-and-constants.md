# 模块 01：核心类型与常量

> 阶段：Phase 1 | 预估：0.5 天 | 前置依赖：模块 00 | 状态：✅ 已完成

## 目标

定义所有 public 和 internal 类型、枚举常量、provide/inject Symbol。这些类型是整个库的契约，后续所有模块都依赖它们。

---

## 文件清单

| 文件                                  | 职责                         | 状态 |
| ------------------------------------- | ---------------------------- | ---- |
| `packages/core/src/types/public.ts`   | 所有对外导出的类型           | ✅   |
| `packages/core/src/types/internal.ts` | 仅内部使用的类型             | ✅   |
| `packages/core/src/types/augment.ts`  | Vue Router 声明合并          | ✅   |
| `packages/core/src/symbols.ts`        | provide/inject 的 Symbol key | ✅   |
| `packages/core/src/utils/match.ts`    | matchName 工具函数           | ✅   |
| `packages/core/src/utils/options.ts`  | resolveOptions 工具函数      | ✅   |

---

## 已完成任务

- [✅] T01-01: NavigationDirection 常量（forward/back/none）
- [✅] T01-02: NavigationMethod 常量（push/replace/back/reLaunch/switchTab）
- [✅] T01-03: ScrollPosition 接口
- [✅] T01-04: PageStackEntry 接口（完整栈条目）
- [✅] T01-05: NameMatcher 类型 + matchName 工具函数
- [✅] T01-06: TransitionConfig / TransitionPreset 类型
- [✅] T01-07: ScrollBehaviorStrategy / ScrollBehaviorFn 类型
- [✅] T01-08: KeepOptions / KeepOptionsResolved + resolveOptions 函数
- [✅] T01-09: KeepRouterViewProps 接口
- [✅] T01-10: KeepLocation / KeepNavigateOptions 类型
- [✅] T01-11: KeepNavigationGuard / KeepGuardReturn 类型
- [✅] T01-12: DestroyTarget 类型
- [✅] T01-13: 路由 Meta 声明合并（RouteMeta.keep + $keepRouter）
- [✅] T01-14: PageEventMap 声明合并基础
- [✅] T01-15: 内部类型（NavigationInfo/NavigationIntent/PrepareNavigationParams/ApplyParams/ApplyResult）
- [✅] T01-16: Symbol 常量（6 个 InjectionKey）
- [✅] T01-17: 桶文件导出（public 类型从 index.ts 导出，internal 不泄露）
- [✅] KeepRouter 接口（push/replace/back/reLaunch/switchTab/destroy/beforeEach）
- [✅] PageShowContext 接口

---

## 测试覆盖

- `__tests__/types.test.ts` — NavigationDirection、NavigationMethod 常量验证
- `__tests__/match.test.ts` — matchName 4 种匹配方式（字符串/正则/数组/函数）
- `__tests__/options.test.ts` — resolveOptions 默认值填充、用户覆盖、边界情况

---

## 完成标准

- [✅] 所有 public 类型从 `index.ts` 可导出
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过（13 个测试）
- [✅] `pnpm build` 通过（DTS 5.40 KB）
- [✅] 内部类型不泄露到 public API
- [✅] 声明合并在用户项目中生效
