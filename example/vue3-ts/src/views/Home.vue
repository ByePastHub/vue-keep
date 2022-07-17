<template>
  <div class="home">
    <h2>Home</h2>
    <input v-model="value" />
    <div></div>
    <img alt="Vue logo" class="wow bounceInUp" data-wow-duration="1s" data-wow-delay="0s" src="../assets/vue.svg" />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import HelloWorld from '@/components/HelloWorld.vue' // @ is an alias to /src

@Options({
  components: {
    HelloWorld,
  }
})
export default class Home extends Vue {
  private value = ''

  private created() {
    console.log('Home created')
    this['$toast'].loading({
      message: '模拟加载中...',
      forbidClick: true,
      duration: 1000
    })
  }

  private activated() {
    console.log('Home activated')
  }
}
</script>
