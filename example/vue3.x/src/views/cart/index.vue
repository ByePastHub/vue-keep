<template>
  <div>
    <van-notice-bar
      left-icon="volume-o"
      wrapable
      text="tips: 商品详情页id发生变化时或手动销毁时才回重新加载，点击一下试试吧"
    />
    <!-- @click="$router.jump({type: 'forward', cache: true })" -->

    <van-checkbox-group class="card-goods" v-model="checkedGoods">
      <van-checkbox
        class="card-goods__item"
        v-for="item in goods"
        :key="item.id"
        :name="item.id"
      >
        <!-- <van-card
          :title="item.title"
          :desc="item.desc"
          :num="item.num"
          :price="formatPrice(item.price)"
          :thumb="item.thumb"
          @click.stop="$router.push({name: 'goods', query: { id: item.id }})"
        /> -->
        <van-card
          :title="item.title"
          :desc="item.desc"
          :num="item.num"
          :price="formatPrice(item.price)"
          :thumb="item.thumb"
          @click.stop="$router.jump({type: 'push', name: 'goods', query: { id: item.id } })"
        />
      </van-checkbox>
    </van-checkbox-group>
    <van-submit-bar
      :price="totalPrice"
      :disabled="!checkedGoods.length"
      :button-text="submitBarText"
      @submit="onSubmit"
    />
  </div>
</template>

<script>
import { NoticeBar, Checkbox, CheckboxGroup, Card, SubmitBar, Toast } from 'vant';
import { BASE } from '@/config/index'

export default {
  components: {
    [NoticeBar.name]: NoticeBar,
    [Card.name]: Card,
    [Checkbox.name]: Checkbox,
    [SubmitBar.name]: SubmitBar,
    [CheckboxGroup.name]: CheckboxGroup
  },

  data() {
    return {
      checkedGoods: ['2'],
      goods: [{
        id: '1',
        title: '进口香蕉',
        desc: '约250g，2根',
        price: 200,
        num: 1,
        thumb: BASE + '/images/banana.jpeg'
      }, {
        id: '2',
        title: '陕西蜜梨',
        desc: '约600g',
        price: 690,
        num: 1,
        thumb: BASE + '/images/sydney.jpeg'
      }, {
        id: '3',
        title: '美国伽力果',
        desc: '约680g/3个',
        price: 2680,
        num: 1,
        thumb: BASE + '/images/apple1.jpeg'
      }]
    };
  },

  created() {
    console.log("Cart created")
  },

  mounted() {
    this.$toast.loading({
      message: '模拟加载中...',
      forbidClick: true,
      duration: 1000
    });
  },

  activated() {
    console.log("Cart activated")
  },

  computed: {
    submitBarText() {
      const count = this.checkedGoods.length;
      return '结算' + (count ? `(${count})` : '');
    },

    totalPrice() {
      return this.goods.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? item.price : 0), 0);
    }
  },

  methods: {
    formatPrice(price) {
      return (price / 100).toFixed(2);
    },

    onSubmit() {
      Toast('点击结算');
    }
  }
};
</script>

<style lang="less" scoped>
.card-goods {
  padding: 10px 0;

  :deep(&__item) {
    position: relative;
    background-color: #fafafa;
    width: 100%;

    .van-checkbox__label {
      width: 90%;
      display: block;
    }

    .van-checkbox__label {
      width: 100%;
      height: auto; // temp
      padding: 0 10px 0 15px;
      box-sizing: border-box;
    }

    .van-checkbox__icon {
      top: 50%;
      left: 10px;
      z-index: 1;
      position: absolute;
      margin-top: -10px;
    }

    .van-card__price {
      color: #f44;
    }
  }

}
.van-submit-bar {
  bottom: 50px;
}
</style>
