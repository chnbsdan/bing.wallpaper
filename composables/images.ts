import type { BingImageMeta } from '~/types'

const state = reactive({
  hasMore: true,
  isFetching: false,
  imageMap: new Map<string, BingImageMeta>(),
})

async function loadImages(query: { idx: number, count: number, mkt: string }) {
  if (state.isFetching || !state.hasMore)
    return

  state.isFetching = true
  const images = await $fetch('/api/images', { query })
  state.isFetching = false
  state.hasMore = images.length >= query.count - 2
  images.forEach(image => state.imageMap.set(image.date, image))
}

function resetImages() {
  state.imageMap = new Map()
  state.hasMore = true
  state.isFetching = false
}

async function getImageByKey(date: string, mkt: string) {
  if (!date)
    return null

  if (state.imageMap.has(date)) {
    return state.imageMap.get(date)!
  }
  else {
    try {
      const image = await $fetch('/api/image', { query: { date, mkt } })
      state.imageMap.set(date, image)
      return image
    }
    catch {
      return null
    }
  }
}

// ========== 新增：日期路由解析 ==========
export function useDateRoute() {
  const route = useRoute()
  
  const parseDateParam = (): string | null => {
    const dateParam = route.params.date
    if (!dateParam) return null
    if (Array.isArray(dateParam) && dateParam.length === 3) {
      const [year, month, day] = dateParam
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
    if (typeof dateParam === 'string' && dateParam.includes('-')) {
      return dateParam
    }
    return null
  }
  
  const targetDate = parseDateParam()
  const mkt = route.query.mkt as string || 'zh-CN'
  return { targetDate, mkt }
}

export function useImages() {
  return { ...toRefs(state), loadImages, resetImages, getImageByKey }
}
