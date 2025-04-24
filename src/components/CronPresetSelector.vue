<template>
  <div class="cron-selector">
    <label class="cron-label">Cron выражение</label>
    <div class="cron-grid">
      <div class="cron-field">
        <label>Минута</label>
        <InputText v-model="minute" placeholder="0-59 или *" />
      </div>
      <div class="cron-field">
        <label>Час</label>
        <InputText v-model="hour" placeholder="0-23 или *" />
      </div>
      <div class="cron-field">
        <label>День месяца</label>
        <InputText v-model="dayOfMonth" placeholder="1-31 или *" />
      </div>
      <div class="cron-field">
        <label>Месяц</label>
        <InputText v-model="month" placeholder="1-12 или *" />
      </div>
      <div class="cron-field">
        <label>День недели</label>
        <InputText v-model="dayOfWeek" placeholder="0-6 или *" />
      </div>
    </div>
    <div class="cron-result"><strong>Результат:</strong> {{ fullCron }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import InputText from 'primevue/inputtext';

const emit = defineEmits(['update:modelValue']);

const props = defineProps<{ modelValue: string }>();

const minute = ref('*');
const hour = ref('*');
const dayOfMonth = ref('*');
const month = ref('*');
const dayOfWeek = ref('*');

const fullCron = computed(
  () => `${minute.value} ${hour.value} ${dayOfMonth.value} ${month.value} ${dayOfWeek.value}`,
);

watch(fullCron, (val) => {
  emit('update:modelValue', val);
});

watch(
  () => props.modelValue,
  (newVal) => {
    const parts = newVal.trim().split(' ');
    if (parts.length === 5) {
      [minute.value, hour.value, dayOfMonth.value, month.value, dayOfWeek.value] = parts;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.cron-selector {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.cron-label {
  font-weight: 600;
  font-size: 16px;
}

.cron-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
}

.cron-field label {
  font-weight: 500;
  margin-bottom: 4px;
  display: block;
  font-size: 13px;
}

.cron-result {
  margin-top: 10px;
  font-size: 14px;
  color: #333;
  background: #f5f5f5;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
