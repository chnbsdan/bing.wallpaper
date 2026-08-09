// server/api/image.random.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const mkt = (query.mkt as string) || 'zh-CN'

  try {
    // 1. 调用你的 API 获取随机壁纸数据
    const images = await $fetch(`/api/images?mkt=${mkt}&random=true`)
    
    if (!images || images.length === 0) {
      throw createError({ statusCode: 404, message: 'No image found' })
    }

    const image = images[0]
    const imageUrl = image.url

    if (!imageUrl) {
      throw createError({ statusCode: 404, message: 'Image URL not found' })
    }

    // 2. 获取图片数据
    const response = await fetch(imageUrl)
    
    if (!response.ok) {
      throw createError({ statusCode: response.status, message: 'Failed to fetch image' })
    }

    const blob = await response.blob()

    // 3. 返回图片
    const contentType = response.headers.get('content-type') || 'image/jpeg'
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Expires', '0')

    return blob
  } catch (error) {
    console.error('随机壁纸接口错误:', error)
    throw createError({ statusCode: 500, message: 'Internal server error' })
  }
})
