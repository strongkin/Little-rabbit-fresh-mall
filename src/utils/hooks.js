import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
/**
 * 懒加载函数
 * @param {function} apiFn API函数
 * @returns
 */
export const useLazyData = (apiFn) => {
  const target = ref(null)
  const list = ref([])
  const { stop } = useIntersectionObserver(
    target,
    async ([{ isIntersecting }]) => {
      if (isIntersecting) {
        stop()
        const data = await apiFn()
        list.value = data.result
      }
    }
  )
  return { target, list }
}
