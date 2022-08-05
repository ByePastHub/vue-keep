<template>
  <div>
    <h2>Anonymous Component</h2>
    <input v-model="value" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class extends Vue {
  private value = ''

  private created() {
    console.log('Anonymous created')
    this['$toast'].loading({
      message: '模拟加载中...',
      forbidClick: true,
      duration: 1000
    })
  }

  private activated() {
    console.log('Anonymous activated')
  }
}
</script>
