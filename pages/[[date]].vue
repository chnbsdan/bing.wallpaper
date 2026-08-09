<script setup lang="ts">
const { height: windowHeight, width: windowWidth } = useWindowSize()
const { y: scrollY, x: scrollX } = useWindowScroll({ behavior: 'smooth' })

provide('isMobile', computed(() => {
  return windowWidth.value < 730
}))

const isBackTopVisible = computed(() => {
  return scrollY.value > windowHeight.value * 0.5
})

function scrollTo({ x = 0, y = 0 }: { x?: number, y?: number } = {}) {
  scrollX.value = x
  scrollY.value = y
}

const requestUrl = useRequestURL()
const { market } = useMarket()

// ★★★ 搜索功能 ★★★
const { setSearchKeyword } = useImages()
const searchKeyword = ref('')
const searchInputRef = ref<HTMLInputElement>()

function handleSearch() {
  setSearchKeyword(searchKeyword.value)
}

function clearSearch() {
  searchKeyword.value = ''
  setSearchKeyword('')
  searchInputRef.value?.focus()
}

// ★★★ 在客户端监听键盘事件 ★★★
onMounted(() => {
  const handler = (e: KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault()
      searchInputRef.value?.focus()
    }
    if (e.key === 'Escape' && searchKeyword.value) {
      clearSearch()
    }
  }
  document.addEventListener('keydown', handler)
  onUnmounted(() => {
    document.removeEventListener('keydown', handler)
  })
})

useHead({
  htmlAttrs: {
    lang: market.value.lang,
  },
  link: [
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'canonical', href: `${requestUrl.toString()}` },
  ],
  meta: [
    { name: 'keywords', content: market.value.keywords },
    { name: 'viewport', content: 'width=device-width,user-scalable=no,initial-scale=1,maximum-scale=1,minimum-scale=1,viewport-fit=cover' },
    { name: 'theme-color', content: 'black' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
  ],
})

useCustomSeoMeta({
  title: market.value.title,
  description: market.value.description,
  ogUrl: requestUrl.toString(),
  ogImage: `${requestUrl.origin}/og.jpeg`,
})
</script>

<template>
  <!-- ★★★ 用 ClientOnly 包裹，避免 hydration 问题 ★★★ -->
  <ClientOnly>
    <div class="min-h-screen flex flex-col gap-1 md:gap-2">
      <header class="sticky top-0 z-10 mx-1 border-b-1 rounded-b px-4 py-2 shadow backdrop-blur md:mx-4 bg-base">
        <div class="flex items-center">
          <div class="i-logos-bing mt--1 text-2xl" />
          <div class="mx-1 flex items-center">
            <h1 class="font-bold">
              {{ market.title }}
            </h1>
            <span class="mx-1 hidden sm:inline">-</span>
            <span class="hidden sm:inline">{{ market.description }}</span>
          </div>

          <market-select />

          <div class="ml-auto" />

          <!-- ★★★ 搜索框 ★★★ -->
          <div class="relative mx-2 max-w-[160px] flex-1">
            <input
              ref="searchInputRef"
              v-model="searchKeyword"
              type="text"
              placeholder="搜索 (⌘K)"
              class="w-full rounded-full border-1 border-white/10 bg-black/20 px-3 py-1 text-sm text-white outline-none transition-all placeholder:text-white/30 focus:border-rose-600/50 focus:ring-1 focus:ring-rose-600/50"
              @input="handleSearch"
            />
            <button
              v-if="searchKeyword"
              class="absolute right-2 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/80"
              @click="clearSearch"
            >
              <div class="i-system-uicons-cross h-3 w-3" />
            </button>
          </div>

          <button
            v-show="isBackTopVisible" class="rounded-full p-2 text-2xl hover:bg-black:10"
            @click="() => scrollTo({ y: 0 })"
          >
            <div class="i-system-uicons-arrow-up-circle m--2px text-28px" />
          </button>

          <div class="rounded-full p-2 text-2xl hover:bg-black:10">
            <nuxt-link
              class="i-logos-github-icon?mask block text-inherit" target="_blank"
              to="https://github.com/chnbsdan/bing.wallpaper"
            />
          </div>
        </div>
      </header>

      <image-grid />
      <image-preview />

      <footer class="py-4 text-center bg-base">
        <span class="text-xs op-50">© {{ new Date().getFullYear() }} · All pictures on this site are from Bing
          search</span>
      </footer>
    </div>
  </ClientOnly>
</template>
