<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <div class="guide-tip">
    <svg
      class="tip-icon"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
    <span class="tip-text">{{ text }}</span>
  </div>
</template>

<style scoped>
.guide-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 12px 16px;
  padding: 12px 14px;
  background: color-mix(in srgb, var(--color-info) 8%, transparent);
  border-radius: var(--radius-sm);
  border-left: 3px solid var(--color-info);
}

.tip-icon {
  color: var(--color-info);
  flex-shrink: 0;
  margin-top: 1px;
}

.tip-text {
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
</style>
