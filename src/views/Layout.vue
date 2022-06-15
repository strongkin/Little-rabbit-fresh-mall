<template>
  <!-- <nav>顶部通栏</nav> -->
  <AppTopnav />
  <!-- <header>头部</header> -->
  <AppHeader />
  <AppHeaderSticky />
  <main class="app-body">
    <!-- 二级路由 -->
    <router-view></router-view>
  </main>
  <!-- <footer>底部</footer> -->
  <AppFooter />
</template>

<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app.header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
import { onMounted } from 'vue'
export default {
  name: 'xtx-layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup() {
    const store = useStore()
    onMounted(() => {
      // 调用分类action,一次就好(app-header-nav会复用,多次调用)
      store.dispatch('category/getList')
    })
  }
}
</script>

<style lang="less" scoped>
.app-body {
  background-color: #f5f5f5;
  min-height: 600px;
}
</style>
