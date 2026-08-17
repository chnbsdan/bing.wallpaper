<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const yearMonth = computed(() => route.params.yearMonth as string)

const { mkt } = useMarket()
const { imageMap, loadImages } = useImages()
const { getPreviewImage } = usePreview()  // 新增

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

// ===== 新增：预览控制 =====
const showPreview = ref(false)

async function openPreview(image: any) {
  await getPreviewImage(image.date)
  showPreview.value = true
}

function closePreview() {
  showPreview.value = false
}
// ===== 新增结束 =====

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
        📅 {{ monthLabel }} 共 {{ images.length }} 张壁纸
      </span>
    </div>

    <!-- 修改：nuxt-link 换成 div + @click -->
    <div class="grid grid-cols-2 gap-2 lg:grid-cols-5 md:grid-cols-3">
      <div
        v-for="image in images"
        :key="image.url"
        class="cursor-pointer transition-opacity hover:opacity-80"
        @click="openPreview(image)"
      >
        <image-card :image="image" />
      </div>
    </div>

    <!-- 新增：预览组件 -->
    <image-preview v-if="showPreview" @close="closePreview" />

    <div v-if="images.length === 0" class="py-8 text-center text-gray-400">
      暂无 {{ monthLabel }} 的壁纸数据
    </div>
  </section>
</template>
