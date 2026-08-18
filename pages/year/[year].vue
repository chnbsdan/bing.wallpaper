<script setup lang="ts">
import { useInfiniteScroll } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const year = computed(() => route.params.year as string)

const { mkt } = useMarket()
const { imageMap, loadImages, hasMore, isFetching } = useImages()

// 过滤出当前年份的图片
const images = computed(() => {
  return [...imageMap.value.values()]
    .filter(img => img.date.startsWith(year.value))
    .sort((a, b) => b.date.localeCompare(a.date))
})

// 滚动控制
const scrollY = ref(0)
const isBackTopVisible = computed(() => scrollY.value > 300)

const onScroll = (e: Event) => {
  const target = e.target as HTMLElement
  scrollY.value = target.scrollTop
}

function scrollToTop() {
  const container = document.querySelector('.scroll-container')
  if (container) {
    container.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// 滚动加载更多
const containerRef = ref<HTMLElement | null>(null)

useInfiniteScroll(
  containerRef,
  async () => {
    if (hasMore.value && !isFetching.value) {
      const currentSize = imageMap.value.size
      await loadImages({
        idx: currentSize,
        count: 30,
        mkt: mkt.value
      })
    }
  },
  { distance: 100 }
)

// 首次加载：加载第一页（30条）
await loadImages({ idx: 0, count: 30, mkt: mkt.value })
</script>

<template>
  <section class="mx-1 flex-1 md:mx-4 flex flex-col h-[calc(100vh-80px)]">
    <!-- 顶部导航 -->
    <div class="sticky top-0 z-10 mb-4 flex items-center gap-3 bg-base/80 py-2 backdrop-blur flex-shrink-0">
      <button
        @click="router.push('/')"
        class="flex items-center gap-1 rounded-full border px-3 py-1 text-sm hover:bg-black:5"
      >
        <span class="i-system-uicons-arrow-left" />
        返回首页
      </button>
      <span class="text-sm text-gray-500">
        📅 {{ year }} 年 已加载 {{ images.length }} 张壁纸
      </span>
      <span v-if="isFetching" class="text-sm text-gray-400">
        <span class="i-system-uicons-loader animate-spin inline-block" />
        加载中...
      </span>
    </div>

    <!-- 滚动容器 -->
    <div 
      ref="containerRef"
      class="flex-1 overflow-y-auto scroll-container"
      @scroll="onScroll"
    >
      <div class="grid grid-cols-2 gap-2 lg:grid-cols-5 md:grid-cols-3 pb-4">
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
      <div v-else-if="!hasMore && images.length > 0" class="py-4 text-center text-sm text-gray-400">
        已加载全部 {{ images.length }} 张壁纸
      </div>

      <!-- 空状态 -->
      <div v-if="images.length === 0 && !isFetching" class="py-8 text-center text-gray-400">
        暂无 {{ year }} 年的壁纸数据
      </div>
    </div>

    <!-- 回顶部按钮 -->
    <button
      v-show="isBackTopVisible"
      class="fixed bottom-8 right-8 z-20 rounded-full bg-black/70 p-3 text-white shadow-lg transition-all hover:bg-black/90"
      @click="scrollToTop"
    >
      <span class="i-system-uicons-arrow-up text-2xl" />
    </button>
  </section>
</template>
