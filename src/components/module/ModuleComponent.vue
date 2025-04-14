<script lang="ts" setup>
import { useRenderStore } from '@/stores';
import { computed, ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { TypeModule } from '@/types/components';


const store = useRenderStore();
const fullView = computed(() => store.modules[0]?.isActive ?? false);
const moduleType = computed(() => fullView.value ? 'center': 'divide');
  // const moduleType = ref<string>('divide');
const goingBack = computed(() => {
  if (moduleType.value === 'center') {
    return store.centerModuleHistory.length > 1;
  }
  return 0;
});
const backAction = () => {
  if (store.centerModule?.isActive) {
    store.centerModule.type = store.centerModuleHistory[store.centerModuleHistory.length - 2];
    store.centerModuleHistory.pop();
  }
};
const closeModal = () => {
  if (store.centerModule) {
    store.centerModule.isActive = false;
  }
};
</script>

<template>
  <div style="height: 100%">
    <div class="control-panel" v-if="false">
      <FontAwesomeIcon
        v-if="goingBack"
        icon="fa-solid fa-circle-arrow-left"
        class="back-btn"
        @click="backAction"
      />
      <FontAwesomeIcon icon="fa-solid fa-circle-xmark" class="close-btn" @click="closeModal" />
    </div>
    <div class="module" :class="{ 'module--center': moduleType === 'center' }">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.module {
  display: flex;
  flex-direction: column;
  overflow: scroll;
  // margin-left: 1vw;
  width: 100%;
  height: 100%;
  padding: 2% 3%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Добавляет тень */
  &--center {
    height: 95%;
    // position: absolute;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    width: 100%;
    margin-left: 1vw;
    // height: 70%;
    border-radius: 10px; /* Скругляет углы */
    // background-color: #f4f4f5;
  }
}
// .close-btn {
//   background: none;
//   border: none;
//   font-size: 24px;
//   color: #888;
//   cursor: pointer;
//   border-radius: 50%;
// }
.back-btn,
.close-btn {
  width: 1vw;
  height: 1vw;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  cursor: pointer;
  font-size: 24px;
}

.back-btn {
  background-color: yellow; /* Желтая кнопка */
}

.close-btn {
  background-color: red; /* Красная кнопка */
}
.control-panel {
  position: absolute;
  top: 16%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.1vw;
  background: grey;
  z-index: 999;
  padding-top: 3px;
  padding-bottom: 3px;
  padding-left: 4px;
  border-radius: 10px 10px 0 0;
  box-shadow: 0 -4px 8px rgba(0, 0, 0, 0.2);
}
</style>
