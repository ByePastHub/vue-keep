<template>
  <div>
    <h2>Anonymous Component</h2>
    <input v-model="value" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class Test extends Vue {
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
