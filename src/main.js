import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import GoodsItem from '@/components/goods-item.vue'
import ErabbitUI from 'erabbit-ui'
import 'erabbit-ui/packages/theme/index.less'
import './styles/index.less'
import 'normalize.css'
// import './styles/common.less'
// 创建一个vue应用
const app = createApp(App)
// 通过app注册（directive，component）都在app实例上
app.component(GoodsItem.name, GoodsItem)
// 创建app实例，使用store插件，使用router插件，挂载到app容器
app.use(store).use(router).use(ErabbitUI).mount('#app')
