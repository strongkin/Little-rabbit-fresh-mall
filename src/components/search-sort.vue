<template>
  <div class="search-sort">
    <div class="sort">
      <a
        :class="{ active: sortParams.sortField === null }"
        @click="changeSort(null)"
        href="javascript:;"
        >默认排序</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'publishTime' }"
        @click="changeSort(publishTime)"
        >最新商品</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'orderNum' }"
        @click="changeSort(orderNum)"
        >最高人气</a
      >
      <a
        href="javascript:;"
        :class="{ active: sortParams.sortField === 'evaluateNum' }"
        @click="changeSort(evaluateNum)"
        >评论最多</a
      >
      <a href="javascript:;" @click="changeSort('price')">
        价格排序
        <i
          class="arrow up"
          :class="{
            active:
              sortParams.sortField === 'price' && sortParams.sortMethod == 'asc'
          }"
        />
        <i
          class="arrow down"
          :class="{
            active:
              sortParams.sortField === 'price' &&
              sortParams.sortMethod == 'desc'
          }"
        />
      </a>
    </div>
  </div>
</template>
<script>
import { reactive } from 'vue-demi'
export default {
  name: 'SubSort',
  emits: ['change-filter'],
  setup(props, { emit }) {
    const sortParams = reactive({ sortField: null, sortMethod: null })
    const changeSort = (sortField) => {
      if (sortField === 'price') {
        sortParams.sortField = sortField
        if (sortParams.sortMethod === null) {
          sortParams.sortMethod = 'desc'
        } else {
          sortParams.sortMethod =
            sortParams.sortMethod === 'desc' ? 'asc' : 'desc'
        }
      } else {
        if (sortParams.sortField === sortField) return
        sortParams.sortField = sortField
        sortParams.sortMethod = null
      }
      emit('change-filter', sortParams)
    }
    return { sortParams, changeSort }
  }
}
</script>
<style scoped lang="less">
.search-sort {
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .sort {
    display: flex;
    a {
      height: 30px;
      line-height: 28px;
      border: 1px solid #e4e4e4;
      padding: 0 20px;
      margin-right: 20px;
      color: #999;
      border-radius: 2px;
      position: relative;
      transition: all 0.3s;
      &.active {
        background: var(--xtx-color);
        border-color: var(--xtx-color);
        color: #fff;
      }
      .arrow {
        position: absolute;
        border: 5px solid transparent;
        right: 8px;
        &.up {
          top: 3px;
          border-bottom-color: #bbb;
          &.active {
            border-bottom-color: var(--xtx-color);
          }
        }
        &.down {
          top: 15px;
          border-top-color: #bbb;
          &.active {
            border-top-color: var(--xtx-color);
          }
        }
      }
    }
  }
}
</style>
