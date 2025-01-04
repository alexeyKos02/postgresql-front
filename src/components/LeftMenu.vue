<template>
  <div class="resizable-box" :style="{ width: `${width}px` }" @mousedown="startResizing">
    <FileTree></FileTree>
  </div>
  <!-- <div class="resize-container">
    <div class="resizable-box" :style="{ width: `${width}px` }" @mousedown="startResizing"></div>
  </div> -->
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import FileTree from './FileTree.vue'

const width = ref(150) // Начальная ширина элемента
const maxWidth = 500 // Максимальная ширина
const minWidth = 50 // Минимальная ширина

let isResizing = false
let startX = 0

const startResizing = (event: MouseEvent) => {
  isResizing = true
  startX = event.clientX
  document.addEventListener('mousemove', resize)
  document.addEventListener('mouseup', stopResizing)
}

const resize = (event: MouseEvent) => {
  if (!isResizing) return

  const deltaX = event.clientX - startX // Смещение влево
  startX = event.clientX

  // Новая ширина ограничена минимумом и максимумом
  const newWidth = Math.min(Math.max(width.value + deltaX, minWidth), maxWidth)
  width.value = newWidth
}

const stopResizing = () => {
  if (!isResizing) return
  isResizing = false
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResizing)
}

// Очистка событий при размонтировании компонента
onUnmounted(() => {
  document.removeEventListener('mousemove', resize)
  document.removeEventListener('mouseup', stopResizing)
})
</script>

<style>
/* .resize-container {
  position: relative;
  height: 100px;
  background-color: #f4f4f4;
} */

.resizable-box {
  position: absolute;
  left: 0; /* Расширение влево */
  height: 100%;
  background-color: lightblue;
  cursor: ew-resize; /* Указатель изменения ширины */
  overflow: hidden;
  user-select: none; /* Запрет на выделение текста */
  -webkit-user-select: none; /* Для Safari */
  -moz-user-select: none; /* Для Firefox */
  -ms-user-select: none; /* Для Internet Explorer/Edge */
}
</style>
