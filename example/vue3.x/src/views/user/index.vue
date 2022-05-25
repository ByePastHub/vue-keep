<template>
  <div>
    <img class="user-poster" src="https://img.yzcdn.cn/public_files/2017/10/23/8690bb321356070e0b8c4404d087f8fd.png">
    <van-row class="user-links">
      <van-col span="6">
        <van-icon name="pending-payment" />
        待付款
      </van-col>
      <van-col span="6">
        <van-icon name="records" />
        待接单
      </van-col>
      <van-col span="6">
        <van-icon name="tosend" />
        待发货
      </van-col>
      <van-col span="6">
        <van-icon name="logistics" />
        已发货
      </van-col>
    </van-row>

    <van-cell-group class="user-group">
      <van-cell style="background-color: lavender;" icon="cart" title="我的购物车(缓存)" is-link @click="$router.replace({name: 'cart', cache: true})">
        <van-tag class="goods-tag" type="danger">点击</van-tag>
      </van-cell>
      <van-cell style="background-color: lavender;" icon="cart" title="我的购物车(重新加载)" is-link @click="$router.replace({name: 'cart'})">
        <van-tag class="goods-tag" type="danger">点击</van-tag>
      </van-cell>
      <van-cell style="background-color: lavender;" icon="cart" title="我的购物车(清除全部缓存)" is-link @click="$router.replace({name: 'cart', destroy: 'ALL'})">
        <van-tag class="goods-tag" type="danger">点击</van-tag>
      </van-cell>
    </van-cell-group>

    <van-cell-group>
      <van-cell icon="points" title="我的积分" />
      <van-cell icon="gold-coin-o" title="我的优惠券" />
      <van-cell icon="gift-o" title="我收到的礼物" />
    </van-cell-group>
  </div>
</template>

<script>
import { Tag, Row, Col, Icon, Cell, CellGroup } from 'vant';

export default {
  components: {
    [Tag.name]: Tag,
    [Row.name]: Row,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },

  beforeCreate() {
    console.log('User beforeCreate')
  },

  // created() {
  //   console.log("User created")
  // },

  mounted() {
    this.$toast.loading({
      message: '模拟加载中...',
      forbidClick: true,
      duration: 1000
    });
  },

  activated() {
    console.log("User activated")
  },
};
</script>

<style lang="less" scoped>
.user {
  &-poster {
    width: 100%;
    height: 53vw;
    display: block;
  }

  &-group {
    margin-bottom: 15px;
  }

  &-links {
    padding: 15px 0;
    font-size: 12px;
    text-align: center;
    background-color: #fff;

    .van-icon {
      display: block;
      font-size: 24px;
    }
  }
}
</style>
