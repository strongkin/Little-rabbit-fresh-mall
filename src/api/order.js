import request from '@/utils/request'
// 获取结算信息
export const getCheckoutInfo = () => {
  return request('/member/order/pre', 'get')
}
//添加收货地址
export const insertAddress = (data) => request('/member/address', 'post', data)
// 查询收货地址
export const getAddress = () => request('/member/address', 'get')
//更新收货地址
export const updateAddress = (data) =>
  request(`/member/address/${data.id}`, 'put', data)
//创建订单
export const createOrder = (data) => {
  return request('/member/order', 'post', data)
}
//订单详情
export const getOrderInfo = (id) => request(`/member/order/${id}`, 'get')
