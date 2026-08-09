// server/api/image.random.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const mkt = (query.mkt as string) || 'zh-CN'

  try {
    // 调用 images API 获取随机数据
    const images = await $fetch(`/api/images?mkt=${mkt}&random=true`)
    
    if (!images || images.length === 0) {
      return new Response(JSON.stringify({ error: 'No image found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const image = images[0]
    const imageUrl = image.url

    // 获取图片数据
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw createError({ statusCode: response.status, message: 'Failed to fetch image' })
    }

    const blob = await response.blob()
    const contentType = response.headers.get('content-type') || 'image/jpeg'

    // 返回图片
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    setHeader(event, 'Pragma', 'no-cache')
    setHeader(event, 'Expires', '0')
    setHeader(event, 'ETag', `"${Date.now()}-${Math.random()}"`)

    return blob
  } catch (error) {
    console.error('随机壁纸接口错误:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
