<template>
  <div class="home-category">
    <ul class="menu">
      <li v-for="item in categoryList" :key="item.name">
        <RouterLink :to="`/category/${item.id}`" v-if="item.id">{{
          item.name
        }}</RouterLink>
        <a href="javascript:;" v-else>{{ item.name }}</a>
        <a href="javascript:;" v-for="sub in item.children" :key="sub.id">{{
          sub.name
        }}</a>
        <!-- 加载中前加骨架效果 -->
        <!-- <a href="javascript:;">清洁</a> -->
        <template v-if="!item.children">
          <XtxSkeleton width="70px" height="18px" bg="rgba(255,255,255,0.2)" />
          <XtxSkeleton width="40px" height="18px" bg="rgba(255,255,255,0.2)" />
        </template>
        <!-- 弹层 -->
        <div class="layer">
          <h4>
            {{ item.brands ? '品牌' : '分类' }}推荐
            <small>根据您的购买或浏览记录推荐</small>
          </h4>
          <ul v-if="item.brands">
            <li class="brand" v-for="bra in item.brands" :key="bra.id">
              <!-- :to="item.id ? `/category/${item.id}` : '/'" -->
              <RouterLink to="/">
                <img :src="bra.picture" alt="" />
                <div class="info">
                  <p class="place">
                    <i class="iconfont icon-dingwei"></i>{{ bra.place }}
                  </p>
                  <p class="name ellipsis">{{ bra.name }}</p>
                  <p class="desc ellipsis-2">{{ bra.desc }}</p>
                </div>
              </RouterLink>
            </li>
          </ul>
          <ul v-else>
            <li v-for="pro in item.goods" :key="pro.id">
              <RouterLink to="/">
                <img :src="pro.picture" alt="" />
                <div class="info">
                  <p class="name ellipsis-2">
                    {{ pro.name }}
                  </p>
                  <p class="desc ellipsis">{{ pro.desc }}</p>
                  <p class="price"><i>¥</i>{{ pro.price }}</p>
                </div>
              </RouterLink>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { computed, onMounted, reactive } from 'vue'
import { useStore } from 'vuex'
import { getBrand } from '@/api/home'
export default {
  name: 'HomeCategory',
  setup() {
    const store = useStore()
    const brand = reactive({
      name: '品牌',
      children: [{ name: '品牌推荐' }],
      brands: []
    })
    const categoryList = computed(() => {
      const list = store.state.category.list.map((item) => {
        const { id, name, children, goods } = item
        console.log(item)
        return { id, name, children: children && children.slice(0, 2), goods }
      })
      //
      console.log(categoryList, 'home-category')
      list.push(brand)
      console.log(list)
      return list
    })
    onMounted(async () => {
      const data = await getBrand(10)
      console.log(data)
      brand.brands = data.result
    })
    return { categoryList }
  }
}
</script>

<style scoped lang="less">
.home-category {
  width: 250px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  z-index: 99;
  .menu {
    > li {
      padding-left: 40px;
      height: 50px;
      line-height: 50px;
      &:hover {
        background: var(--xtx-color);
      }
      .xtx-skeleton {
        animation: fade 1.5s linear infinite alternate;
        margin-right: 6px;
      }
      @keyframes fade {
        from {
          opacity: 0.2;
        }
        to {
          opacity: 1;
        }
      }
      .layer {
        width: 990px;
        height: 500px;
        background: rgba(255, 255, 255, 0.8);
        position: absolute;
        left: 250px;
        top: 0;
        display: none;
        padding: 0 15px;
        h4 {
          font-size: 20px;
          font-weight: normal;
          line-height: 80px;
          small {
            font-size: 16px;
            color: #666;
          }
        }
        ul {
          display: flex;
          flex-wrap: wrap;
          li {
            width: 310px;
            height: 120px;
            margin-right: 15px;
            margin-bottom: 15px;
            border: 1px solid #eee;
            border-radius: 4px;
            background: #fff;
            &:nth-child(3n) {
              margin-right: 0;
            }
            a {
              display: flex;
              width: 100%;
              height: 100%;
              align-items: center;
              padding: 10px;
              &:hover {
                background: #e3f9f4;
              }
              img {
                width: 95px;
                height: 95px;
              }
              .info {
                padding-left: 10px;
                line-height: 24px;
                width: 190px;
                .name {
                  font-size: 16px;
                  color: #666;
                }
                .desc {
                  color: #999;
                }
                .price {
                  font-size: 22px;
                  color: var(--price-color);
                  i {
                    font-size: 16px;
                  }
                }
              }
            }
          }
        }
        li.brand {
          height: 180px;
          a {
            align-items: flex-start;
            img {
              width: 120px;
              height: 160px;
            }
            .info {
              p {
                margin-top: 8px;
              }
              .place {
                color: #999;
              }
            }
          }
        }
      }
      &:hover {
        .layer {
          display: block;
        }
      }
      a {
        margin-right: 4px;
        color: #fff;
        &:first-child {
          font-size: 16px;
        }
      }
    }
  }
}
</style>
