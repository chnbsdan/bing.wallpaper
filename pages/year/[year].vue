<!-- pages/year/[year].vue -->
<script setup lang="ts">
const route = useRoute()
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
    <div class="mb-3 text-sm text-gray-500">
      📅 {{ year }} 年 共 {{ images.length }} 张壁纸
    </div>

    <div class="grid grid-cols-2 gap-2 lg:grid-cols-5 md:grid-cols-3">
      <nuxt-link
        v-for="image in images"
        :key="image.url"
        :to="{ params: { date: image.date }, query: { mkt } }"
      >
        <image-card :image="image" />
      </nuxt-link>
    </div>

    <div v-if="images.length === 0" class="py-8 text-center text-gray-400">
      暂无 {{ year }} 年的壁纸数据
    </div>
  </section>
</template>
