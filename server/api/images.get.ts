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
  // ★★★ 关键修复：直接使用传入的 mkt，不做大小写转换 ★★★
  const langDir = mkt
  const archivePath = join(process.cwd(), 'archive', langDir)

  try {
    const files = readdirSync(archivePath).filter(f => f.endsWith('.json'))

    for (const file of files) {
      const filePath = join(archivePath, file)
      try {
        const content = readFileSync(filePath, 'utf-8')
        const data = JSON.parse(content)

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
  return allImages
}

// ★★★ 缓存 ★★★
const cache: Record<string, any[]> = {}

function getCachedImages(mkt: string) {
  // ★★★ 直接用 mkt 作为缓存 key ★★★
  if (!cache[mkt]) {
    cache[mkt] = loadAllImagesFromArchive(mkt)
  }
  return cache[mkt]
}

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery<ImagesQuery>(event)

    const idx = Number(query.idx) || 0
    const count = Number(query.count) || 30
    // ★★★ 默认值改为 'zh-CN'（与目录名一致）★★★
    const mkt = (query.mkt as string) || 'zh-CN'
    const keyword = (query.keyword || '').trim().toLowerCase()

    let allImages = getCachedImages(mkt)

    if (keyword) {
      allImages = allImages.filter((item: any) =>
        (item.title || '').toLowerCase().includes(keyword) ||
        (item.copyright || '').toLowerCase().includes(keyword) ||
        (item.date || '').includes(keyword)
      )
    }

    const pageData = allImages.slice(idx, idx + count)
    return pageData
  } catch (e) {
    console.error('API 错误:', e)
    return []
  }
})
