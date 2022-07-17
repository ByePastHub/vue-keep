<template>
  <div>
    <h2>A</h2>
    <input v-model="value" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class A extends Vue {
  private value = ''

  private created() {
    console.log('A created')
    this['$toast'].loading({
      message: '模拟加载中...',
      forbidClick: true,
      duration: 1000
    })
  }

  private activated() {
    console.log('A activated')
  }
}
</script>
