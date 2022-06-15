<template>
  <!-- 商品详情 -->
  <div class="goods-footer">
    <div class="left">
      <div class="goods-detail">
        <div class="head">商品详情</div>
        <div class="content">
          <img v-for="(img, i) in goods.details.pictures" :key="i" :src="img" />
        </div>
      </div>
    </div>
    <div class="right">
      <div class="goods-hot">
        <h3>每日热榜</h3>
        <GoodsItem
          v-for="item in goods.hotByDay"
          :key="item.id"
          :goods="item"
        />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'GoodsFooter',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>
<style lang="less" scoped>
.goods-footer {
  display: flex;
  margin-top: 20px;
  .left {
    width: 940px;
    margin-right: 20px;
  }
  .right {
    width: 280px;
    min-height: 1000px;
  }
}
.goods-detail {
  background: #fff;
  .head {
    height: 70px;
    line-height: 70px;
    font-size: 18px;
    padding: 0 40px;
    border-bottom: 1px solid #f5f5f5;
  }
  .content {
    padding: 40px;
    img {
      width: 100%;
    }
  }
}
.goods-hot {
  h3 {
    height: 70px;
    background: var(--help-color);
    color: #fff;
    font-size: 18px;
    line-height: 70px;
    padding-left: 25px;
    margin-bottom: 10px;
    font-weight: normal;
  }
  ::v-deep .goods-item {
    background: #fff;
    width: 100%;
    margin-bottom: 10px;
    img {
      width: 200px;
      height: 200px;
    }
    p {
      margin: 0 10px;
    }
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}
</style>
