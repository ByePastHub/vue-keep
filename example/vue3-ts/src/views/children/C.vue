<template>
  <div>
    <h2>C</h2>
    <input v-model="value" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class C extends Vue {
  private value = ''

  private created() {
    console.log('C created')
    this['$toast'].loading({
      message: '模拟加载中...',
      forbidClick: true,
      duration: 1000
    })
  }

  private activated() {
    console.log('C activated')
  }
}
</script>
