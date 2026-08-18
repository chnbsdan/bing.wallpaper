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
  const images = await $fetch('/api/images', { 
    query: { 
      idx: 0,           // 从第0条开始
      count: 12000,     // 一次拉取12000条，覆盖2010年至今所有数据
      mkt: query.mkt 
    } 
  })
  state.isFetching = false
  state.hasMore = images.length >= 12000 - 2  // 如果返回数量接近12000，说明可能还有更多
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

export function useImages() {
  return { ...toRefs(state), loadImages, resetImages, getImageByKey }
}
