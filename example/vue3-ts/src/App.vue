<template>
  <div id="app">
    <nav>
      <span>不使用缓存：</span>
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
      |
      <router-link to="/test">Test</router-link>
      <div @click.stop="$router.push({name: 'Container'})">Container</div>
    </nav>
    <nav>
      <span>使用缓存：</span>
      <a href="#" @click.prevent="jump('/')">Home</a>
      |
      <a href="#" @click.prevent="jump('/about')">About</a>
      |
      <a href="#" @click.prevent="jump('/test')">Test</a>
      <div @click.stop="$router.push({name: 'Container',  cache: true})">Container</div>
    </nav>
    <keep-router-view :max="10" />
    <!-- <router-view /> -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { destroy } from '../../../dist/vue-keep.esm.js';

const router = useRouter()

function jump(path) {
  // destroy(['PageA', 'PageB'])
  router.push({ path, cache: true })
}
</script>


<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
