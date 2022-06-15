import request from '@/utils/request'
/**
 * 商品分类
 * @param {*} id
 * @returns
 */
export const getTopCategory = (id) => request('/category', 'get', { id })
/**
 * 搜索商品
 * @param {*} params
 * @returns
 */
export const getSearchGoods = (params) => request('/search/all', 'psot', params)
/**
 * 商品详情
 * @param {Number} id 商品id
 * @returns
 */
export const getGoods = (id) => request('/goods', 'get', { id })
