# useKeepRouter

获取 KeepRouter 实例，提供增强的导航方法。

## 函数签名

```ts
function useKeepRouter(): KeepRouter
```

`useKeepRouter()` 支持两类调用场景：

- 在组件 `setup()` / `<script setup>` 中调用时，优先读取当前组件树的注入实例
- 在普通 TS / JS 模块中调用时，读取 `app.use(createKeepRouter(...))` 安装后的默认实例

## 返回值

```ts
interface KeepRouter {
  push(to: KeepLocation, options?: KeepNavigateOptions): Promise<void>
  replace(to: KeepLocation, options?: KeepNavigateOptions): Promise<void>
  back(delta?: number): void
  reLaunch(to: KeepLocation, options?: Omit<KeepNavigateOptions, 'events'>): Promise<void>
  switchTab(to: KeepLocation, options?: Omit<KeepNavigateOptions, 'events'>): Promise<void>
  destroy(target: DestroyTarget): void
  beforeEach(guard: KeepNavigationGuard): () => void
}
```

## KeepNavigateOptions

| 属性         | 类型                       | 说明                                |
| ------------ | -------------------------- | ----------------------------------- |
| `cache`      | `boolean`                  | 是否缓存目标页（默认 true）         |
| `constCache` | `boolean`                  | 是否将目标页标记为常驻缓存          |
| `destroy`    | `DestroyTarget`            | 进入目标页前需要销毁的缓存          |
| `events`     | `Record<string, Function>` | EventChannel 监听器（仅 push 支持） |
| `metadata`   | `Record<string, unknown>`  | 附加元数据                          |

## 示例

### 组件中使用

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

keepRouter.push('/detail/1')
keepRouter.back()
keepRouter.reLaunch('/')
</script>
```

### 普通 JS / TS 模块中使用

```ts
import { useKeepRouter } from '@bye_past/vue-keep'

export async function navigateToLogin() {
  const keepRouter = useKeepRouter()
  await keepRouter.push('/login')
}
```

## 注意事项

- 组件内调用需要先安装 `createKeepRouter` 插件
- 组件外调用需要发生在 `app.use(createKeepRouter(...))` 之后
- 多个 Vue 应用共存时，组件内调用会使用当前组件树的实例；组件外调用会使用最后安装的默认实例
