<template>
  <div class="container">
    <span @click.stop="jump('PageA')">PageA | </span>
    <span @click.stop="jump('PageB')">PageB</span>
    <keep-router-view :max="10" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function jump(name) {
  router.replace({ name, cache: false })
}
</script>

<style lang="less" scoped>

</style>
