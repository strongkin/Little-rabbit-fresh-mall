<template>
  <HomePanel ref="target" title="人气推荐" sub-title="人气推荐 不容错过">
    <!-- 面板内容 -->
    <div class="home-hot">
      <Transition name="fade">
        <ul class="goods-list" v-if="list.length">
          <li v-for="item in list" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" />
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc">{{ item.alt }}</p>
            </RouterLink>
          </li>
        </ul>
        <HomeSkeletion v-else />
      </Transition>
    </div>
  </HomePanel>
</template>
<script>
import { getHot } from '@/api/home'
// import { onMounted, ref } from 'vue-demi'
import HomePanel from './home-panel'
import HomeSkeletion from './home-skeletion.vue'
import { useLazyData } from '@/utils/hooks'
export default {
  name: 'HomeNew',
  components: { HomePanel, HomeSkeletion },
  setup() {
    // const list = ref(0)
    // onMounted(async () => {
    //   const data = await getHot()
    //   console.log('人气', data)
    //   list.value = data.result
    // })
    const { list, target } = useLazyData(getHot)
    return { list, target }
  }
}
</script>
<style scoped lang="less">
.home-hot {
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
    .desc {
      color: #999;
      font-size: 18px;
    }
  }
}
</style>
