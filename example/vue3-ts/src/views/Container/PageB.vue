<template>
  <div>
    <div>PageB</div>
    <input v-model="value" />
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from "vue-class-component";

  @Options({})
  export default class PageB extends Vue {
    private value = ''

    private created() {
      console.log('PageB created')
      this['$toast'].loading({
        message: '模拟加载中...',
        forbidClick: true,
        duration: 1000
      })
    }

    private activated() {
      console.log('PageB activated')
    }
  }
  </script>