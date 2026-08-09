interface ImagesQuery {
  mkt: string
  idx: number
  count: number
  random?: boolean
  keyword?: string
}

export default defineEventHandler(
  async (event) => {
    const query = getQuery<ImagesQuery>(event)

    const idx = Number(query.idx) || 0
    const count = Number(query.count) || 30
    const market = useValidMarket(event)
    const random = query.random === 'true' || query.random === true
    const keyword = (query.keyword || '').trim().toLowerCase()

    // 获取该语言的所有数据（先获取全量，便于过滤和随机）
    let images = await getCachedImagesFromStorage(0, 9999, market)

    // 搜索过滤
    if (keyword) {
      images = images.filter((item: any) =>
        (item.title || '').toLowerCase().includes(keyword) ||
        (item.copyright || '').toLowerCase().includes(keyword) ||
        (item.date || '').includes(keyword)
      )
    }

    // 随机逻辑
    if (random && images.length > 0) {
      const randomIndex = Math.floor(Math.random() * images.length)
      return [images[randomIndex]]
    }

    // 普通分页
    return images.slice(idx, idx + count)
  },
)
