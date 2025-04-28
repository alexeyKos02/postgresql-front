<script lang="ts" setup>
import type { ButtonClass } from '@/types/components';
import { defineProps, ref, watch, computed } from 'vue';

const props = defineProps<{
  buttons: ButtonClass[];
  activePage: number; // <-- Новое: активный индекс (передается через пропсы)
}>();

// Не нужен отдельный ref для activeIndex, он теперь вычисляется
const activeIndex = computed(() => props.activePage);

function handleClick(index: number, action: () => void) {
  action();
}
</script>

<template>
  <div class="button-line">
    <div
      v-for="(button, index) in buttons"
      :key="index"
      @click="handleClick(index, button.action)"
      class="btn-14"
      :class="{ active: activeIndex === index }"
    >
      {{ button.label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button-line {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  border-bottom: 1px solid var(--p-primary-color);
}

.btn-14 {
  flex: 1;
  text-align: center;
  display: inline-block;
  padding: 16px 40px;
  cursor: pointer;
  letter-spacing: 1.5px;
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid var(--p-primary-color);
  font-weight: 500;
  color: #333;
  background-color: #fff;
  transition: all 0.3s ease;
  user-select: none;

  &:hover,
  &.active {
    color: var(--p-primary-color);
    background-color: #f9f9f9;
  }

  &:active {
    background-color: #f0f8ff;
    color: var(--p-primary-color);
  }

  &.active:before {
    width: 100%;
    left: 0;
  }
}

.btn-14:before {
  content: '';
  position: absolute;
  width: 0;
  background: var(--p-primary-color);
  left: 50%;
  height: 2px;
  top: 0;
  transition: all 0.3s;
  opacity: 0.9;
}

.btn-14:hover:before {
  width: 100%;
  left: 0;
}
</style>
