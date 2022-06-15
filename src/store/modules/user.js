export default {
  namespaced: true,
  state() {
    return {
      profile: {
        // 用户信息
        id: null,
        avatar: null,
        nickname: null,
        account: null,
        mobile: null,
        token: null
      }
    }
  },
  mutations: {
    setProfile(state, payload) {
      // 保留原来数据，合并新数据
      state.profile = payload
    }
  }
}
