# 模块 03：栈管理器

> 阶段：Phase 1 | 预估：2 天 | 前置依赖：模块 02 | 状态：✅ 已完成

## 目标

实现页面栈的核心算法，包括 5 种导航方式的栈操作、LRU 淘汰、constCache 保护、条件销毁。栈管理器是纯逻辑层，不依赖 Vue 响应式，由 CoreStore 调用。

---

## 文件清单

| 文件                                       | 职责                 | 状态 |
| ------------------------------------------ | -------------------- | ---- |
| `packages/core/src/store/stack-manager.ts` | 栈操作核心算法       | ✅   |
| `packages/core/src/utils/lru.ts`           | LRU 淘汰工具函数     | ✅   |
| `packages/core/src/utils/match.ts`         | NameMatcher 匹配工具 | ✅   |

---

## 已完成任务

- [✅] T03-01: NameMatcher 匹配工具（string/RegExp/Array/Function，route 可选）
- [✅] T03-02: LRU 淘汰工具（evictLeastRecentlyUsed，按 lastActiveAt 排序，canEvict 过滤）
- [✅] T03-03: StackManager 接口（apply 方法，接收 stack 数组和 ApplyParams）
- [✅] T03-04: createStackManager 工厂（接收 KeepOptionsResolved）
- [✅] T03-05: Push 策略（创建新条目、LRU 淘汰、constCache 保护）
- [✅] T03-06: Replace 策略（替换栈顶，栈深不变）
- [✅] T03-07: Back 策略（弹出 count 个条目，保留至少 1 个，更新新栈顶 lastActiveAt）
- [✅] T03-08: ReLaunch 策略（清空栈，创建新条目）
- [✅] T03-09: SwitchTab 策略（已存在 tab 更新 lastActiveAt，不存在则创建）
- [✅] T03-10: apply 主入口（按 method 分发到对应策略）
- [✅] T03-13: createEntry 工厂函数（深拷贝 route，genId 生成唯一 ID）
- [✅] T03-14: onBeforeEvict 钩子集成（返回 false 跳过淘汰）

## 测试覆盖

- `lru.test.ts` — 5 个测试（未超限/淘汰最旧/constCache保护/当前激活保护/全不可淘汰）
- `stack-manager.test.ts` — 15 个测试（Push 5个/Replace 2个/Back 4个/ReLaunch 1个/SwitchTab 3个）

## 完成标准

- [✅] 5 种导航方式的栈操作全部实现且逻辑正确
- [✅] LRU 淘汰正确（constCache 保护、当前激活保护）
- [✅] 单元测试覆盖所有策略的正常路径和边界情况
- [✅] `pnpm typecheck` 通过
- [✅] `pnpm test` 通过（118 个测试）
- [✅] `pnpm build` 通过
- [✅] 纯逻辑层，不依赖 Vue 响应式 API
