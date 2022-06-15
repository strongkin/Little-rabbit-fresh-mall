import {
  checkAllCart,
  deleteCart,
  getCartList,
  getNewCartGoods,
  insertCart,
  mergeLocalCart,
  updateCart
} from '@/api/cart'

export default {
  namespaced: true,
  state() {
    return {
      list: []
    }
  },
  // 本地：id skuId name picture price nowPrice count attrsText selected stock isEffective
  // 线上：比上面多 isCollect 有用 discount 无用 两项项信息
  mutations: {
    // 添加购物车
    insertCart(state, goods) {
      const sameIndex = state.list.findIndex(
        (item) => item.skuId === goods.skuId
      )
      // 逻辑：有相同的给goods累加数量，删除相同skuId的商品
      if (sameIndex >= 0) {
        goods.count = state.list[sameIndex].count + goods.count
        state.list.splice(sameIndex, 1)
      }
      state.list.unshift(goods)
    },
    // 更新购物车
    updateCart(state, goods) {
      //goods中字段有可能不完整，goods有信息才去修改。goods中必须有skuId才能找到对应的商品信息
      const updateGoods = state.list.find((item) => item.skuId === goods.skuId)
      for (const key in goods) {
        // 布尔值型false需要使用
        if (
          goods[key] !== null &&
          goods[key] !== undefined &&
          goods[key] !== ''
        ) {
          updateGoods[key] = goods[key]
        }
      }
    },
    // 删除购物车
    deleteCart(state, skuId) {
      const index = state.list.findIndex((item) => item.skuId === skuId)
      state.list.splice(index, 1)
    },
    //设置购物车列表
    setCartList(state, list) {
      state.list = list
    }
  },
  actions: {
    // 获取添加后购物车列表
    async insertCart(ctx, goods) {
      if (ctx.rootState.user.profile.token) {
        // 已登录 TODO
        await insertCart(goods)
        await ctx.dispatch('getCartList')
      } else {
        // 未登录
        ctx.commit('insertCart', goods)
      }
    },
    // 获取删除后购物车列表
    async deleteCart(ctx, skuId) {
      if (ctx.rootState.user.profile.token) {
        //ToDo
        await deleteCart([skuId])
        await ctx.dispatch('getCartList')
      } else {
        //本地
        ctx.commit('deleteCart', skuId)
        // resolve()
      }
    },
    async getCartList(ctx) {
      if (ctx.rootState.user.profile.token) {
        const data = await getCartList()
        ctx.commit('setCartList', data.result)
      } else {
        // 未登录
        // 每个商品都需要更新，都需要调用接口，并发发请求（同时发请求）
        const promiseArr = ctx.state.list.map((item) =>
          getNewCartGoods(item.skuId)
        )
        const results = await Promise.all(promiseArr)
        results.forEach((item, i) => {
          // list promiseArr results 三者顺序一样
          ctx.commit('updateCart', {
            skuId: ctx.state.list[i].skuId,
            ...item.result
          })
        })
      }
    },
    //获取购物车列表
    // async findCartList(ctx) {
    //   if (ctx.rootState.user.profile.token) {
    //     //todo
    //     const data = await getCartList()
    //     ctx.commit('setCartList', data.result)
    //   } else {
    //     //本地
    //     //promise.all()可以并列发送多个请求，等所有请求成功
    //     const promiserArr = ctx.state.list.map((item) => {
    //       //返回接口函数调用
    //       return getNewCartGoods(item.skuId)
    //     })
    //     const result = await Promise.all(promiserArr)
    //     result.forEach((item, i) => {
    //       //list promiseArr result 三者顺一样
    //       ctx.commit('updateCart', {
    //         skuId: ctx.state.list[i].skuId,
    //         ...item.result
    //       })
    //     })
    //   }
    // },
    // 获取更新购物车列表
    async updateCart(ctx, goods) {
      //goods中必须有skuId，其他想修改的属性selected count
      if (ctx.rootState.user.profile.token) {
        //todo
        await updateCart(goods)
        await ctx.dispatch('getCartList')
      } else {
        //本地
        ctx.commit('updateCart', goods)
      }
    },
    //做有效商品的全选&反选
    async checkAllCart(ctx, selected) {
      if (ctx.rootState.user.profile.token) {
        //登录todo
        const ids = ctx.getters.validList.map((item) => item.skuId)
        await checkAllCart({ selected, ids })
        await ctx.dispatch('getCartList')
      } else {
        //本地
        //获取有效的商品列表，遍历的去调用修改mutations即可
        ctx.getters.validList.forEach((item) => {
          ctx.commit('updateCart', { skuId: item.skuId, selected })
        })
      }
    },
    //批量删除选中商品
    async batchDeleteCart(ctx) {
      if (ctx.rootState.user.profile.token) {
        //商品todo
        const ids = ctx.getters.selectedList.map((item) => item.skuId)
        await deleteCart(ids)
        await ctx.dispatch('getCartList')
        console.log(ctx, 'baechDeleteCart')
      } else {
        //本地
        //获取选中商品列表，进行遍历调用deleteCart mutations函数
        ctx.getters.selectedList.forEach((item) => {
          ctx.commit('deleteCart', item.skuId)
        })
      }
    },
    //合并本地购物车
    async mergeLocalCart(ctx) {
      //存储token后调用合并API接口函数进行购物合并
      const cartList = ctx.getters.validList.map(
        ({ skuId, selected, count }) => {
          return { skuId, selected, count }
        }
      )
      await mergeLocalCart(cartList)
      //合并成功将本地购物车删除
      ctx.commit('setCartList', [])
    }
  },
  getters: {
    //有效商品列表
    validList(state) {
      return state.list.filter((item) => item.stock > 0 && item.isEffective)
    },
    //有效商品数量
    validTotal(state, getters) {
      return getters.validList.reduce((p, c) => p + c.count, 0)
    },
    //有效商品总金额
    validAmount(state, getters) {
      return (
        getters.validList.reduce((p, c) => p + c.nowPrice * 100 * c.count, 0) /
        100
      )
    },
    // ... getters 代码
    // 选中商品列表
    selectedList(state, getters) {
      return getters.validList.filter((item) => item.selected)
    },
    //选中商品件数
    selectedTotal(state, getters) {
      return getters.selectedList.reduce((p, c) => p + c.count, 0)
    },
    //选中商品总金额
    selectedAmount(state, getters) {
      return (
        getters.selectedList.reduce(
          (p, c) => p + c.nowPrice * 100 * c.count,
          0
        ) / 100
      )
    },
    //是否全选
    isCheckAll(state, getters) {
      return (
        getters.validList.length === getters.selectedList.length &&
        getters.selectedList.length !== 0
      )
    }
  }
}
