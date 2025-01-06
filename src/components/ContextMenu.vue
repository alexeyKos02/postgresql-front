<script setup lang="ts">
import type { ContextMenuElement } from '@/types'
import { ref, reactive, onMounted, onBeforeUnmount, defineProps } from 'vue'

const props = defineProps<{
  elements: ContextMenuElement[]
}>()
// Позиция меню
const menuPosition = reactive({ x: 0, y: 0 })
// Видимость меню
const isMenuVisible = ref<boolean>(false)

// Показать контекстное меню
function showMenu(event: MouseEvent) {
  hideMenu()
  menuPosition.x = event.clientX
  menuPosition.y = event.clientY
  isMenuVisible.value = true
}

// Скрыть контекстное меню
function hideMenu() {
  isMenuVisible.value = false
}

// Скрывать меню при клике вне его (глобальный обработчик)
function handleGlobalClick(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.context-menu')) {
    hideMenu()
  }
}

onMounted(() => {
  window.addEventListener('click', handleGlobalClick)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', handleGlobalClick)
})
</script>

<template>
  <slot name="element" :onClick="showMenu"></slot>
  <div
    v-if="isMenuVisible"
    class="context-menu"
    :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
  >
    <ul>
      <li v-for="element in props.elements" :key="element.title" @click="element.action">
        {{ element.title }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 150px;
  font-size: 12px;
  transition: all 0.2s linear;
}

.context-menu ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.context-menu li {
  padding: 10px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.context-menu li:hover {
  background-color: #f5f5f5;
}

.context-menu li:last-child {
  border-bottom: none;
}
</style>
