# 表单页面通信

## 场景

列表页 → 表单页 → 返回时带回数据。这是移动端最常见的交互模式。

## 完整示例

### 列表页

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

interface Address {
  id: number
  name: string
  phone: string
  detail: string
}

const keepRouter = useKeepRouter()
const addresses = ref<Address[]>([])

function addAddress() {
  keepRouter.push('/address/new', {
    events: {
      onSave(address: Address) {
        addresses.value.push(address)
      },
    },
  })
}

function editAddress(address: Address) {
  keepRouter.push(`/address/edit/${address.id}`, {
    metadata: { address },
    events: {
      onUpdate(updated: Address) {
        const idx = addresses.value.findIndex((a) => a.id === updated.id)
        if (idx !== -1) addresses.value[idx] = updated
      },
      onDelete(id: number) {
        addresses.value = addresses.value.filter((a) => a.id !== id)
      },
    },
  })
}
</script>

<template>
  <div>
    <div v-for="addr in addresses" :key="addr.id" @click="editAddress(addr)">
      {{ addr.name }} - {{ addr.phone }}
    </div>
    <button @click="addAddress">新增地址</button>
  </div>
</template>
```

### 表单页

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter, useEventChannel } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const channel = useEventChannel()

const form = ref({
  name: '',
  phone: '',
  detail: '',
})

function handleSave() {
  const address = { ...form.value, id: Date.now() }
  channel.emit('onSave', address)
  keepRouter.back()
}

function handleUpdate() {
  channel.emit('onUpdate', { ...form.value })
  keepRouter.back()
}

function handleDelete(id: number) {
  channel.emit('onDelete', id)
  keepRouter.back()
}
</script>

<template>
  <div>
    <input v-model="form.name" placeholder="姓名" />
    <input v-model="form.phone" placeholder="手机号" />
    <input v-model="form.detail" placeholder="详细地址" />
    <button @click="handleSave">保存</button>
  </div>
</template>
```

## TypeScript 类型安全

```ts
// types/vue-keep.d.ts
declare module '@bye_past/vue-keep' {
  interface PageEventMap {
    onSave: (address: Address) => void
    onUpdate: (address: Address) => void
    onDelete: (id: number) => void
  }
}
```

配置后，`events` 对象和 `channel.emit` 都会获得完整的类型提示。
