// server/api/random.get.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const mkt = (query.mkt as string) || 'zh-CN'
  const redirect = query.redirect === 'true' || query.redirect === true

  // 调用 images API 获取随机数据
  const images = await $fetch(`/api/images?mkt=${mkt}&random=true`)
  
  if (!images || images.length === 0) {
    throw createError({ statusCode: 404, message: 'No image found' })
  }

  const image = images[0]

  if (redirect) {
    // 重定向到图片
    return sendRedirect(event, image.url)
  }

  // 返回 JSON
  return image
})
