<script lang="ts" setup>
import { useRenderStore } from '@/stores';
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { TypeModule, type Module } from '@/types/components';

const props = defineProps<{
  module?: Module;
}>();
const store = useRenderStore();

const isFull = computed(() => store.isFull);
const panelOpen = ref(false);

const togglePanel = () => {
  panelOpen.value = !panelOpen.value;
};

const goingBack = computed(() => {
  // return isFull.value && store.moduleTypeHistory[props.module?.location ?? 0]?.length > 1;
  return store.moduleTypeHistory[props.module?.location ?? 0]?.length > 1;
});

const backAction = () => {
  const history = store.moduleTypeHistory[props.module?.location ?? 0];
  if (history.length > 1) {
    history.pop();
    const previous = history[history.length - 1];
    store.modules[props.module?.location ?? 0].type = previous;
  }
};

const closeModal = () => {
  const centerModule = store.modules[props.module?.location ?? 0];
  if (centerModule) {
    centerModule.type = TypeModule.Default;
    store.moduleTypeHistory[props.module?.location ?? 0] = [];
    panelOpen.value = false;
    centerModule.isActive = false;
  }
};
</script>

<template>
  <div v-if="store.modules[props.module?.location ?? 0]?.isActive" class="wrapper">
    <div class="module" :class="{ 'module--center': isFull }">
      <!-- 🌟 Кнопка-шестерёнка -->
      <div class="toggle-button" @click="togglePanel">
        <FontAwesomeIcon icon="fa-solid fa-gear" />
      </div>

      <!-- ⚙️ Панель управления -->
      <transition name="slide-fade">
        <div v-if="panelOpen" class="floating-panel">
          <FontAwesomeIcon
            v-if="goingBack"
            icon="fa-solid fa-circle-arrow-left"
            class="icon-button back-btn"
            @click="backAction"
          />
          <FontAwesomeIcon
            icon="fa-solid fa-circle-xmark"
            class="icon-button close-btn"
            @click="closeModal"
          />
        </div>
      </transition>

      <!-- Контент -->
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.module {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  width: 100%;
  height: 100%;
  padding: 2% 3%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &--center {
    height: 95%;
    width: 100%;
    margin-left: 1vw;
    border-radius: 10px;
    background-color: white;
  }
}

/* 🔘 Кнопка переключения */
.toggle-button {
  position: absolute;
  top: 24px;
  right: 8px;
  width: 36px;
  height: 36px;
  background-color: #3498db;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }
}

/* ⚙️ Панель управления */
.floating-panel {
  position: absolute;
  top: 72px;
  right: 8px;
  background-color: #f4f4f4;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.15);
  z-index: 999;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.icon-button {
  width: 36px;
  height: 36px;
  font-size: 16px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.back-btn {
    background-color: #f1c40f;
  }

  &.close-btn {
    background-color: #e74c3c;
  }

  &:hover {
    filter: brightness(1.1);
    transform: scale(1.05);
  }
}

/* 🎞 Анимация появления */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(20%);
}
</style>
