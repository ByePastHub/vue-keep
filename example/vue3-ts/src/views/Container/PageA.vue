<template>
  <div>
    <div>PageA</div>
    <input v-model="value" />
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from "vue-class-component";
import {  destroy } from '@bye_past/vue-keep';


  @Options({})
  export default class PageA extends Vue {
    private value = ''

    private created() {
      console.log('PageA created')
      this['$toast'].loading({
        message: '模拟加载中...',
        forbidClick: true,
        duration: 1000
      })
    }
    private activated() {
      console.log('PageA activated')
    }

    private beforeRouteLeave (to, from) {
      destroy('PageA')
      return true
    }
  }
  </script>