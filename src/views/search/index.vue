<template>
  <div class="xtx-search-page">
    <div class="container">
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <XtxBreadItem>搜索 "{{ $route.query.keyword }}" 的结果：</XtxBreadItem>
      </XtxBread>
      <div class="wrapper">
        <!-- 筛选区 -->
        <SearchSort />
        <!-- 结果区 -->
        <ul class="good-list">
          <li v-for="item in list" :key="item.id"></li>
          <GoodsItem :goods="item" />
        </ul>
        <!-- 分页区 -->
        <div v-if="!total" class="none">
          <img src="@/assets/images/none.png" alt="" />
          暂无数据
        </div>
        <XtxPagination
          v-if="total"
          :total="total"
          :current-page="reqParams.page"
          :page-size="reqParams.pageSize"
          @current-change="changePager"
        ></XtxPagination>
        <SearchFilter @change-filter="changeFilter" />
      </div>
    </div>
  </div>
</template>

<script>
import SearchSort from '@/components/search-sort.vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { onMounted, reactive, ref } from 'vue'
import { getSearchGoods } from '@/api/goods'
import GoodsItem from '@/components/goods-item.vue'
export default {
  name: 'xtx-search-page',
  components: { SearchSort, GoodsItem },
  setup() {
    const route = useRoute()
    const reqParams = reactive({
      page: 1,
      pageSize: 10,
      keyword: route.query.keyword,
      sortField: null,
      sortMethod: null
    })
    const list = ref([])
    const total = ref(0)
    const loadData = async () => {
      const { result } = await getSearchGoods(reqParams)
      console.log('loadData', result)
      list.value = result.pageData.items
      total.value = result.pageData.counts
    }
    onMounted(() => {
      loadData()
    })
    const changePager = (p) => {
      reqParams.page = p
      loadData()
    }
    const changeFilter = (filterParams) => {
      reqParams.page = 1
      reqParams.sortField = filterParams.sortField
      reqParams.sortMethod = filterParams.sortMethod
      loadData()
    }
    //
    onBeforeRouteUpdate((to, from, next) => {
      reqParams.page = 1
      reqParams.keyword = to.query.keyword
      reqParams.sortField = null
      reqParams.sortMethod = null
      loadData()
      next()
    })
    //
    onBeforeRouteUpdate((to, from, next) => {
      reqParams.sortField = null
      reqParams.sortMethod = null
      next()
    })
    return { list, total, reqParams, changePager, changeFilter }
  }
}
</script>

<style lang="less" scoped>
.xtx-search-page {
  .wrapper {
    background-color: #fff;
    padding: 0 25px;
    .goods-list {
      display: flex;
      flex-wrap: wrap;
      padding: 0 5px;
      li {
        margin-right: 20px;
        margin-bottom: 20px;
        &:nth-child(5n) {
          margin-right: 0;
        }
      }
    }
    .none {
      padding: 100px 0;
      text-align: center;
      color: #999;
      img {
        width: 100px;
        height: 100px;
        margin-right: 10px;
        object-fit: contain;
      }
    }
  }
}
</style>
