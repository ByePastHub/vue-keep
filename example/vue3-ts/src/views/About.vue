<template>
  <div>
    <h2>About</h2>
    <input v-model="value" />
    <div>
      <span>不使用缓存：</span>
      <router-link to="/about/a" :cache="true">A</router-link>
      &nbsp;&nbsp;
      <router-link to="/about/b" :cache="true">B</router-link>
      &nbsp;&nbsp;
      <router-link to="/about/c" :cache="true">C</router-link>
      &nbsp;&nbsp;
    </div>
    <div>
      <span>使用缓存：</span>
      <a href="#" @click.prevent="$router.push({ path: '/about/a', cache: true })">A</a>
      &nbsp;&nbsp;
      <a href="#" @click.prevent="$router.push({ path: '/about/b', cache: true })">B</a>
      &nbsp;&nbsp;
      <a href="#" @click.prevent="$router.jump({ type: 'push', path: '/about/c', cache: true })">C</a>
    </div>
    <keep-router-view />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({})
export default class About extends Vue {
  private value = ''

  private created() {
    console.log('About created')
    this['$toast'].loading({
      message: '模拟加载中...',
      forbidClick: true,
      duration: 1000
    })
  }

  private activated() {
    console.log('About activated')
  }
}
</script>
