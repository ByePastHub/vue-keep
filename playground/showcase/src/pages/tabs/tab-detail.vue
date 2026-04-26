<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useKeepRouter, onPageShow } from '@bye_past/vue-keep'
import { ref } from 'vue'
import AppHeader from '../../components/AppHeader.vue'

const route = useRoute()
const keepRouter = useKeepRouter()

// 进入次数
const showCount = ref(0)
onPageShow(() => {
  showCount.value++
})

// 详情数据，根据 id 生成
const id = String(route.params.id ?? '0')
const items = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  label: `详情条目 ${i + 1}`,
  desc: '从 Tab 页面 push 进入的子页，验证前进/返回动画',
}))

function goBack() {
  keepRouter.back()
}
</script>

<template>
  <div class="page page-with-header" style="padding-bottom: 24px">
    <AppHeader :title="`Tab 详情 #${id}`" />
    <div style="padding: 16px">
      <div class="card" style="padding: 16px; margin-bottom: 12px">
        <h2 style="font-size: 18px; margin-bottom: 6px">详情页 #{{ id }}</h2>
        <p style="font-size: 13px; color: var(--color-text-secondary)">
          onPageShow 触发次数: {{ showCount }}
        </p>
        <p style="font-size: 12px; color: var(--color-text-muted); margin-top: 4px">
          从 Tab 页 push 进入此页时应有前进动画，返回时应有返回动画
        </p>
      </div>

      <div style="display: flex; flex-direction: column; gap: 8px">
        <div
          v-for="item in items"
          :key="item.id"
          class="card"
          style="display: flex; align-items: center; padding: 12px 14px; gap: 12px"
        >
          <div
            :style="{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: `hsl(${(item.id * 31) % 360}, 60%, 70%)`,
              flexShrink: 0,
            }"
          ></div>
          <div style="flex: 1; min-width: 0">
            <div style="font-size: 14px; font-weight: 500">{{ item.label }}</div>
            <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px">
              {{ item.desc }}
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-outline" style="margin-top: 16px; width: 100%" @click="goBack">
        返回 Tab 页
      </button>
    </div>
  </div>
</template>
