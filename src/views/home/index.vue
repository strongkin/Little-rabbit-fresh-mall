<template>
  <div class="xtx-home-page">
    <div class="home-entry">
      <div class="container">
        <!-- 左侧分类 -->
        <HomeCategory />
        <div class="home-banner">
          <!-- 轮播图 -->
          <XtxCarousel :sliders="sliders" autoPlay></XtxCarousel>
        </div>
        <!-- 新鲜好物 -->
        <HomeNew />
        <!-- 人气推荐 -->
        <HomeHot />
        <!-- 热门品牌 -->
        <HomeBrand />
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import HomeCategory from './components/home-category.vue'
import { getSliders } from '@/api/home'
import HomeNew from './components/home-new.vue'
import HomeHot from './components/home-hot.vue'
import HomeBrand from './components/home-brand.vue'
export default {
  name: 'xtx-home-page',
  components: {
    HomeCategory,
    HomeNew,
    HomeHot,
    HomeBrand
  },
  setup() {
    // 获取轮播图
    const sliders = ref([])
    onMounted(async () => {
      const data = await getSliders()
      console.log('轮播图', data)
      sliders.value = data.result
    })
    const show = ref(true)
    return { sliders, show }
  }
}
</script>

<style lang="less" scoped>
.home-banner {
  width: 1240px;
  height: 500px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 98;
  .xtx-carousel {
    width: 100%;
    height: 100%;
    :deep(.carousel-btn.prev) {
      left: 270px;
    }
    :deep(.carousel-indicator) {
      padding-left: 250px;
    }
  }
}
</style>
