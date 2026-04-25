<script setup lang="ts">
import { ref } from 'vue'
import { onPageShow } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
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
      <div class="card" style="padding: 16px; margin-bottom: 12px">
        <h2 style="font-size: 18px; margin-bottom: 4px">我的 Tab</h2>
        <p style="font-size: 13px; color: var(--color-text-secondary)">
          onPageShow: {{ showCount }} 次
        </p>
      </div>

      <div class="card" style="overflow: hidden">
        <div
          style="
            padding: 32px;
            text-align: center;
            background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
          "
        >
          <div
            style="
              width: 64px;
              height: 64px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.2);
              margin: 0 auto 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 28px;
              color: white;
            "
          >
            U
          </div>
          <div style="color: white; font-size: 16px; font-weight: 600">Demo User</div>
        </div>
        <div style="padding: 4px 0">
          <div
            style="
              padding: 14px 16px;
              border-bottom: 1px solid var(--color-border);
              font-size: 14px;
            "
          >
            我的订单
          </div>
          <div
            style="
              padding: 14px 16px;
              border-bottom: 1px solid var(--color-border);
              font-size: 14px;
            "
          >
            收货地址
          </div>
          <div style="padding: 14px 16px; font-size: 14px">设置</div>
        </div>
      </div>
    </div>

    <BottomTabBar />
  </div>
</template>
