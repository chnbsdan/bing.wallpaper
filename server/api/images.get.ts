import { readFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

interface ImagesQuery {
  mkt: string
  idx: number
  count: number
  keyword?: string
}

// ★★★ 从 archive 加载所有数据 ★★★
function loadAllImagesFromArchive(mkt: string) {
  const allImages: any[] = []
  // ★★★ 关键修复：保持原始大小写，不要 toLowerCase ★★★
  const langDir = mkt // 直接使用传入的 mkt，如 'zh-CN'
  const archivePath = join(process.cwd(), 'archive', langDir)

  console.log('📂 读取路径:', archivePath)

  try {
    const files = readdirSync(archivePath).filter(f => f.endsWith('.json'))
    console.log('📄 找到文件:', files)

    for (const file of files) {
      const filePath = join(archivePath, file)
      try {
        const content = readFileSync(filePath, 'utf-8')
        const data = JSON.parse(content)

        // data 格式: { "20260809": {...}, "20260808": {...} }
        for (const [date, info] of Object.entries(data)) {
          const item = info as any
          allImages.push({
            date: date.slice(0, 4) + '-' + date.slice(4, 6) + '-' + date.slice(6, 8),
            title: item.title || '',
            copyright: item.copyright || '',
            copyrightlink: item.copyrightlink || '',
            url: item.url || 'https://www.bing.com' + (item.urlbase || '') + '_1920x1080.jpg',
          })
        }
      } catch (e) {
        console.warn('读取失败:', filePath, e)
      }
    }
  } catch (e) {
    console.warn('读取 archive 失败:', archivePath, e)
  }

  allImages.sort((a, b) => b.date.localeCompare(a.date))
  console.log('✅ 加载了', allImages.length, '张壁纸')
  return allImages
}

// ★★★ 缓存 ★★★
const cache: Record<string, any[]> = {}

function getCachedImages(mkt: string) {
  // ★★★ 保持原始大小写作为缓存 key ★★★
  const key = mkt
  if (!cache[key]) {
    cache[key] = loadAllImagesFromArchive(mkt)
  }
  return cache[key]
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery<ImagesQuery>(event)

    const idx = Number(query.idx) || 0
    const count = Number(query.count) || 30
    // ★★★ 保持原始大小写 ★★★
    const mkt = (query.mkt as string) || 'zh-CN'
    const keyword = (query.keyword || '').trim().toLowerCase()

    console.log('📥 API 请求:', { mkt, idx, count, keyword })

    let allImages = getCachedImages(mkt)

    if (keyword) {
      allImages = allImages.filter((item: any) =>
        (item.title || '').toLowerCase().includes(keyword) ||
        (item.copyright || '').toLowerCase().includes(keyword) ||
        (item.date || '').includes(keyword)
      )
    }

    const pageData = allImages.slice(idx, idx + count)
    console.log('📤 返回数据:', pageData.length, '条')
    return pageData
  } catch (e) {
    console.error('❌ API 错误:', e)
    return []
  }
})
