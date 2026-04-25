# 模块 02：核心 Store

> 阶段：Phase 1 | 预估：1 天 | 前置依赖：模块 01 | 状态：✅ 已完成

## 目标

实现全局响应式状态中心 `CoreStore`，作为整个库的单一数据源。所有栈数据、导航状态、配置都通过 store 管理，组件和 composables 通过 `watch`/`computed` 消费。

---

## 文件清单

| 文件                                      | 职责                   | 状态 |
| ----------------------------------------- | ---------------------- | ---- |
| `packages/core/src/store/core-store.ts`   | 全局 store 创建与 API  | ✅   |
| `packages/core/src/store/id-allocator.ts` | 唯一 ID 生成器         | ✅   |
| `packages/core/src/utils/env.ts`          | 环境检测（SSR/浏览器） | ✅   |
| `packages/core/src/utils/warn.ts`         | 带命名空间的警告工具   | ✅   |

---

## 已完成任务

- [✅] T02-01: 环境检测工具（isBrowser/isSSR/hasHistory/hasResizeObserver）
- [✅] T02-02: 警告工具（warn/error/setNamespace，**DEV** 保护）
- [✅] T02-03: ID 分配器（genId/resetIdCounter，vk*{自增}*{时间戳base36}）
- [✅] T02-04: CoreStore 状态结构（shallowReactive，stacks/currentRoute/lastNavigation/ready）
- [✅] T02-05: CoreStore 创建函数（createCoreStore 工厂）
- [✅] T02-06: Store 栈操作方法（ensureStack/destroyStack/getStack/getIncludeList/getEntry/getCurrentEntry/ensureInStack/updateEntry）
- [✅] T02-07: Store 导航状态方法（setPendingInfo/takePendingInfo/prepareNavigation/commitNavigation/initFirstEntry/restoreFromState/setReady）
- [✅] T02-08: Store 守卫管理（addGuard/runGuards，后注册覆盖前者）
- [✅] T02-09: Store 事件订阅（onNavigationCommit/onStateChange）
- [✅] T02-10: Store 销毁方法（destroy，支持 string/string[]/ALL/函数）
- [✅] T02-11: Store 初始化与类型导出（CoreStore 类型，public API 不暴露内部细节）

## 测试覆盖

- `env.test.ts` — 3 个测试（isBrowser/isSSR/hasHistory）
- `warn.test.ts` — 3 个测试（warn/error/setNamespace）
- `id-allocator.test.ts` — 4 个测试（非空/唯一/格式/重置）
- `core-store.test.ts` — 18 个测试（初始状态/ensureStack/destroyStack/getIncludeList/getEntry/getCurrentEntry/ensureInStack/updateEntry）
- `core-store-nav.test.ts` — 17 个测试（pendingInfo/commitNavigation/initFirstEntry/setReady/守卫/destroy/事件订阅）

## 完成标准

- [✅] `createCoreStore()` 返回完整的 store 对象
- [✅] 所有栈操作触发响应式更新
- [✅] SSR 环境下 store 创建不报错
- [✅] 单元测试覆盖：ensureStack/destroyStack/getStack/getIncludeList/updateEntry/destroy/guard 执行
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过（98 个测试）
- [✅] `pnpm build` 通过
