# useScrollRestoration

手动控制滚动恢复行为。

## 函数签名

```ts
function useScrollRestoration(): ScrollRestorationControls

interface ScrollRestorationControls {
  save(): void
  restore(): void
  pause(): void
  resume(): void
  registerContainer(selector: string): void
}
```

## 返回值

| 方法                          | 说明                           |
| ----------------------------- | ------------------------------ |
| `save()`                      | 手动保存当前所有滚动容器的位置 |
| `restore()`                   | 手动恢复保存的滚动位置         |
| `pause()`                     | 暂停自动滚动恢复               |
| `resume()`                    | 恢复自动滚动恢复               |
| `registerContainer(selector)` | 注册额外的滚动容器选择器       |

## 示例

```vue
<script setup lang="ts">
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

// 在异步数据加载完成后手动恢复
async function loadData() {
  scroll.pause()
  await fetchData()
  scroll.resume()
  scroll.restore()
}

// 注册动态创建的滚动容器
scroll.registerContainer('.dynamic-list')
</script>
```
