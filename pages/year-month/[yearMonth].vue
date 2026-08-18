<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const yearMonth = computed(() => route.params.yearMonth as string)

const { mkt } = useMarket()
const { imageMap, loadImages, hasMore, isFetching } = useImages()

const year = computed(() => yearMonth.value.slice(0, 4))
const month = computed(() => parseInt(yearMonth.value.slice(4, 6)))
const monthLabel = computed(() => `${year.value}年${month.value}月`)

// 过滤出当前年月的图片
const images = computed(() => {
  return [...imageMap.value.values()]
    .filter(img => {
      const imgDate = img.date.replace(/-/g, '')
      return imgDate.startsWith(yearMonth.value)
    })
    .sort((a, b) => b.date.localeCompare(a.date))
})

// 滚动容器
const containerRef = ref<HTMLElement | null>(null)

// 使用 useInfiniteScroll
useInfiniteScroll(
  containerRef,
  async () => {
    if (hasMore.value && !isFetching.value) {
      await loadImages({ idx: imageMap.value.size, count: 30, mkt: mkt.value })
    }
  },
  { distance: 100 }
)

// 首次加载
await loadImages({ idx: 0, count: 30, mkt: mkt.value })
</script>

<template>
  <section class="mx-1 flex-1 md:mx-4">
    <div class="mb-4 flex items-center gap-3">
      <button
        @click="router.push('/')"
        class="flex items-center gap-1 rounded-full border px-3 py-1 text-sm hover:bg-black:5"
      >
        <span class="i-system-uicons-arrow-left" />
        返回首页
      </button>
      <span class="text-sm text-gray-500">
        📅 {{ monthLabel }} 已加载 {{ images.length }} 张壁纸
      </span>
      <span v-if="isFetching" class="text-sm text-gray-400">
        <span class="i-system-uicons-loader animate-spin inline-block" />
        加载中...
      </span>
    </div>

    <!-- 滚动容器 -->
    <div 
      ref="containerRef"
      class="h-[calc(100vh-180px)] overflow-y-auto"
    >
      <div class="grid grid-cols-2 gap-2 lg:grid-cols-5 md:grid-cols-3">
        <nuxt-link
          v-for="image in images"
          :key="image.url"
          :to="`/${image.date}?mkt=${mkt}`"
          class="block transition-opacity hover:opacity-80"
        >
          <image-card :image="image" />
        </nuxt-link>
      </div>

      <!-- 加载更多状态 -->
      <div v-if="isFetching" class="py-4 text-center text-gray-400">
        <span class="i-system-uicons-loader animate-spin inline-block" />
        加载更多...
      </div>

      <!-- 没有更多数据 -->
      <div v-else-if="!hasMore && images.length > 0" class="py-4 text-center text-gray-400">
        已加载全部 {{ images.length }} 张壁纸
      </div>

      <!-- 空状态 -->
      <div v-if="images.length === 0 && !isFetching" class="py-8 text-center text-gray-400">
        暂无 {{ monthLabel }} 的壁纸数据
      </div>
    </div>
  </section>
</template>
