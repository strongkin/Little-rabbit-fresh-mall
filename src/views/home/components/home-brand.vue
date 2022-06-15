<template>
  <HomePanel ref="target" title="热门品牌" sub-title="国际经典 品质保证">
    <template v-slot:right>
      <a
        @click="toggle(0)"
        href="javascript:;"
        class="iconfont icon-angle-left"
        :class="{ disabled: translateX === 0 }"
      ></a>
      <a
        @click="toggle(-1240)"
        href="javascript:;"
        class="iconfont icon-angle-right"
        :class="{ disabled: translateX === -1240 }"
      ></a>
    </template>
    <div class="box" ref="box">
      <Transition name="fade">
        <ul
          class="list"
          v-if="list.length"
          :style="{ transform: `translateX(${translateX}px)` }"
        >
          <li v-for="item in list" :key="item.id">
            <RouterLink to="/">
              <img :src="item.picture" alt="" />
            </RouterLink>
          </li>
        </ul>
        <div v-else class="skeleton">
          <XtxSkeleton
            class="item"
            v-for="i in 5"
            :key="i"
            animated
            bg="#e4e4e4"
            width="240px"
            height="305px"
          />
        </div>
      </Transition>
    </div>
  </HomePanel>
</template>

<script>
import { getBrand } from '@/api/home'
import { useLazyData } from '@/utils/hooks'
import HomePanel from './home-panel'
import { ref } from 'vue'
export default {
  name: 'HomeBrand',
  components: { HomePanel },
  setup() {
    const translateX = ref(0)
    const toggle = (x) => {
      translateX.value = x
    }
    const { list, target } = useLazyData(() => getBrand(10))
    return { list, target, translateX, toggle }
  }
}
</script>

<style scoped lang="less">
.home-panel {
  background: #f5f5f5;
}
.iconfont {
  width: 20px;
  height: 20px;
  background: #ccc;
  color: #fff;
  display: inline-block;
  text-align: center;
  margin-left: 5px;
  background: var(--xtx-color);
  &::before {
    font-size: 12px;
    position: relative;
    top: -2px;
  }
  &.disabled {
    background: #ccc;
    cursor: not-allowed;
  }
}
.box {
  display: flex;
  width: 100%;
  height: 345px;
  overflow: hidden;
  padding-bottom: 40px;
  .list {
    width: 200%;
    display: flex;
    transition: all 1s;
    li {
      margin-right: 10px;
      width: 240px;
      &:nth-child(5n) {
        margin-right: 0;
      }
      img {
        width: 240px;
        height: 305px;
      }
    }
  }
  .skeleton {
    display: flex;
    .xtx-skeleton {
      margin-right: 10px;
      &:nth-child(5n) {
        margin-right: 0;
      }
    }
  }
}
</style>
