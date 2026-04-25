# Scroll Restoration

Vue Keep automatically saves and restores scroll positions when navigating back. This guide covers advanced scenarios.

## How It Works

By default (`scrollBehavior: 'auto'`):

- **Forward navigation**: scroll resets to top
- **Back navigation**: scroll restores to the saved position

Scroll positions are captured from all detected scroll containers before leaving a page and stored in the `PageStackEntry.scrollPositions` map.

## Lazy-Loaded Images

When a page has lazy-loaded images, the page height at restore time may be shorter than when the scroll was captured. Vue Keep stores `scrollHeight` at capture time so it can handle proportional restoration.

For best results, set explicit dimensions on image containers:

```vue
<template>
  <div class="image-card" style="aspect-ratio: 16/9;">
    <img loading="lazy" :src="item.image" />
  </div>
</template>
```

If you need to wait for images to load before restoring:

```vue
<script setup lang="ts">
import { onPageShow, useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

onPageShow(async ({ isFirstShow }) => {
  if (!isFirstShow) {
    // Wait for images, then restore
    await nextTick()
    await scroll.restore()
  }
})
</script>
```

## Multiple Scroll Containers

By default, Vue Keep detects the main document scroll and elements with `overflow: auto/scroll`. To explicitly register additional containers:

### Via Props

```vue
<KeepRouterView :scroll-containers="['.sidebar', '#chat-list']" />
```

### Via Composable

```vue
<script setup lang="ts">
import { onMounted } from 'vue'
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

onMounted(() => {
  scroll.registerContainer('.sidebar')
  scroll.registerContainer('#chat-list')
})
</script>
```

## Virtual Scroll Lists

Virtual scroll libraries only render visible items. Standard scroll restoration won't work because the DOM doesn't contain the target scroll offset content.

Strategy: save the virtual scroll state (e.g., start index) in metadata, then restore it manually.

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { usePageCache, onPageShow, onPageHide } from '@bye_past/vue-keep'

const startIndex = ref(0)
const { setConstCache } = usePageCache()

onPageHide(() => {
  // Save virtual scroll state — handled by your virtual list library
})

onPageShow(({ isFirstShow }) => {
  if (!isFirstShow) {
    // Restore virtual scroll position
    virtualListRef.value?.scrollToIndex(startIndex.value)
  }
})
</script>
```

## Disable Per Page

Use the `scrollBehavior` function to skip restoration for specific routes:

```ts
createKeepRouter({
  router,
  scrollBehavior(to, from, direction, savedPositions) {
    // Disable scroll restore for the search page
    if (to.name === 'Search') return false
    // Default behavior for everything else
    if (direction === 'back' && savedPositions.size > 0) {
      return [...savedPositions.values()][0]!
    }
    return { left: 0, top: 0 }
  },
})
```

Or pause/resume at the component level:

```vue
<script setup lang="ts">
import { useScrollRestoration } from '@bye_past/vue-keep'

const scroll = useScrollRestoration()

// Disable automatic scroll restoration for this page
scroll.pause()
</script>
```
