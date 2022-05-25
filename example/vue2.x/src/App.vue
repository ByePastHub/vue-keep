<template>
  <div id="app">
    <keep-router-view />
    <van-tabbar v-model="active" v-if="showTabbar">
      <van-tabbar-item icon="cart" @click="jump('cart')">
        购物车
      </van-tabbar-item>
      <van-tabbar-item icon="manager" @click="jump('user')">
        个人中心
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { Tabbar, TabbarItem } from "vant";

export default {
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },

  data() {
    return {
      active: 0,
      showTabbar: false,
    };
  },

  watch: {
    "$route.name": function (name) {
      this.$route.name === "cart" ? (this.active = 0) : (this.active = 1);
      this.showTabbar = ["cart", "user"].includes(name);
    },
  },

  methods: {
    jump(name) {
      this.$router.replace({ name, cache: true });
    },
  },
};
</script>

<style>
body {
  font-size: 16px;
  background-color: #f8f8f8;
  -webkit-font-smoothing: antialiased;
}
.van-cell__title,
.van-cell--clickable {
  white-space: nowrap;
}
</style>
