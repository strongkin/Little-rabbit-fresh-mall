<template>
  <RouterLink :to="`/product/${goods.id}`" class="goods-item">
    <img :src="goods.picture || require('@/assets/images/200.png')" alt="" />
    <p class="name ellipsis">{{ goods.name || '&nbsp;' }}</p>
    <p class="desc ellipsis">{{ goods.desc || '&nbsp;' }}</p>
    <p class="price">{{ goods.price ? `&yen;${goods.price}` : '0.00' }}</p>
  </RouterLink>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: {
    goods: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style scoped lang="less">
.goods-item {
  display: block;
  width: 220px;
  padding: 20px 30px;
  text-align: center;
  background: #fff;
  transition: all 0.5s;
  &:hover {
    transform: translate3d(0, -3px, 0);
    box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
  }
  img {
    width: 160px;
    height: 160px;
  }
  p {
    padding-top: 10px;
  }
  .name {
    font-size: 16px;
  }
  .desc {
    color: #999;
    height: 29px;
  }
  .price {
    color: var(--price-color);
    font-size: 20px;
  }
}
</style>
