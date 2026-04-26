<script setup lang="ts">
import { ref } from 'vue'
import { onPageShow } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import BottomTabBar from '../../components/BottomTabBar.vue'

const showCount = ref(0)

onPageShow(() => {
  showCount.value++
})

const browsingHistory = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  title: `浏览记录 ${i + 1}`,
  time: '3天前',
  color: `hsl(${i * 36}, 60%, 65%)`,
}))
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
      <div class="card" style="overflow: hidden; margin-bottom: 12px">
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
      <div class="card" style="display: flex; padding: 20px 0; margin-bottom: 12px">
        <div style="flex: 1; text-align: center">
          <div style="font-size: 20px; font-weight: 700">128</div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px">
            收藏
          </div>
        </div>
        <div style="flex: 1; text-align: center">
          <div style="font-size: 20px; font-weight: 700">56</div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px">
            关注
          </div>
        </div>
        <div style="flex: 1; text-align: center">
          <div style="font-size: 20px; font-weight: 700">1.2k</div>
          <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 4px">
            粉丝
          </div>
        </div>
      </div>
      <div class="card" style="margin-bottom: 12px">
        <div style="padding: 4px 0">
          <div
            style="
              padding: 14px 16px;
              border-bottom: 1px solid var(--color-border);
              font-size: 14px;
            "
          >
            我的钱包
          </div>
          <div
            style="
              padding: 14px 16px;
              border-bottom: 1px solid var(--color-border);
              font-size: 14px;
            "
          >
            优惠券
          </div>
          <div
            style="
              padding: 14px 16px;
              border-bottom: 1px solid var(--color-border);
              font-size: 14px;
            "
          >
            会员中心
          </div>
          <div style="padding: 14px 16px; font-size: 14px">帮助与反馈</div>
        </div>
      </div>
      <div class="card" style="margin-bottom: 12px">
        <div style="padding: 4px 0">
          <div
            style="
              padding: 14px 16px;
              border-bottom: 1px solid var(--color-border);
              font-size: 14px;
            "
          >
            隐私设置
          </div>
          <div
            style="
              padding: 14px 16px;
              border-bottom: 1px solid var(--color-border);
              font-size: 14px;
            "
          >
            通用设置
          </div>
          <div
            style="
              padding: 14px 16px;
              border-bottom: 1px solid var(--color-border);
              font-size: 14px;
            "
          >
            关于我们
          </div>
          <div style="padding: 14px 16px; font-size: 14px">清除缓存</div>
        </div>
      </div>
      <h3 style="font-size: 15px; font-weight: 600; margin-bottom: 10px">最近浏览</h3>
      <div class="card" style="margin-bottom: 12px">
        <div style="padding: 4px 0">
          <div
            v-for="(item, index) in browsingHistory"
            :key="item.id"
            style="display: flex; align-items: center; gap: 12px; padding: 12px 16px"
            :style="{
              borderBottom:
                index < browsingHistory.length - 1 ? '1px solid var(--color-border)' : 'none',
            }"
          >
            <div
              :style="{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                background: item.color,
                flexShrink: 0,
              }"
            />
            <div style="flex: 1; min-width: 0">
              <div style="font-size: 14px; font-weight: 500">{{ item.title }}</div>
              <div style="font-size: 12px; color: var(--color-text-secondary); margin-top: 2px">
                {{ item.time }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        style="
          text-align: center;
          color: var(--color-text-secondary);
          font-size: 12px;
          padding: 24px 0 16px;
        "
      >
        版本 2.0.0-alpha
      </div>
    </div>
    <BottomTabBar />
  </div>
</template>
