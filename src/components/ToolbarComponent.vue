<template>
  <div class="card">
    <Toast />

    <Toolbar class="toolbar">
      <template #start>
        <div class="start-comp">
          <img class="logo" alt="icon" src="../assets/icon.svg" />

          <!-- Поповеры -->
          <CustomPopover
            label="Кластер"
            popoverId="cluster"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="() => openNewModule('cluster')"
          />
          <CustomPopover
            label="Пользователи"
            popoverId="users"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="() => openNewModule('users')"
          />
          <CustomPopover
            label="securityGroups"
            popoverId="securityGroups"
            :popupOptions="popupOptions"
            :customToggle="toggle"
            :customOpenNewModule="() => openNewModule('securityGroups')"
          />

          <!-- Добавить пространство -->
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
            <i
              v-if="isLoading"
              class="pi pi-spin pi-spinner text-gray-500"
              style="font-size: 1.4rem"
            ></i>
          </div>

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
        <div class="user-context">
          <!-- Роль -->
          <div class="context-item">
            <span class="context-label">Роль:</span>
            <transition name="fade-slide" mode="out-in">
              <span
                class="context-badge"
                :class="getRoleBadgeClass(store.currentUserInfo?.role)"
                :key="store.currentUserInfo?.role"
              >
                {{ store.currentUserInfo?.role || '—' }}
              </span>
            </transition>
          </div>

          <!-- Кластер -->
          <div class="context-item">
            <span class="context-label">Кластер:</span>
            <transition name="fade-slide" mode="out-in">
              <span class="context-value" :key="store.currentUserInfo?.cluster">
                {{ store.currentUserInfo?.cluster || '—' }}
              </span>
            </transition>
          </div>

          <!-- Пространство -->
          <div class="context-item">
            <span class="context-label">Пространство:</span>
            <transition name="fade-slide" mode="out-in">
              <span class="context-value" :key="store.currentUserInfo?.workspace">
                {{ store.currentUserInfo?.workspace || '—' }}
              </span>
            </transition>
          </div>
        </div>

        <Avatar
          ref="avatarButton"
          image="https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png"
          style="width: 32px; height: 32px; cursor: pointer"
          @click="toggleSettings"
        />

        <OverlayPanel ref="settingsPanel" :dismissable="true">
          <div class="settings-panel">
            <div class="settings-item">
              <span>Полноразмерный формат</span>
              <InputSwitch v-model="isFullViewEnabled" @change="onFullViewToggle" />
            </div>

            <div class="settings-item logout-item" @click="logout">
              <span>Выйти из аккаунта</span>
              <i class="pi pi-sign-out" />
            </div>
          </div>
        </OverlayPanel>
      </template>
    </Toolbar>
  </div>
</template>

<script setup lang="ts">
import Toolbar from 'primevue/toolbar';
import Avatar from 'primevue/avatar';
import { ref, onMounted, watch } from 'vue';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import CustomPopover from './CustomPopover.vue';
import InputText from 'primevue/inputtext';
import { useRenderStore } from '@/stores';
import { useToast } from 'primevue';
import OverlayPanel from 'primevue/overlaypanel';
import InputSwitch from 'primevue/inputswitch';
import { useRouter } from 'vue-router';

const store = useRenderStore();
const toast = useToast();
const router = useRouter();
const popupOptions = ref([{ name: 'Открыть в новом окне', code: 'create' }]);

// Состояния добавления пространства
const isAddingWorkspace = ref(false);
const workspaceName = ref('');
const isLoading = ref(false);

// Настройки панели
const settingsPanel = ref();
const avatarButton = ref();

// Полноразмерный формат
const isFullViewEnabled = ref(false);

// Blur fix
let blurTimeout: ReturnType<typeof setTimeout> | null = null;

function getRoleBadgeClass(role?: string): string {
  switch (role) {
    case 'Admin':
      return 'badge-admin';
    case 'Editor':
      return 'badge-editor';
    case 'Viewer':
      return 'badge-viewer';
    default:
      return 'badge-unknown';
  }
}

// Поповер переключатели
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

// Открытие модулей
function openNewModule(id: string) {
  switch (id) {
    case 'cluster':
      if (store.modules[0]) store.modules[0].isActive = false;
      break;
    case 'users':
      console.log('users');
      break;
    case 'securityGroups':
      console.log('securityGroups');
      break;
  }
}

// Добавление пространства
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

    toast.add({
      severity: 'success',
      summary: 'Успех',
      detail: `Пространство "${workspaceName.value}" добавлено`,
      life: 3000,
    });

    await store.fetchWorkspaces();
  } catch (error: any) {
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
  blurTimeout = setTimeout(() => {
    cancelAddWorkspace();
  }, 150);
}

// Панель настроек
const toggleSettings = (event: Event) => {
  settingsPanel.value.toggle(event);
};

// Переключение полноразмерного формата
function onFullViewToggle() {
  store.isFull = isFullViewEnabled.value;
}

// Следим за изменениями в store
watch(
  () => store.isFull,
  (newVal) => {
    isFullViewEnabled.value = !!newVal;
  },
  { immediate: true },
);

// Выход из аккаунта
function logout() {
  localStorage.removeItem('token');
  toast.add({
    severity: 'info',
    summary: 'Выход',
    detail: 'Вы вышли из аккаунта',
    life: 2000,
  });
  router.push('/login');
}

// При монтировании
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

.settings-panel {
  min-width: 220px;
  padding: 1rem;

  .settings-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.5rem;

    span {
      font-weight: 500;
    }
  }

  .logout-item {
    margin-top: 1rem;
    cursor: pointer;
    color: #dc3545;

    &:hover {
      color: #c82333;
    }

    i {
      margin-left: 0.5rem;
    }
  }
}
.user-context {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-right: 1rem;
  font-size: 12px;
  color: #4b5563;
  text-align: right;

  .context-item {
    display: flex;
    gap: 6px;
    align-items: center;
    line-height: 1.3;
  }

  .context-label {
    font-weight: 600;
    color: #374151;
  }

  .context-value {
    font-weight: 500;
    color: #111827;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}
.context-badge {
  padding: 2px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-transform: uppercase;
  white-space: nowrap;
}

.badge-admin {
  background-color: #10b981; // зелёный
}

.badge-editor {
  background-color: #f59e0b; // жёлтый
}

.badge-viewer {
  background-color: #3b82f6; // синий
}

.badge-unknown {
  background-color: #6b7280; // серый
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.25s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(5px);
}
</style>
