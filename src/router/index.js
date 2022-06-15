import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store'
// import HomeView from '../views/HomeView.vue'
const Layout = () => import('@/views/Layout')
const Home = () => import('@/views/home')
const Category = () => import('@/views/category')
// const SubCategory = () => import('@/views/category/sub.vue')
const Search = () => import('@/views/search')
const Goods = () => import('@/views/goods')
const Login = () => import('@/views/login')
const Cart = () => import('@/views/cart')
const Checkout = () => import('@/views/checkout')
const Pay = () => import('@/views/pay')
const PayResult = () => import('@/views/pay/result')
// 写路由规则
const routes = [
  {
    path: '/',
    // name: '',
    component: Layout,
    children: [
      { path: '/', component: Home },
      { path: '/category/:id', component: Category },
      // { path: '/category/sub/:id', component: SubCategory },
      { path: '/search', component: Search },
      { path: '/product/:id', component: Goods },
      { path: '/cart', component: Cart },
      { path: '/user/checkout', component: Checkout },
      { path: '/user/pay', component: Pay },
      { path: '/user/pay/result', component: PayResult }
    ]
  },
  {
    path: '/login',
    component: Login
  }
  // {
  //   path: "/about",
  //   name: "about",
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () =>
  //     import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  // },
]

// createRouter创建路由实例

const router = createRouter({
  // 路由模式：createWebHashHistory() 创建hash路由模式
  history: createWebHashHistory(),
  routes
})
//前置导航守卫
router.beforeEach((to, from, next) => {
  //用户信息
  const { token } = store.state.user.profile
  //跳转去user开头的地址却没有登录
  if (to.path.startsWith('/user') && !token) {
    next({
      path: '/login',
      query: { redirectUrl: to.fullPath }
    })
  }
  next()
})
export default router
