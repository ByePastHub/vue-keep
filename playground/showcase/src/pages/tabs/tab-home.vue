<script setup lang="ts">
import { ref } from 'vue'
import { onPageShow } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

const showCount = ref(0)

onPageShow(() => {
  showCount.value++
})
</script>

<template>
  <div class="page page-with-header" style="padding-bottom: 76px">
    <AppHeader title="Tab 切换演示" :show-back="false" />

    <div style="padding: 16px">
      <GuideTip text="切换底部 Tab，每个 Tab 的状态独立保持。输入框内容在切换后不会丢失。" />

      <div class="card" style="padding: 16px; margin-bottom: 12px">
        <h2 style="font-size: 18px; margin-bottom: 8px">首页 Tab</h2>
        <p style="font-size: 13px; color: var(--color-text-secondary)">
          onPageShow 触发次数: {{ showCount }}
        </p>
      </div>

      <div class="card" style="padding: 16px">
        <label
          style="
            font-size: 13px;
            font-weight: 600;
            color: var(--color-text-secondary);
            display: block;
            margin-bottom: 6px;
          "
        >
          输入测试（切换 Tab 后内容保持）
        </label>
        <input
          style="
            width: 100%;
            padding: 10px 12px;
            border: 1.5px solid var(--color-border);
            border-radius: 8px;
            font-size: 15px;
            outline: none;
          "
          placeholder="输入一些文字，然后切换 Tab..."
        />
      </div>
    </div>

    <BottomTabBar />
  </div>
</template>
