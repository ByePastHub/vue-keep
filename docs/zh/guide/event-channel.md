# 页面通信

## EventChannel 概念

EventChannel 是一种页面间通信机制，灵感来自微信小程序的 `wx.navigateTo` events 参数。它允许源页面在 push 时注册事件监听器，目标页面通过 emit 将数据传回源页面。

```
源页面 (List)                    目标页面 (Form)
    │                                │
    │  push('/form', { events })     │
    │ ─────────────────────────────> │
    │                                │
    │    channel.emit('save', data)  │
    │ <───────────────────────────── │
    │                                │
    │  收到 onSave 回调              │
```

## push 时传递事件

```ts
// 源页面：列表页
const keepRouter = useKeepRouter()

keepRouter.push('/address/edit', {
  events: {
    onSave(address: { name: string; phone: string }) {
      // 目标页面提交后，这里会收到数据
      selectedAddress.value = address
    },
    onCancel() {
      console.log('用户取消了编辑')
    },
  },
})
```

## 目标页面 emit 数据

```vue
<!-- 目标页面：地址编辑页 -->
<script setup lang="ts">
import { useEventChannel, useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const channel = useEventChannel()

function handleSave() {
  // 向源页面发送数据
  channel.emit('onSave', {
    name: '张三',
    phone: '13800138000',
  })
  keepRouter.back()
}

function handleCancel() {
  channel.emit('onCancel')
  keepRouter.back()
}
</script>
```

## TypeScript 类型安全

通过声明合并为 `PageEventMap` 添加类型定义：

```ts
// types/vue-keep.d.ts
declare module '@bye_past/vue-keep' {
  interface PageEventMap {
    onSave: (address: { name: string; phone: string }) => void
    onCancel: () => void
    onSelect: (item: { id: number; label: string }) => void
  }
}
```

这样 `events` 和 `channel.emit` 都会获得类型提示和检查。

## 完整示例

```vue
<!-- ListPage.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const result = ref<string>('')

function openForm() {
  keepRouter.push('/form', {
    events: {
      onSubmit(data: { title: string }) {
        result.value = data.title
      },
    },
  })
}
</script>

<template>
  <div>
    <button @click="openForm">打开表单</button>
    <p v-if="result">提交结果: {{ result }}</p>
  </div>
</template>
```

```vue
<!-- FormPage.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, useEventChannel } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const channel = useEventChannel()
const title = ref('')

function submit() {
  channel.emit('onSubmit', { title: title.value })
  keepRouter.back()
}
</script>

<template>
  <div>
    <input v-model="title" placeholder="输入标题" />
    <button @click="submit">提交</button>
  </div>
</template>
```
