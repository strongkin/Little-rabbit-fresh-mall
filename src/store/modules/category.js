import { topCategory } from '@/api/constants'
import { getCategory } from '@/api/home'
// 分类模块
export default {
  namespaced: true,
  state() {
    return {
      // 分类列表
      list: topCategory.map((item) => ({ name: item }))
    }
  },
  mutations: {
    setList(state, payload) {
      state.list = payload
      console.log(state.list, 'setList')
    },
    // 修改当前一级分类下的open数据为人true
    show(state, item) {
      const category = state.list.find((category) => category.id === item.id)
      category.open = true
    },
    // 修改当前一级分类下的open数据为false
    hide(state, item) {
      const category = state.list.find((category) => category.id === item.id)
      category.open = false
    }
  },
  actions: {
    //
    async getList({ commit }) {
      const { result } = await getCategory()
      //给一级分类加上一个控制二级分类显示隐藏的数据open
      result.forEach((item) => {
        item.open = false
      })
      console.log(result, 'category.js-actions')
      // 获取数据成功，提交mutations进行数据修改
      commit('setList', result)
    }
  }
}
