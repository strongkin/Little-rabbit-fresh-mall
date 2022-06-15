import request from '@/utils/request'
/**
 * 账号密码
 * @param {String|Number} param0
 * @returns
 */
export const userAccountLogin = ({ account, password }) =>
  request('/login', 'post', { account, password })
/**
 * 短信登录
 * @param {Number} param0 手机号和验证码
 * @returns
 */
export const userMobileLogin = ({ mobile, code }) => {
  return request('/login/code', 'post', { mobile, code })
}
/**
 * 获取验证码
 * @param {Number} mobile
 * @returns
 */
export const userMobileLoginMsg = (mobile) => {
  return request('/login/code', 'get', { mobile })
}
