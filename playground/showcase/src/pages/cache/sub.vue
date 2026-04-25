<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useKeepRouter, usePageCache } from '@bye_past/vue-keep'
import AppHeader from '../../components/AppHeader.vue'
import FeatureBadge from '../../components/FeatureBadge.vue'

const route = useRoute()
const keepRouter = useKeepRouter()
const { entry, setConstCache, destroySelf } = usePageCache()
</script>

<template>
  <div class="page page-with-header">
    <AppHeader :title="`子页面 #${route.params.id}`" />

    <div class="content">
      <div class="status card">
        <div style="padding: 16px">
          <h3 style="font-size: 15px; margin-bottom: 12px">页面状态</h3>
          <div class="status-row">
            <span>页面 ID</span>
            <span>{{ route.params.id }}</span>
          </div>
          <div class="status-row">
            <span>constCache</span>
            <FeatureBadge
              :label="entry?.constCache ? 'ON' : 'OFF'"
              :color="entry?.constCache ? 'var(--color-warning)' : 'var(--color-text-muted)'"
            />
          </div>
        </div>
      </div>

      <div class="actions">
        <button class="btn btn-outline" @click="setConstCache(!entry?.constCache)">
          切换 constCache
        </button>
        <button
          class="btn btn-danger btn-sm"
          @click="
            destroySelf()
            keepRouter.back()
          "
        >
          销毁自身
        </button>
      </div>

      <button
        class="btn btn-primary"
        style="width: 100%; margin-top: 12px; padding: 0 16px"
        @click="keepRouter.back()"
      >
        ← 返回
      </button>
    </div>
  </div>
</template>

<style scoped>
.content {
  padding: 16px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
}

.status-row:last-child {
  border-bottom: none;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 16px;
}
</style>
