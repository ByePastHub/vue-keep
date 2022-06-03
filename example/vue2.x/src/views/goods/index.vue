<template>
  <div class="goods">
    <van-swipe class="goods-swipe" :autoplay="3000">
      <van-swipe-item v-for="thumb in goods.thumb" :key="thumb" @click="$router.push({name: 'cart', cache: true})">
        <img :src="thumb" />
      </van-swipe-item>
    </van-swipe>

    <van-cell-group>
      <van-cell>
        <div class="goods-title">{{ goods.title }}</div>
        <div class="goods-price">{{ formatPrice(goods.price) }}</div>
      </van-cell>
      <van-cell class="goods-express" @click="$router.jump(-1, { cache: true })">
        <van-col span="10">运费：{{ goods.express }}</van-col>
        <van-col span="14">剩余：{{ goods.remain }}</van-col>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
      <van-cell
        value="进入购物车"
        icon="cart"
        is-link
        @click="$router.push({ name: 'cart', cache: true })"
      >
        <template #title>
          <span class="van-cell-text">不销毁购物车页面，跳转回购物车</span>
          <van-tag class="goods-tag" type="danger">点击</van-tag>
        </template>
      </van-cell>
      <van-cell
        title="线下门店"
        icon="cart"
        is-link
        @click="$router.push({ name: 'cart', destroy: 'goods' })"
      >
        <template #title>
          <span class="van-cell-text">销毁购物车页面，跳转回购物车</span>
          <van-tag class="goods-tag" type="danger">点击</van-tag>
        </template>
      </van-cell>
    </van-cell-group>

    <van-cell-group class="goods-cell-group">
      <van-cell
        title="回到购物车，销毁全部页面"
        is-link
        @click="$router.push({ name: 'cart', destroy: 'ALL' })"
      >
        <van-tag class="goods-tag" type="danger">点击</van-tag>
      </van-cell>
    </van-cell-group>

    <van-goods-action>
      <van-goods-action-icon icon="chat-o" @click="sorry">
        客服
      </van-goods-action-icon>
      <van-goods-action-icon icon="cart-o" @click="onClickCart">
        购物车
      </van-goods-action-icon>
      <van-goods-action-button type="warning" @click="addCart">
        加入购物车
      </van-goods-action-button>
      <van-goods-action-button type="danger" @click="sorry">
        立即购买
      </van-goods-action-button>
    </van-goods-action>
  </div>
</template>

<script>
import {
  Tag,
  Col,
  Icon,
  Cell,
  CellGroup,
  Swipe,
  Toast,
  SwipeItem,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
} from "vant";
import { BASE } from "@/config/index";

export default {
  components: {
    [Tag.name]: Tag,
    [Col.name]: Col,
    [Icon.name]: Icon,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Swipe.name]: Swipe,
    [SwipeItem.name]: SwipeItem,
    [GoodsAction.name]: GoodsAction,
    [GoodsActionIcon.name]: GoodsActionIcon,
    [GoodsActionButton.name]: GoodsActionButton,
  },

  data() {
    return {
      goodsList: [
        {
          id: "1",
          title: "进口香蕉",
          desc: "约250g，2根",
          price: 200,
          express: "8.00",
          num: 1,
          thumb: [BASE + "/images/banana.jpeg"],
        },
        {
          id: "2",
          title: "陕西蜜梨",
          desc: "约600g",
          price: 690,
          express: "10.00",
          num: 1,
          thumb: [BASE + "/images/sydney.jpeg"],
        },
        {
          id: "3",
          title: "美国伽力果",
          desc: "约680g/3个",
          price: 2680,
          express: "免运费",
          num: 1,
          thumb: [BASE + "/images/apple1.jpeg", BASE + "/images/apple2.jpeg"],
        },
      ],
      goods: {
        title: "美国伽力果（约680g/3个）",
        price: 2680,
        express: "免运费",
        remain: 19,
        thumb: [
          "https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg",
          "https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg",
        ],
      },
    };
  },

  created() {
    console.log("Goods created");
    this.$toast.loading({
      message: "模拟加载中...",
      forbidClick: true,
      duration: 1000,
    });
    this.getGoods();

    const query = this.$route.query

    this.unBeforeEach = this.$keepRouter.beforeEach(to => {
      console.log('keepRouter.beforeEach')
      if (to.query.id !== query.id) {
        return to.cache = false
      }
      to.cache = true
    })
  },

  activated() {
    console.log("Goods activated");
  },

  destroy() {
    this.unBeforeEach()
  },

  methods: {
    addCart() {
      this.$toast.success({
        message: "添加购物车成功，销毁购物车页面",
      });
      this.$keepRouter.destroy("cart");
    },

    getGoods() {
      let {
        goodsList,
        $route: { query },
      } = this;
      this.goods = goodsList.find((item) => {
        return item.id === query.id && item;
      });
    },

    formatPrice() {
      return "¥" + (this.goods.price / 100).toFixed(2);
    },

    onClickCart() {
      this.$router.push("cart");
    },

    sorry() {
      Toast("暂无后续逻辑~");
    },
  },
};
</script>

<style lang="less">
.goods {
  padding-bottom: 50px;

  &-swipe {
    width: 100%;
    height: 375px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  &-title {
    font-size: 16px;
  }

  &-price {
    color: #f44;
  }

  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }

  &-cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  &-tag {
    margin-left: 5px;
  }
}
</style>
