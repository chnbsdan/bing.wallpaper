import type { BingImageMeta } from '~/types'

const state = reactive({
  hasMore: true,
  isFetching: false,
  imageMap: new Map<string, BingImageMeta>(),
})

// ★★★ 搜索关键词 ★★★
const searchKeyword = ref('')

function setSearchKeyword(keyword: string) {
  searchKeyword.value = keyword.trim().toLowerCase()
  state.imageMap = new Map()
  state.hasMore = true
  state.isFetching = false
  loadImages({ idx: 0, count: 30 })
}

async function loadImages(query: { idx: number, count: number }) {
  if (state.isFetching || !state.hasMore) return

  state.isFetching = true
  try {
    // ★★★ 在函数内部获取 mkt，而不是在顶层 ★★★
    const { mkt } = useMarket()
    const images = await $fetch('/api/images', {
      query: {
        idx: query.idx,
        count: query.count,
        mkt: mkt.value,
        keyword: searchKeyword.value,
      }
    })
    state.isFetching = false
    state.hasMore = images.length >= query.count - 2
    images.forEach((image: BingImageMeta) => state.imageMap.set(image.date, image))
  } catch (e) {
    state.isFetching = false
    state.hasMore = false
    console.error('加载失败:', e)
  }
}

function resetImages() {
  state.imageMap = new Map()
  state.hasMore = true
  state.isFetching = false
  searchKeyword.value = ''
}

async function getImageByKey(date: string, mkt: string) {
  if (!date) return null
  if (state.imageMap.has(date)) {
    return state.imageMap.get(date)!
  }
  try {
    const image = await $fetch('/api/image', { query: { date, mkt } })
    state.imageMap.set(date, image)
    return image
  } catch {
    return null
  }
}

export function useImages() {
  return {
    ...toRefs(state),
    loadImages,
    resetImages,
    getImageByKey,
    setSearchKeyword,
    searchKeyword: readonly(searchKeyword),
  }
}
