<template>
  <div class="card">
    <Toast />

    <Toolbar class="toolbar">
      <template #start>
        <div class="start-comp">
          <img class="logo" alt="icon" src="../assets/icon.svg" />

          <!-- Остальные поповеры -->
          <CustomPopover
            label="Кластер"
            popoverId="cluster"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="openNewModule"
          />
          <CustomPopover
            label="Пользователи"
            popoverId="users"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="openNewModule"
          />
          <CustomPopover
            label="securityGroups"
            popoverId="securityGroups"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="openNewModule"
          />

          <!-- Добавить пространство — если активен режим ввода -->
          <div v-if="isAddingWorkspace" class="add-workspace-inline">
            <InputText
              v-model="workspaceName"
              placeholder="Название пространства"
              @keydown.enter="confirmAddWorkspace"
              @blur="handleBlur"
              autofocus
              class="workspace-input"
              :disabled="isLoading"
            />
            <Button
              v-if="!isLoading"
              icon="pi pi-check"
              class="p-button-text p-button-success"
              @click="confirmAddWorkspace"
              :disabled="!workspaceName.trim()"
            />
            <Button
              v-if="!isLoading"
              icon="pi pi-times"
              class="p-button-text p-button-secondary"
              @click="cancelAddWorkspace"
            />
            <i v-if="isLoading" class="pi pi-spin pi-spinner text-gray-500" style="font-size: 1.4rem;"></i>
          </div>

          <!-- Если не активен режим ввода — показываем кнопку -->
          <Button
            v-else
            label="Добавить пространство"
            icon="pi pi-plus"
            class="add-workspace-button"
            @click="startAddingWorkspace"
            text
          />
        </div>
      </template>

      <template #end>
        <Avatar
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          style="width: 32px; height: 32px"
        />
      </template>
    </Toolbar>
  </div>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Avatar from 'primevue/avatar';
import { ref, onMounted } from 'vue';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import CustomPopover from './CustomPopover.vue';
import InputText from 'primevue/inputtext';
import { useRenderStore } from '@/stores';
import { useToast } from 'primevue';

const store = useRenderStore();
const toast = useToast();
const popupOptions = ref([{ name: 'Открыть в новом окне', code: 'create' }]);

// Состояния
const isAddingWorkspace = ref(false);
const workspaceName = ref('');
const isLoading = ref(false); // 👈 добавили загрузку

// Флаг чтобы избежать blur при клике на кнопки
let blurTimeout: ReturnType<typeof setTimeout> | null = null;

const toggle = (id: string) => {
  switch (id) {
    case 'cluster':
      console.log('cluster2');
      break;
    case 'users':
      console.log('users2');
      break;
    case 'securityGroups':
      console.log('securityGroups2');
      break;
  }
};

function openNewModule(popover: object | null) {
  if (!popover) return;

  const id = popover.$attrs?.id || popover.$el?.id;

  if (!id) return;

  switch (id) {
    case 'cluster':
      console.log('cluster');
      if (store.modules[0]) {
        store.modules[0].isActive = false;
      }
      break;
    case 'users':
      console.log('users');
      break;
    case 'securityGroups':
      console.log('securityGroups');
      break;
  }
}

// Начать добавление
function startAddingWorkspace() {
  isAddingWorkspace.value = true;
  workspaceName.value = '';
}

// Отмена добавления
function cancelAddWorkspace() {
  isAddingWorkspace.value = false;
  workspaceName.value = '';
}

// Подтверждение добавления
async function confirmAddWorkspace() {
  if (!workspaceName.value.trim()) return;

  isLoading.value = true;

  try {
    await store.createWorkspace({ name: workspaceName.value });
    console.log('opppi')
    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: `Пространство "${workspaceName.value}" добавлено`,
      life: 3000,
    });

    // 🆕 Загружаем все workspaces после добавления
    await store.fetchWorkspaces();
  } catch (error) {
    console.error(error);
    toast.add({
      severity: 'error',
      summary: 'Ошибка',
      detail: error.response?.data?.message || 'Не удалось добавить пространство',
      life: 3000,
    });
  } finally {
    isLoading.value = false;
    cancelAddWorkspace();
  }
}

// Обработка потери фокуса
function handleBlur() {
  // Добавим небольшую задержку, чтобы не срабатывало при клике на кнопки
  blurTimeout = setTimeout(() => {
    cancelAddWorkspace();
  }, 150);
}

// 🆕 Подгружаем workspaces при монтировании
onMounted(async () => {
  try {
    isLoading.value = true;
    await store.fetchWorkspaces();
  } finally {
    isLoading.value = false;
  }
});
</script>

<style scoped lang="scss">
.card {
  position: fixed;
  width: 100%;
  z-index: 1000;
}
.toolbar {
  padding-left: 2vw;
  padding-right: 2vw;
}
.start-comp {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo {
  width: 36px;
}

.add-workspace-button {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
  font-size: 0.9rem;

  &:hover {
    background-color: #eaf7ec;
  }
}

.add-workspace-inline {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.workspace-input {
  width: 200px;
}
</style>
