<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue'

// Позиция меню
const menuPosition = reactive({ x: 0, y: 0 })
// Видимость меню
const isMenuVisible = ref<boolean>(false)

// Показать контекстное меню
function showMenu(event: MouseEvent) {
  menuPosition.x = event.clientX
  menuPosition.y = event.clientY
  isMenuVisible.value = true
}

// Скрыть контекстное меню
function hideMenu() {
  isMenuVisible.value = false
}

// Пример действий для пунктов меню
function menuAction1() {
  alert('Действие 1 выполнено')
  hideMenu()
}

function menuAction2() {
  alert('Действие 2 выполнено')
  hideMenu()
}

function menuAction3() {
  alert('Действие 3 выполнено')
  hideMenu()
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
  <div class="context-area" @contextmenu.prevent="showMenu">Щелкните правой кнопкой мыши здесь</div>

  <div
    v-if="isMenuVisible"
    class="context-menu"
    :style="{ top: `${menuPosition.y}px`, left: `${menuPosition.x}px` }"
  >
    <ul>
      <li @click="menuAction1">Действие 1</li>
      <li @click="menuAction2">Действие 2</li>
      <li @click="menuAction3">Действие 3</li>
    </ul>
  </div>
</template>

<style scoped>
.context-area {
  width: 100%;
  height: 200px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}

.context-menu {
  position: absolute;
  background-color: white;
  border: 1px solid #ccc;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  width: 150px;
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
