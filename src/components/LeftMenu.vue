<template>
  <div class="resizable-box" :style="{ width: `${width}px` }" @mousedown="startResizing">
    <ContextMenu :elements="contextMenu">
      <template v-slot:element="{ onClick }">
        <FileTree class="file-tree" @contextmenu.prevent="onClick"></FileTree>
      </template>
    </ContextMenu>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import FileTree from './FileTree.vue'
import ContextMenu from './contextMenu.vue'
import type { ContextMenuElement } from '@/types'

const contextMenu: ContextMenuElement[] = [{ title: 'Создать пространство', action: () => {} }]
const width = ref(150) // Начальная ширина элемента
const maxWidth = 300 // Максимальная ширина
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

<style lang="scss">
.resizable-box {
  position: relative;
  left: 0; /* Расширение влево */
  height: 100%;
  background-color: lightblue;
  user-select: none; /* Запрет на выделение текста */
  -webkit-user-select: none; /* Для Safari */
  -moz-user-select: none; /* Для Firefox */
  -ms-user-select: none; /* Для Internet Explorer/Edge */
  border: 1px solid rgba(0, 0, 0, 0.1); /* Тонкая, почти незаметная черная граница */
}
.file-tree {
  position: relative;
  padding-left: 0.7vw;
  padding-top: 0.5vw;
}
.resizable-box::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  border: 0.3vw solid transparent; /* увеличенный невидимый край элемента */
  cursor: ew-resize; /* Указатель изменения ширины */
  transition: all 0.2s;
}
.resizable-box:hover::after {
  border-color: rgba(0, 0, 0, 0.1); /* делает границу видимой */
}
.resizable-box:hover {
  cursor: default; /* меняет курсор на "move", когда курсор наведен на элемент */
}
</style>
