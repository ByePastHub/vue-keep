<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  desc: string
  color?: string
}>()
</script>

<template>
  <div class="feature-card card" :style="{ '--card-color': color || 'var(--color-primary)' }">
    <div class="card-icon">{{ icon }}</div>
    <div class="card-body">
      <div class="card-title">{{ title }}</div>
      <div class="card-desc">{{ desc }}</div>
    </div>
    <svg
      class="card-arrow"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  </div>
</template>

<style scoped>
.feature-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
}

.feature-card:active {
  transform: scale(0.98);
  box-shadow: var(--shadow-md);
}

.card-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  background: color-mix(in srgb, var(--card-color) 12%, transparent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  flex-shrink: 0;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 15px;
  font-weight: 600;
  margin-bottom: 2px;
}

.card-desc {
  font-size: 12px;
  color: var(--color-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-arrow {
  color: var(--color-text-muted);
  flex-shrink: 0;
}
</style>
