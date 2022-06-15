<template>
  <div class="top-category">
    <div class="contanier">
      <!-- 面包屑 -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <XtxBreadItem :key="category.id">{{ category.name }}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <!-- 轮播图 -->
      <XtxCarousel :sliders="sliders" style="height: 500px" />
      <!-- 所有二级分类 -->
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in category.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" />
              <p>{{ sub.name }}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- 分类关联商品 -->
      <div class="ref-goods" v-for="sub in category.children" :key="sub.id">
        <div class="head">
          <h3>- {{ sub.name }} -</h3>
          <p class="tag">温暖柔软，品质之选</p>
          <XtxMore />
        </div>
        <div class="body">
          <GoodsItem v-for="item in sub.goods" :key="item.id" :goods="item" />
          <div v-if="!sub.goods.length" class="none">暂无商品</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTopCategory } from '@/api/goods'
import { getSliders } from '@/api/home'
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
export default {
  name: 'TopCategory',
  setup() {
    const sliders = ref([])
    // 调用API获取数据
    const initSliders = async () => {
      // 实际：获取广告信息的时候传入分类的ID，模拟不同的轮播图数据，随机轮播图数据
      const data = await getSliders()
      // sort(() => Math.random() - 0.5); 打乱数组的顺序
      sliders.value = data.result.sort(() => Math.random() - 0.5)
    }
    onMounted(initSliders)
    // 需求：切换分类的时候 轮播图数据更新（重新发请求）
    // 1. 发现，切换分类的时候，只是参数的改变（id的改变），没有切换路由规则，组件没有更新
    // 2. 需要监听到路由参数的改变，路由提供一个 onBeforeRouteUpdate 监听
    // 3. 三个参数，去哪里路由对象，哪里来路由对象，next()下一步，和beforeEach(全局)相似
    // 4. onBeforeRouteUpdate 仅在当前组件下生效
    onBeforeRouteUpdate((to, from, next) => {
      initSliders()
      next()
    })

    // 需求：组件初始化，分类切换的时候，获取对应分类数据，渲染面包屑，加上动画
    // 1. 定义API函数
    // 2. 组件初始化获取数据，渲染面包屑
    // 3. 分类切换获取数据,更新数据
    // 4. 加上动画
    const category = ref({})
    // 组合API中获取路由信息对象的 this.$route
    const route = useRoute()
    // 获取地址栏的ID
    const initCategory = async (id) => {
      const data = await getTopCategory(id)
      category.value = data.result
    }
    onMounted(() => {
      initCategory(route.params.id)
    })
    onBeforeRouteUpdate((to, from, next) => {
      // console.log(to.params.id); // 获取切换后分分类ID
      // 获取切换有的ID去发请求
      initCategory(to.params.id)
      next()
    })

    // 进行渲染
    // 1. 知道商品数据结构，传递商品对象给，单个商品组件
    // 2. 分类页面渲染 全部分类  分类商品

    return { sliders, category }
  }
  // setup() {
  //   // 获取随机轮播图
  //   const sliders = ref([])
  //   // 获取分类信息
  //   const category = ref({})
  //   const initCategory = async (id) => {
  //     const data = await getTopCategory(id)
  //     category.value = data.result
  //   }
  //   const route = useRoute()
  //   onMounted(() => {
  //     initCategory(route.params.id)
  //   })
  //   const initSliders = async () => {
  //     const data = await getSliders()
  //     sliders.value = data.result.sort(() => Math.random() - 0.5)
  //   }
  //   onMounted(initSliders)
  //   // onMounted(async () => {
  //   //   const data = await getSliders()
  //   //   sliders.value = data.result
  //   // })
  //   onBeforeRouteUpdate((to, from, next) => {
  //     initCategory(to.params.id)
  //     initSliders()
  //     next()
  //   })
  //   return { sliders, category }
  // }
}
</script>

<style lang="less" scoped>
.xtx-category-page {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: var(--xtx-color);
          }
        }
      }
    }
  }
}
.ref-goods {
  background-color: #fff;
  margin-top: 20px;
  position: relative;
  .head {
    .xtx-more {
      position: absolute;
      top: 20px;
      right: 20px;
    }
    .tag {
      text-align: center;
      color: #999;
      font-size: 20px;
      position: relative;
      top: -20px;
    }
  }
  .body {
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    padding: 0 65px 30px;
    .none {
      height: 220px;
      text-align: center;
      width: 100%;
      line-height: 220px;
      color: #999;
    }
  }
}
</style>
