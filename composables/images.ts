import type { BingImageMeta } from '~/types'

const state = reactive({
  hasMore: true,
  isFetching: false,
  imageMap: new Map<string, BingImageMeta>(),
})

async function loadImages(query: { idx: number, count: number, mkt: string }) {
  if (state.isFetching || !state.hasMore) return

  state.isFetching = true
  const images = await $fetch('/api/images', { query })
  state.isFetching = false
  
  // 判断是否还有更多数据
  state.hasMore = images.length >= query.count
  
  // 追加数据，而不是覆盖
  images.forEach(image => state.imageMap.set(image.date, image))
}

function resetImages() {
  state.imageMap = new Map()
  state.hasMore = true
  state.isFetching = false
}

async function getImageByKey(date: string, mkt: string) {
  if (!date) return null

  if (state.imageMap.has(date)) {
    return state.imageMap.get(date)!
  } else {
    try {
      const image = await $fetch('/api/image', { query: { date, mkt } })
      state.imageMap.set(date, image)
      return image
    } catch {
      return null
    }
  }
}

export function useImages() {
  return { ...toRefs(state), loadImages, resetImages, getImageByKey }
}
