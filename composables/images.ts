import type { BingImageMeta } from '~/types'

const state = reactive({
  hasMore: true,
  isFetching: false,
  imageMap: new Map<string, BingImageMeta>(),
  currentMkt: 'zh-CN', // 记录当前语言
})

async function loadImages(query: { idx: number, count: number, mkt: string }) {
  if (state.isFetching) return

  state.isFetching = true
  state.currentMkt = query.mkt
  
  // 第一次加载：拉取全部数据（但通过分页逐步拉取）
  // 这里用 2000 作为每批数量，既不会太慢，也不会请求太多次
  const batchSize = 2000
  let allImages: BingImageMeta[] = []
  let hasMore = true
  let idx = 0
  
  while (hasMore) {
    const images = await $fetch('/api/images', { 
      query: { 
        idx, 
        count: batchSize, 
        mkt: query.mkt 
      } 
    })
    
    if (images.length === 0) {
      hasMore = false
      break
    }
    
    allImages = allImages.concat(images)
    idx += images.length
    
    // 如果返回数量小于请求数量，说明已经到末尾了
    if (images.length < batchSize) {
      hasMore = false
    }
    
    // 如果已经加载了足够多的数据（比如超过5000条），可以提前停止
    // 这里不设上限，一次性加载全部
  }
  
  state.isFetching = false
  state.imageMap = new Map()
  allImages.forEach(image => state.imageMap.set(image.date, image))
  state.hasMore = false
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
