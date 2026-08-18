<script setup lang="ts">
import type { BingImageMeta } from '~/types'

const props = defineProps<{ image: BingImageMeta }>()

const isMobile = inject('isMobile', ref(false))

const thumbnail = computed(() => {
  const { url } = props.image
  
  // 1. 必应官方格式：可以替换分辨率
  if (url.includes('/th?id=')) {
    const size = isMobile.value ? '768x1280' : '480x270'
    return url.replace(/\d+x\d+\.jpg$/, `${size}.jpg`)
  }
  
  // 2. cdn.bimg.cc 格式：直接使用原图，不替换
  if (url.includes('cdn.bimg.cc')) {
    return url  // 原样返回，不做任何处理
  }
  
  // 3. 其他格式：直接返回
  return url
})
</script>

<template>
  <div class="group relative of-hidden rounded bg-black:12 transition-all md:hover:(z-1 scale-105 ring-3 ring-rose-600:90)">
    <ui-image 
      :src="thumbnail" 
      :alt="image.title" 
      class="aspect-[3/5] cursor-zoom-in md:aspect-[16/9]"
      referrerpolicy="no-referrer"
      loading="lazy"
    />
    <div class="transition md:(op-0 group-hover:op-100)">
      <div class="absolute top-0 rounded-br rounded-tl bg-black:12 p-1 backdrop-blur">
        <span class="text-sm text-white leading-none text-shadow">{{ image.date }}</span>
      </div>
      <div class="absolute bottom-0 rounded-t bg-black:12 p-1 backdrop-blur">
        <span class="text-sm text-white leading-relaxed text-shadow">{{ image.title }}</span>
      </div>
    </div>
  </div>
</template>
