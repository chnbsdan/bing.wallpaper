<!-- ★★★ 图片容器 ★★★ -->
<div
  class="h-full w-full overflow-hidden flex items-center justify-center"
  @wheel="handleWheel"
  @mousedown="startDrag"
  @mousemove="moveDrag"
  @mouseup="endDrag"
  @mouseleave="endDrag"
  @touchstart="startDrag"
  @touchmove="moveDrag"
  @touchend="endDrag"
  @dblclick="doubleClickReset"
>
  <!-- ★★★ 去掉 pointer-events-none，让事件可以正常传递 ★★★ -->
  <ui-image
    :src="previewUrl"
    :alt="previewImage.title"
    class="h-full w-full object-contain transition-none"
    :style="{
      transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
      cursor: scale > 1 ? 'grab' : 'default',
    }"
  />
</div>
