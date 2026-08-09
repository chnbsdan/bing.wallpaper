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
  const langDir = mkt.toLowerCase()
  const archivePath = join(process.cwd(), 'archive', langDir)

  try {
    const files = readdirSync(archivePath).filter(f => f.endsWith('.json'))

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

  // 按日期倒序排序（最新的在前）
  allImages.sort((a, b) => b.date.localeCompare(a.date))
  return allImages
}

// ★★★ 缓存 ★★★
const cache: Record<string, any[]> = {}

function getCachedImages(mkt: string) {
  const key = mkt.toLowerCase()
  if (!cache[key]) {
    cache[key] = loadAllImagesFromArchive(mkt)
  }
  return cache[key]
}

export default defineEventHandler(async (event) => {
  const query = getQuery<ImagesQuery>(event)

  const idx = Number(query.idx) || 0
  const count = Number(query.count) || 30
  const mkt = (query.mkt as string) || 'zh-cn'
  const keyword = (query.keyword || '').trim().toLowerCase()

  // 获取该语言的所有数据
  let allImages = getCachedImages(mkt)

  // ★★★ 搜索过滤 ★★★
  if (keyword) {
    allImages = allImages.filter((item: any) =>
      (item.title || '').toLowerCase().includes(keyword) ||
      (item.copyright || '').toLowerCase().includes(keyword) ||
      (item.date || '').includes(keyword)
    )
  }

  // 分页
  const pageData = allImages.slice(idx, idx + count)

  return pageData
})
