<script lang="ts" setup>
import type { ButtonClass } from '@/types/components';
import { defineProps } from 'vue';
const props = defineProps<{
  buttons: ButtonClass[];
}>();
console.log(props);
</script>
<template>
  <div class="button-line">
    <div v-for="(button, index) in buttons" :key="index" @click="button.action" class="btn-14">
      {{ button.label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* Стили для кнопок и линии */
.button-line {
  position: relative;
  display: flex;
  justify-content: center;
  margin-top: -2px;
  width: 100%;
}

.btn-14 {
  flex: 1;
  text-align: center;
  display: inline-block;
  padding: 15px 40px;
  cursor: pointer;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  border-bottom: 2px solid black;
}

.btn-14:before {
  content: '';
  position: absolute;
  width: 0;
  background: black;
  left: 45%;
  height: 2px;
  top: 0;
  transition: all 0.3s;
  opacity: 0.7;
}

.btn-14:hover:before {
  width: 100%;
  left: 0;
}
</style>
