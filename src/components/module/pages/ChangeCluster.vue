<template>
  <div class="page-wrapper">
    <h2>Конфигурация кластера</h2>

    <!-- 🔍 Поиск -->
    <div class="search-wrapper sticky-search">
      <i class="pi pi-search search-icon" />
      <InputText v-model="search" placeholder="Поиск параметра..." class="search-input" />
    </div>

    <div v-if="loading">Загрузка...</div>

    <div v-else>
      <div class="config-grid">
        <div
          v-for="(param, index) in filteredConfig"
          :key="param.name"
          class="config-item"
          :class="{
            wide: param.type === 'text',
            'force-expand': isLastInRow(index, filteredConfig.length),
          }"
        >
          <label>{{ param.name }}</label>

          <template v-if="param.type === 'select' && param.options">
            <Select
              v-model="param.value"
              :options="param.options"
              placeholder="Выберите значение"
            />
          </template>

          <template v-else-if="param.type === 'bool'">
            <Select v-model="param.value" :options="['on', 'off']" placeholder="on/off" />
          </template>

          <template v-else>
            <InputText v-model="param.value" />
          </template>
        </div>
      </div>

      <div class="save-btn-wrapper">
        <Button label="Сохранить" icon="pi pi-check" :loading="saving" @click="saveChanges" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Button from 'primevue/button';
import {
  getClusterConfiguration,
  createClusterConfiguration,
  getClusterConfigurationReadiness,
} from '@/utils/api';
import { useRenderStore } from '@/stores';

type ConfigParam = {
  name: string;
  type: 'text' | 'bool' | 'select';
  options: string[] | null;
  value: string | null;
};

type CreateClusterConfigurationRequest = Record<string, string>;

const props = defineProps<{
  workspaceId: number;
  moduleId: number;
}>();

const store = useRenderStore();
const toast = useToast();

const config = ref<ConfigParam[]>([]);
const loading = ref(false);
const saving = ref(false);
const search = ref('');
const clusterId = store.singleClusters[props.moduleId];

onMounted(async () => {
  loading.value = true;
  try {
    const result = await getClusterConfiguration(props.workspaceId, clusterId);
    config.value = result;
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка загрузки',
      detail: 'Не удалось получить конфигурацию кластера',
      life: 3000,
    });
  } finally {
    loading.value = false;
  }
});

const filteredConfig = computed(() =>
  config.value.filter((param) => param.name.toLowerCase().includes(search.value.toLowerCase())),
);

function isLastInRow(index: number, total: number) {
  return (index + 1) % 3 === total % 3;
}

async function saveChanges() {
  saving.value = true;
  try {
    const payload: CreateClusterConfigurationRequest = config.value.reduce((acc, param) => {
      acc[param.name] = param.value ?? '';
      return acc;
    }, {} as CreateClusterConfigurationRequest);

    await createClusterConfiguration(props.workspaceId, clusterId, payload);

    // 🕵️‍♂️ Проверка применения
    const maxAttempts = 5;
    let applied = false;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const readiness = await getClusterConfigurationReadiness(props.workspaceId, clusterId);

      if (readiness.status === 'ready') {
        applied = true;
        break;
      }

      // Подождать перед следующей попыткой
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    if (applied) {
      toast.add({
        severity: 'success',
        summary: 'Сохранено',
        detail: 'Конфигурация успешно применена',
        life: 3000,
      });
    } else {
      toast.add({
        severity: 'warn',
        summary: 'Изменения не применились',
        detail: 'Проверьте параметры вручную или попробуйте позже',
        life: 4000,
      });
    }
  } catch (error: any) {
    toast.add({
      severity: 'error',
      summary: 'Ошибка сохранения',
      detail: error.message || 'Не удалось сохранить изменения',
      life: 4000,
    });
  } finally {
    saving.value = false;
  }
}
</script>

<style scoped lang="scss">
.page-wrapper {
  padding-bottom: 40px;
}

h2 {
  margin-bottom: 12px;
}

/* 🔍 Поиск */
.sticky-search {
  width: 95%;
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: #f9f9f9;
  padding: 12px 20px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-icon {
  font-size: 1rem;
  color: #888;
}

.search-input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #d0d7de;
  border-radius: 8px;
  font-size: 14px;
  background-color: #fff;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
  }
}
/* ⚙️ Сетка параметров */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.config-item {
  display: flex;
  flex-direction: column;

  label {
    font-weight: 600;
    margin-bottom: 6px;
  }

  .p-inputtext,
  .p-dropdown {
    width: 100%;
  }

  &.wide {
    grid-column: span 2;
  }

  &.force-expand {
    grid-column: span 3;
  }
}

.save-btn-wrapper {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
}
</style>
