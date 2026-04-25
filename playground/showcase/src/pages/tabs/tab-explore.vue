<script setup lang="ts">
import { ref } from 'vue'
import { onPageShow } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

const showCount = ref(0)

onPageShow(() => {
  showCount.value++
})

const items = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  title: `发现内容 ${i + 1}`,
  color: `hsl(${(i * 23) % 360}, 60%, 75%)`,
}))
</script>

<template>
  <div class="page page-with-header" style="padding-bottom: 76px">
    <AppHeader title="Tab 切换演示" :show-back="false" />

    <div style="padding: 16px">
      <div class="card" style="padding: 16px; margin-bottom: 12px">
        <h2 style="font-size: 18px; margin-bottom: 4px">发现 Tab</h2>
        <p style="font-size: 13px; color: var(--color-text-secondary)">
          onPageShow: {{ showCount }} 次 · 滚动此列表后切换 Tab 再回来
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px">
        <div
          v-for="item in items"
          :key="item.id"
          class="card"
          style="display: flex; align-items: center; gap: 12px; padding: 12px"
        >
          <div
            :style="{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              background: item.color,
              flexShrink: 0,
            }"
          ></div>
          <span style="font-size: 14px">{{ item.title }}</span>
        </div>
      </div>
    </div>

    <BottomTabBar />
  </div>
</template>
