import { createStore } from 'vuex'
import createPersistedstate from 'vuex-persistedstate'
import cart from './modules/cart'
import category from './modules/category'
import user from './modules/user'
// createStore创建一个vuex仓库
export default createStore({
  // 状态
  state: {},
  // vuex的计算属性
  getters: {},
  // 修改数据
  mutations: {},
  // 异步操作
  actions: {},
  // 模块
  modules: {
    cart,
    category,
    user
  },
  plugins: [
    // 使用插件
    createPersistedstate({
      // 本地储存key
      key: 'erabbit-store',
      // 储存哪些模块
      paths: ['cart', 'user']
    })
  ]
})
