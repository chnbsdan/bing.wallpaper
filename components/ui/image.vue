<script setup lang="ts">
const props = defineProps<{ src: string, alt: string }>()

const imageUrl = ref('')
const loading = ref(true)

function loadImage(src: string) {
  if (!src) {
    loading.value = true
    imageUrl.value = ''
    return
  }
  loading.value = true
  imageUrl.value = src
  const img = new Image()
  img.onload = () => { loading.value = false }
  img.onerror = () => { loading.value = false }
  img.src = src
}

watch(() => props.src, loadImage, { immediate: true })
</script>

<template>
  <div class="grid h-full w-full place-items-center of-hidden">
    <div v-if="loading">
      <span class="i-system-uicons-loader block animate-spin text-3xl" />
    </div>
    <!-- ★★★ object-cover → object-contain ★★★ -->
    <img v-else :src="imageUrl" :alt="alt" class="h-full w-full object-contain" />
  </div>
</template>
