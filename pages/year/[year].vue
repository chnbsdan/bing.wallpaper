<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const year = computed(() => route.params.year as string)

const { mkt } = useMarket()
const { imageMap, loadImages } = useImages()

const images = computed(() => {
  return [...imageMap.value.values()]
    .filter(img => img.date.startsWith(year.value))
    .sort((a, b) => b.date.localeCompare(a.date))
})

await loadImages({ idx: 0, count: 1000, mkt: mkt.value })
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
        📅 {{ year }} 年 共 {{ images.length }} 张壁纸
      </span>
    </div>

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

    <div v-if="images.length === 0" class="py-8 text-center text-gray-400">
      暂无 {{ year }} 年的壁纸数据
    </div>
  </section>
</template>
