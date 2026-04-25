# Form Page Communication

A common mobile pattern: a form page pushes to a picker/selector page, the user makes a selection, and the result is sent back. Vue Keep's EventChannel makes this seamless.

## Basic Pattern

### Form Page (source)

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const city = ref('')

async function pickCity() {
  await keepRouter.push('/city-picker', {
    events: {
      // This listener runs on the form page when the picker emits 'select'
      select(selected: string) {
        city.value = selected
      },
    },
  })
}
</script>

<template>
  <div class="form">
    <div class="field" @click="pickCity">
      <label>City</label>
      <span>{{ city || 'Select a city' }}</span>
    </div>
  </div>
</template>
```

### Picker Page (target)

```vue
<script setup lang="ts">
import { useEventChannel, useKeepRouter } from '@bye_past/vue-keep'

const channel = useEventChannel<{ select: string }>()
const keepRouter = useKeepRouter()

const cities = ['New York', 'London', 'Tokyo', 'Paris']

function onSelect(city: string) {
  channel?.emit('select', city)
  keepRouter.back()
}
</script>

<template>
  <ul>
    <li v-for="city in cities" :key="city" @click="onSelect(city)">
      {{ city }}
    </li>
  </ul>
</template>
```

## Multiple Fields

Register different event names for different fields:

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

const keepRouter = useKeepRouter()
const address = ref({ city: '', district: '' })

async function pickCity() {
  await keepRouter.push('/city-picker', {
    events: {
      select(city: string) {
        address.value.city = city
        address.value.district = '' // Reset dependent field
      },
    },
  })
}

async function pickDistrict() {
  await keepRouter.push(`/district-picker?city=${address.value.city}`, {
    events: {
      select(district: string) {
        address.value.district = district
      },
    },
  })
}
</script>
```

## Returning Complex Data

```vue
<!-- Source page -->
<script setup lang="ts">
import { ref } from 'vue'
import { useKeepRouter } from '@bye_past/vue-keep'

interface Product {
  id: number
  name: string
  price: number
}

const keepRouter = useKeepRouter()
const selectedProducts = ref<Product[]>([])

async function pickProducts() {
  await keepRouter.push('/product-picker', {
    events: {
      confirm(products: Product[]) {
        selectedProducts.value = products
      },
    },
  })
}
</script>
```

```vue
<!-- Picker page -->
<script setup lang="ts">
import { ref } from 'vue'
import { useEventChannel, useKeepRouter } from '@bye_past/vue-keep'

const channel = useEventChannel<{ confirm: Product[] }>()
const keepRouter = useKeepRouter()
const selected = ref<Product[]>([])

function confirm() {
  channel?.emit('confirm', selected.value)
  keepRouter.back()
}
</script>
```

## Chained Pickers

When a picker opens another picker, each level gets its own channel:

```
Form → City Picker → District Picker
```

Each `push` with `events` creates a separate channel. The district picker emits to the city picker, which then emits to the form.
