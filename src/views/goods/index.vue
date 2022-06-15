<template>
  <div class="xtx-goods-page">
    <div class="container" v-if="loading">
      <div class="loading"></div>
    </div>
    <div class="container" v-else>
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <!-- :to="`/category/${goods.categories[1].id}`" -->
        <XtxBreadItem :to="`/category/${goods.categories[1].id}`">{{
          goods.categories[1].name
        }}</XtxBreadItem>
        <XtxBreadItem>{{ goods.name }}</XtxBreadItem>
      </XtxBread>
      <!-- 商品信息 -->
      <div class="good-wrapper">
        <div class="media">
          <XtxImageView :images="goods.mainPictures">123</XtxImageView>
          <GoodsSales />
        </div>
        <div class="spec">
          <GoodsInfo :goods="goods" />
          <XtxSku :goods="goods" @change="changeSku" />
          <XtxNumbox :min="1" v-model="count" label="数量"></XtxNumbox>
          <XtxButton
            @click="insertCart"
            type="primary"
            style="margin-top: 20px; margin-left: 60px"
            >加入购物车</XtxButton
          >
        </div>
      </div>
      <!-- 推荐商品 -->
      <!-- 商品详情 -->
      <!-- 热榜 -->
      <GoodsFooter :goods="goods" />
    </div>
  </div>
</template>

<script>
import { getGoods } from '@/api/goods'
import { ref, onMounted } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import GoodsSales from './components/good-sales.vue'
import GoodsInfo from './components/goods-info.vue'
import GoodsFooter from './components/goods-footer.vue'
import { useStore } from 'vuex'
import Message from 'erabbit-ui/packages/components/Message'
export default {
  name: 'xtx-goods-page',
  components: {
    GoodsSales,
    GoodsInfo,
    GoodsFooter
  },
  setup() {
    const goods = ref(null)
    const loading = ref(true)
    // 加载数据函数
    const loadData = async (id) => {
      loading.value = true
      const data = await getGoods(id)
      console.log(data, '7891')
      goods.value = data.result
      console.log(goods, '789')
      loading.value = false
    }
    const route = useRoute()
    // 初始化加载
    onMounted(() => {
      loadData(route.params.id)
    })
    //将来切换商品加载
    onBeforeRouteUpdate((to, from, next) => {
      loadData(to.params.id)
      next()
    })
    const currSku = ref(null)
    const changeSku = (ret) => {
      console.log(ret, 'ret')
      if (ret.skuId) {
        goods.value.price = ret.price
        goods.value.oldPrice = ret.oldPrice
        goods.value.inventory = ret.inventory
        count.value = 1
        currSku.value = ret
      } else {
        currSku.value = null
      }
    }
    const count = ref(1)
    // 加入购物车逻辑
    // const currSku = ref(null)
    const store = useStore()
    const insertCart = () => {
      if (!currSku.value) {
        return Message({ text: '请选择商品规格' })
      }
      if (count.value > goods.value.inventory) {
        return Message({ text: '库存不足' })
      }
      store
        .dispatch('cart/insertCart', {
          id: goods.value.id,
          skuId: currSku.value.skuId,
          name: goods.value.name,
          picture: goods.value.mainPictures[0],
          price: currSku.value.price,
          nowPrice: currSku.value.price,
          count: count.value,
          attrsText: currSku.value.specsText,
          selected: true,
          isEffective: true,
          stock: currSku.value.inventory
        })
        .then(() => {
          Message({ text: '加入购物车成功', type: 'success' })
        })
        .catch(() => {
          Message({ type: 'error', text: '加入购物车失败' })
        })
    }
    return { goods, loading, changeSku, count, insertCart }
  }
}
</script>

<style lang="less" scoped>
.loading {
  height: 600px;
  border-top: 72px solid #f5f5f5;
  background: #fff url(@/assets/images/load.gif) no-repeat center / 80px 80px;
}
.goods-wrapper {
  display: flex;
  background: #fff;
  padding: 40px;
  .media {
    width: 480px;
    margin-right: 40px;
  }
}
</style>
