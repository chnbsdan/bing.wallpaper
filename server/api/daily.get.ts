// server/api/daily.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const mkt = (query.mkt as string) || 'zh-CN'
  const redirect = query.redirect === 'true' || query.redirect === true

  // 1. 从 images 接口获取第一条数据（即最新的壁纸）
  const images = await $fetch(`/api/images?mkt=${mkt}&idx=0&count=1`)
  
  if (!images || images.length === 0) {
    throw createError({ statusCode: 404, message: 'No image found' })
  }

  const image = images[0]

  // 2. 如果要求重定向，直接跳转到图片URL
  if (redirect) {
    return sendRedirect(event, image.url)
  }

  // 3. 否则返回 JSON 数据
  return image
})
