<script setup lang="ts">
import { ref } from 'vue'
import { onPageShow, useKeepRouter } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import GuideTip from '../../components/GuideTip.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

const showCount = ref(0)
const keepRouter = useKeepRouter()

onPageShow(() => {
  showCount.value++
})

// 跳详情页（验证 Tab 内 push 子页的过渡动画）
async function openDetail(id: number) {
  await keepRouter.push(`/tabs/detail/${id}`)
}

const quickActions = [
  { label: '扫一扫', color: '#42b883' },
  { label: '付款码', color: '#3b82f6' },
  { label: '乘车码', color: '#f59e0b' },
  { label: '医疗健康', color: '#ef4444' },
  { label: '消息', color: '#8b5cf6' },
  { label: '卡包', color: '#ec4899' },
  { label: '收藏', color: '#f97316' },
  { label: '更多', color: '#6b7280' },
]

const hotItems = Array.from({ length: 6 }, (_, i) => ({
  id: i + 1,
  title: `推荐 ${i + 1}`,
  subtitle: ['限时特惠', '新品上线', '热销爆款', '精选好物', '会员专享', '今日必看'][i]!,
  gradient: [
    'linear-gradient(135deg, #42b883, #35495e)',
    'linear-gradient(135deg, #3b82f6, #8b5cf6)',
    'linear-gradient(135deg, #f59e0b, #ef4444)',
    'linear-gradient(135deg, #ec4899, #8b5cf6)',
    'linear-gradient(135deg, #10b981, #3b82f6)',
    'linear-gradient(135deg, #f97316, #f59e0b)',
  ][i]!,
}))

const recentItems = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  title: `动态消息 ${i + 1}`,
  date: `2026-04-${String(26 - i).padStart(2, '0')}`,
  color: `hsl(${(i * 47) % 360}, 55%, 60%)`,
}))
</script>

<template>
  <div class="page page-with-header" style="padding-bottom: 76px">
    <AppHeader title="Tab 切换演示" :show-back="false" />

    <div style="padding: 16px">
      <GuideTip text="切换底部 Tab，每个 Tab 的状态独立保持。输入框内容在切换后不会丢失。" />

      <button class="btn btn-primary" style="width: 100%; margin: 12px 0" @click="openDetail(1)">
        进入 Tab 详情页（验证前进 / 返回动画）
      </button>

      <div class="card" style="padding: 16px; margin-bottom: 12px">
        <h2 style="font-size: 18px; margin-bottom: 8px">首页 Tab</h2>
        <p style="font-size: 13px; color: var(--color-text-secondary)">
          onPageShow 触发次数: {{ showCount }}
        </p>
      </div>

      <div class="card" style="padding: 16px; margin-bottom: 12px">
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

      <div style="margin-bottom: 12px">
        <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 10px">快捷入口</h3>
        <div
          class="card"
          style="padding: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px"
        >
          <div
            v-for="(action, idx) in quickActions"
            :key="idx"
            style="display: flex; flex-direction: column; align-items: center; gap: 8px"
          >
            <div
              :style="{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: action.color,
                opacity: 0.85,
              }"
            ></div>
            <span style="font-size: 12px; color: var(--color-text-secondary)">
              {{ action.label }}
            </span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 12px">
        <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 10px">热门推荐</h3>
        <div
          style="
            display: flex;
            gap: 10px;
            overflow-x: auto;
            padding-bottom: 4px;
            -webkit-overflow-scrolling: touch;
          "
        >
          <div
            v-for="item in hotItems"
            :key="item.id"
            style="
              flex-shrink: 0;
              width: 120px;
              height: 150px;
              border-radius: 12px;
              padding: 14px;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              color: white;
            "
            :style="{ background: item.gradient }"
          >
            <span style="font-size: 15px; font-weight: 600">{{ item.title }}</span>
            <span style="font-size: 11px; opacity: 0.85; margin-top: 4px">
              {{ item.subtitle }}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 10px">最近动态</h3>
        <div style="display: flex; flex-direction: column; gap: 8px">
          <div
            v-for="item in recentItems"
            :key="item.id"
            class="card"
            style="
              display: flex;
              align-items: center;
              padding: 12px 14px;
              gap: 12px;
              cursor: pointer;
            "
            @click="openDetail(item.id)"
          >
            <div
              :style="{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: item.color,
                flexShrink: 0,
              }"
            ></div>
            <div style="flex: 1; min-width: 0">
              <div style="font-size: 14px; font-weight: 500">{{ item.title }}</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px">
                {{ item.date }}
              </div>
            </div>
            <span style="font-size: 14px; color: var(--color-text-secondary)">›</span>
          </div>
        </div>
      </div>
    </div>

    <BottomTabBar />
  </div>
</template>
