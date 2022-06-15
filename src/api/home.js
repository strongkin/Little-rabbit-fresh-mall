import request from '@/utils/request'
/**
 *
 * @returns
 */
export const getCategory = () => request('/home/category/head', 'get')
/**
 *获取品牌数据
 * @param {Number} limit
 * @returns
 */
export const getBrand = (limit) => request('/home/brand', 'get', { limit })
/**
 * 获取轮播图
 * @returns
 */
export const getSliders = () => request('/home/banner', 'get')
/**
 * 获取新鲜好物数据
 * @returns
 */
export const getNewGoods = () => request('/home/new', 'get')
/**
 * 获取人气推荐数据
 * @returns
 */
export const getHot = () => request('/home/hot', 'get')
