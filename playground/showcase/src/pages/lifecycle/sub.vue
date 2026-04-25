<script setup lang="ts">
import { ref } from 'vue'
import { onPageShow, onPageHide, useKeepRouter } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'

const keepRouter = useKeepRouter()
const showCount = ref(0)
const hideCount = ref(0)

onPageShow((_ctx) => {
  showCount.value++
})

onPageHide(() => {
  hideCount.value++
})
</script>

<template>
  <div class="page page-with-header">
    <AppHeader title="生命周期子页面" />

    <div style="padding: 16px">
      <div class="card" style="padding: 20px; text-align: center">
        <h2 style="font-size: 18px; margin-bottom: 12px">子页面</h2>
        <p style="font-size: 13px; color: var(--color-text-secondary); margin-bottom: 16px">
          返回上一页后，观察父页面的 onPageShow 日志
        </p>

        <div style="display: flex; justify-content: center; gap: 24px; margin-bottom: 20px">
          <div>
            <div style="font-size: 28px; font-weight: 700; color: var(--color-success)">
              {{ showCount }}
            </div>
            <div style="font-size: 12px; color: var(--color-text-muted)">onPageShow</div>
          </div>
          <div>
            <div style="font-size: 28px; font-weight: 700; color: var(--color-warning)">
              {{ hideCount }}
            </div>
            <div style="font-size: 12px; color: var(--color-text-muted)">onPageHide</div>
          </div>
        </div>

        <button class="btn btn-primary" @click="keepRouter.back()">返回上一页</button>
      </div>
    </div>
  </div>
</template>
