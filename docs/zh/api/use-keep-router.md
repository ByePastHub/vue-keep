# useKeepRouter

获取 KeepRouter 实例，提供增强的导航方法。

## 函数签名

```ts
function useKeepRouter(): KeepRouter
```

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

```vue
<script setup lang="ts">
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()

keepRouter.push('/detail/1')
keepRouter.back()
keepRouter.reLaunch('/')
</script>
```

## 注意事项

- 必须在 `setup()` 或 `<script setup>` 中调用
- 需要先安装 `createKeepRouter` 插件
