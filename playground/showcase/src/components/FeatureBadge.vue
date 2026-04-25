<script setup lang="ts">
defineProps<{
  label: string
  color?: string
}>()
</script>

<template>
  <span class="badge" :style="{ '--badge-color': color || 'var(--color-primary)' }">
    {{ label }}
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 600;
  border-radius: var(--radius-full);
  background: color-mix(in srgb, var(--badge-color) 12%, transparent);
  color: var(--badge-color);
  letter-spacing: 0.3px;
}
</style>
