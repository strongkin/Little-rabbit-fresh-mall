<template>
  <HomePanel ref="target" title="新鲜好物" sub-title="新鲜出炉 品质靠谱">
    <template #right><XtxMore style="line-height: 22px" /></template>
    <!-- 面板内容 -->
    <div class="home-new">
      <Transition name="fade">
        <ul class="goods-list" v-if="list.length">
          <li v-for="item in list" :key="item.id">
            <RouterLink :to="`/product/${item.id}`">
              <img :src="item.picture" alt="" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="price">&yen;{{ item.price }}</p>
            </RouterLink>
          </li>
        </ul>
        <!-- <HomeSkeletion name="fade" v-else bg="#f0f9f4" /> -->
        <HomeSkeletion v-else />
      </Transition>
    </div>
  </HomePanel>
</template>
<script>
import { getNewGoods } from '@/api/home'
import { useLazyData } from '@/utils/hooks'
// import { ref } from 'vue'
import HomePanel from './home-panel'
// import HomePannel from './home-pannel.vue'
import HomeSkeletion from './home-skeletion.vue'
// import { useIntersectionObserver } from '@vueuse/core'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeletion },
  setup() {
    // const list = ref(0)
    // onMounted(async () => {
    //   const data = await getNewGoods()
    //   console.log('新鲜好物', data)
    //   list.value = data.result
    // })
    // const target = ref(null)
    // const { stop } = useIntersectionObserver(
    //   target,
    //   async ([{ isIntersecting }]) => {
    //     if (isIntersecting) {
    //       stop()
    //       const data = await getNewGoods()
    //       console.log('新鲜好物', data)
    //       list.value = data.result
    //     }
    //   }
    // )
    const { list, target } = useLazyData(getNewGoods)
    return { list, target }
  }
}
</script>
<style scoped lang="less">
.home-new {
  position: relative;
  height: 426px;
}
.goods-list {
  display: flex;
  justify-content: space-between;
  height: 406px;
  li {
    width: 306px;
    height: 406px;
    background: #f0f9f4;
    transition: all 0.5s;
    &:hover {
      transform: translate3d(0, -3px, 0);
      box-shadow: 0 3px 8px rgb(0 0 0 / 20%);
    }
    img {
      width: 306px;
      height: 306px;
    }
    p {
      font-size: 22px;
      padding: 12px 30px 0 30px;
      text-align: center;
    }
    .price {
      color: var(--price-color);
    }
  }
}
</style>
