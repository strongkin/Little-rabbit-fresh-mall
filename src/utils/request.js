import axios from 'axios'
import store from '@/store'
import router from '@/router'
// 创建axios和基本配置
export const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/'
const instance = axios.create({
  baseURL,
  timeout: 5000
})
// 请求拦截器，携带token
instance.interceptors.request.use(
  (config) => {
    const { profile } = store.state.user
    if (profile.token) {
      config.headers.Authorization = `Bearer ${profile.token}`
    }
    return config
  },
  (err) => Promise.reject(err)
)
// 响应拦截器，取出内ret中的data，处理401
instance.interceptors.response.use(
  (ret) => ret.data,
  (err) => {
    if (err.response && err.response.status === 401) {
      // 清除用户信息
      store.commit('user/setProfile', '')
      // 跳转登录页
      router.push('/login')
    }
    return Promise.reject(err)
  }
)
/**
 * 请求工具函数
 * @param {*} url 请求地址
 * @param {*} method 请求方式
 * @param {*} submitData 请求传参
 * @returns Promise
 */
const request = (url, method, submitData) => {
  return instance({
    url,
    method,
    // 1.get请求params传参
    // 2.其他请求使用data传参
    // 3. [js表达式]是动态使用key
    //4.toLowerCase()处理大小写，程序健壮
    [method.toLowerCase() === 'get' ? 'params' : 'data']: submitData
  })
}
export default request
