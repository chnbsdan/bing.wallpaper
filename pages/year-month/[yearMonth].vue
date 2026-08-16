<!-- pages/year-month/[yearMonth].vue -->
<script setup lang="ts">
const route = useRoute()
const yearMonth = computed(() => route.params.yearMonth as string)

const { mkt } = useMarket()
const { imageMap, loadImages } = useImages()

const year = computed(() => yearMonth.value.slice(0, 4))
const month = computed(() => parseInt(yearMonth.value.slice(4, 6)))
const monthLabel = computed(() => `${year.value}年${month.value}月`)

const images = computed(() => {
  return [...imageMap.value.values()]
    .filter(img => {
      const imgDate = img.date.replace(/-/g, '')
      return imgDate.startsWith(yearMonth.value)
    })
    .sort((a, b) => b.date.localeCompare(a.date))
})

await loadImages({ idx: 0, count: 1000, mkt: mkt.value })
</script>

<template>
  <section class="mx-1 flex-1 md:mx-4">
    <div class="mb-3 text-sm text-gray-500">
      📅 {{ monthLabel }} 共 {{ images.length }} 张壁纸
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
      暂无 {{ monthLabel }} 的壁纸数据
    </div>
  </section>
</template>
