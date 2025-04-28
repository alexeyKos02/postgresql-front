<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';
import Knob from 'primevue/knob';

const props = defineProps<{
  targetValue: number;
  size?: number;
}>();

const animatedValue = ref(0);
let frame: number;

function animate() {
  frame = requestAnimationFrame(() => {
    const diff = props.targetValue - animatedValue.value;
    if (Math.abs(diff) < 1) {
      animatedValue.value = props.targetValue;
    } else {
      animatedValue.value += diff * 0.1; // плавность
      animate();
    }
  });
}

watch(
  () => props.targetValue,
  () => {
    cancelAnimationFrame(frame);
    animate();
  },
  { immediate: true },
);

onMounted(() => {
  animatedValue.value = props.targetValue;
});

// Вычисляем цвет кольца в зависимости от процента
const valueColor = computed(() => {
  if (animatedValue.value > 85) return '#e74c3c'; // Красный
  if (animatedValue.value > 60) return '#f39c12'; // Оранжевый
  return undefined; // Оставить стандартный цвет
});
</script>

<template>
  <Knob
    :modelValue="Math.round(animatedValue)"
    :size="size ?? 100"
    readonly
    :valueColor="valueColor"
  />
</template>
