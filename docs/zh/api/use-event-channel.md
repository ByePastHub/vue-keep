# useEventChannel

获取当前页面关联的 EventChannel 实例。

## 函数签名

```ts
function useEventChannel(): EventChannel
```

## EventChannel

```ts
interface EventChannel {
  emit(event: string, ...args: any[]): void
  on(event: string, handler: EventHandler): void
  off(event: string, handler?: EventHandler): void
  destroy(): void
}
```

## 使用场景

在目标页面中使用，向源页面发送数据：

```vue
<script setup lang="ts">
import { useEventChannel, useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const channel = useEventChannel()

function submit(data: FormData) {
  channel.emit('onSubmit', data)
  keepRouter.back()
}
</script>
```

## 注意事项

- 必须在通过 `keepRouter.push` 且传递了 `events` 选项打开的页面中使用
- 如果当前页面没有关联的 EventChannel，`emit` 调用会被静默忽略
- Channel 在页面销毁时自动清理
