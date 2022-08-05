<template>
  <div id="app">
    <nav>
      <span>不使用缓存：</span>
      <router-link to="/">Home</router-link>
      |
      <router-link to="/about">About</router-link>
      |
      <router-link to="/test">Anonymous</router-link>
    </nav>
    <nav>
      <span>使用缓存：</span>
      <a href="#" @click.prevent="$router.push({ path: '/', cache: true })">Home</a>
      |
      <a href="#" @click.prevent="$router.push({ path: '/about', cache: true })">About</a>
      |
      <a href="#" @click.prevent="$router.push({ path: '/test', cache: true })">Anonymous</a>
    </nav>
    <keep-router-view />
    <!-- <router-view /> -->
  </div>
</template>

<script>
import { WOW } from 'wowjs'

export default {
  watch: {
    $route: {
      handler: function () {
        this.$nextTick(() => {
          // data-wow-duration（动画持续时间)
          // data-wow-delay（动画延迟时间）
          // data-wow-offset（元素的位置露出后距离底部多少像素执行）
          // data-wow-iteration（动画执行次数）
          new WOW({
            boxClass: 'wow', // 类名，在用户滚动时显示隐藏的框。
            animateClass: 'animated', // 触发CSS动画的类名称（animate.css库默认为“ animated”）
            offset: 0, // 定义浏览器视口底部与隐藏框顶部之间的距离。当用户滚动并到达此距离时，隐藏的框会显示出来。
            mobile: true, // 在移动设备上打开/关闭WOW.js。
            live: true // 在页面上同时检查新的WOW元素。
            // scrollContainer: ".keep",
          }).init()
        })
      },
      immediate: true
    }
  }
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
