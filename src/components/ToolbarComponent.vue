<template>
  <div class="card">
    <Toast />

    <Toolbar class="toolbar">
      <template #start>
        <div class="start-comp">
          <img class="logo" alt="icon" src="../assets/icon.svg" />

          <!-- Поповеры -->
          <div v-tooltip.bottom="isViewer ? 'Недоступно для Viewer' : ''">
            <CustomPopover
              label="Пространство"
              popoverId="workspace"
              :popupOptions="popupOptions"
              :customToggle="toggle"
              :customOpenNewModule="() => openNewModule('workspace')"
              :disabled="false"
            />
          </div>
          <div v-tooltip.bottom="isViewer ? 'Недоступно для Viewer' : ''">
            <CustomPopover
              label="Пользователи"
              popoverId="users"
              :popupOptions="popupOptions"
              :customToggle="toggle"
              :customOpenNewModule="() => openNewModule('users')"
              :disabled="isViewer"
            />
          </div>
          <div v-tooltip.bottom="isViewer ? 'Недоступно для Viewer' : ''">
            <CustomPopover
              label="securityGroups"
              popoverId="securityGroups"
              :popupOptions="popupOptions"
              :customToggle="toggle"
              :customOpenNewModule="() => openNewModule('securityGroups')"
              :disabled="isViewer"
            />
          </div>

          <!-- Добавить пространство -->
          <div v-if="isAddingWorkspace" class="add-workspace-inline">
            <InputText
              v-model="workspaceName"
              placeholder="Название пространства"
              @keydown.enter="confirmAddWorkspace"
              @blur="handleBlur"
              autofocus
              class="workspace-input"
              :disabled="isViewer || isLoading"
            />
            <Button
              v-if="!isLoading"
              icon="pi pi-check"
              class="p-button-text p-button-success"
              @click="confirmAddWorkspace"
              :disabled="isViewer || !workspaceName.trim()"
            />
            <Button
              v-if="!isLoading"
              icon="pi pi-times"
              class="p-button-text p-button-secondary"
              @click="cancelAddWorkspace"
              :disabled="isViewer"
            />
          </div>
          <div v-else v-tooltip.bottom="isViewer ? 'Недоступно для Viewer' : ''">
            <Button
              label="Добавить пространство"
              icon="pi pi-plus"
              class="add-workspace-button"
              @click="startAddingWorkspace"
              text
              :disabled="isViewer"
            />
          </div>
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
                :class="getRoleBadgeClass(store.currentUserInfo[store.currentUserInfoId]?.role)"
                :key="store.currentUserInfo[store.currentUserInfoId]?.role"
              >
                {{ store.currentUserInfo[store.currentUserInfoId]?.role || '—' }}
              </span>
            </transition>
          </div>

          <!-- Кластер -->
          <div class="context-item">
            <span class="context-label">Кластер:</span>
            <transition name="fade-slide" mode="out-in">
              <span
                class="context-value"
                :key="store.currentUserInfo[store.currentUserInfoId]?.cluster"
              >
                {{ store.currentUserInfo[store.currentUserInfoId]?.cluster || '—' }}
              </span>
            </transition>
          </div>

          <!-- Пространство -->
          <div class="context-item">
            <span class="context-label">Пространство:</span>
            <transition name="fade-slide" mode="out-in">
              <span
                class="context-value"
                :key="store.currentUserInfo[store.currentUserInfoId]?.workspace"
              >
                {{ store.currentUserInfo[store.currentUserInfoId]?.workspace || '—' }}
              </span>
            </transition>
          </div>
          <!-- Модуль -->
          <div class="context-item">
            <span class="context-label">Модуль:</span>
            <transition name="fade-slide" mode="out-in">
              <span class="context-value" :key="store.currentUserInfoId + 1">
                {{ store.currentUserInfoId + 1 || '—' }}
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

            <div class="accordion" @click="showColorSettings = !showColorSettings">
      <div class="accordion-header">
        <i class="pi pi-palette"></i>
        <span>Настройка цвета интерфейса</span>
        <i :class="['pi', showColorSettings ? 'pi-chevron-up' : 'pi-chevron-down']" class="chevron"></i>
      </div>
    </div>

    <transition name="fade">
      <div v-if="showColorSettings" class="theme-section">
        <span class="section-label">Основной цвет</span>
        <div class="theme-colors limited-width">
          <button
            v-for="color in primaryColors"
            :key="color.name"
            class="theme-color"
            :title="color.name"
            @click="updateColors('primary', color)"
            :style="{
              backgroundColor: `${color.name === 'noir' ? 'var(--text-color)' : color.palette['500']}`,
              outlineColor: `${selectedPrimaryColor === color.name ? 'var(--p-primary-color)' : 'transparent'}`
            }"
          ></button>
        </div>
      </div>
    </transition>
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
import { ref, onMounted, watch, computed } from 'vue';
import Toast from 'primevue/toast';
import Button from 'primevue/button';
import CustomPopover from './CustomPopover.vue';
import InputText from 'primevue/inputtext';
import { useRenderStore } from '@/stores';
import { useToast } from 'primevue';
import OverlayPanel from 'primevue/overlaypanel';
import InputSwitch from 'primevue/inputswitch';
import { useRouter } from 'vue-router';
import { SpacePage, TypeModule } from '@/types/components';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { updatePreset } from '@primevue/themes';

// Цвета и состояния темы
const selectedPrimaryColor = ref('noir');
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
const currentUser = computed(() => store.currentUserInfo[store.currentUserInfoId]);
const isViewer = computed(() => currentUser.value?.role === 'Viewer');

// Полноразмерный формат
const isFullViewEnabled = ref(false);

const showColorSettings = ref(false);
const primaryColors = [
  { name: 'noir', palette: {} },
  {
    name: 'emerald',
    palette: {
      50: '#ecfdf5',
      100: '#d1fae5',
      200: '#a7f3d0',
      300: '#6ee7b7',
      400: '#34d399',
      500: '#10b981',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
      950: '#022c22',
    },
  },
  {
    name: 'green',
    palette: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#22c55e',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d',
      950: '#052e16',
    },
  },
  {
    name: 'lime',
    palette: {
      50: '#f7fee7',
      100: '#ecfccb',
      200: '#d9f99d',
      300: '#bef264',
      400: '#a3e635',
      500: '#84cc16',
      600: '#65a30d',
      700: '#4d7c0f',
      800: '#3f6212',
      900: '#365314',
      950: '#1a2e05',
    },
  },
  {
    name: 'orange',
    palette: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#fdba74',
      400: '#fb923c',
      500: '#f97316',
      600: '#ea580c',
      700: '#c2410c',
      800: '#9a3412',
      900: '#7c2d12',
      950: '#431407',
    },
  },
  {
    name: 'amber',
    palette: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
      950: '#451a03',
    },
  },
  {
    name: 'yellow',
    palette: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
      950: '#422006',
    },
  },
  {
    name: 'teal',
    palette: {
      50: '#f0fdfa',
      100: '#ccfbf1',
      200: '#99f6e4',
      300: '#5eead4',
      400: '#2dd4bf',
      500: '#14b8a6',
      600: '#0d9488',
      700: '#0f766e',
      800: '#115e59',
      900: '#134e4a',
      950: '#042f2e',
    },
  },
  {
    name: 'cyan',
    palette: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
      950: '#083344',
    },
  },
  {
    name: 'sky',
    palette: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
      950: '#082f49',
    },
  },
  {
    name: 'blue',
    palette: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
      950: '#172554',
    },
  },
  {
    name: 'indigo',
    palette: {
      50: '#eef2ff',
      100: '#e0e7ff',
      200: '#c7d2fe',
      300: '#a5b4fc',
      400: '#818cf8',
      500: '#6366f1',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },
  },
  {
    name: 'violet',
    palette: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
      950: '#2e1065',
    },
  },
  {
    name: 'purple',
    palette: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7',
      600: '#9333ea',
      700: '#7e22ce',
      800: '#6b21a8',
      900: '#581c87',
      950: '#3b0764',
    },
  },
  {
    name: 'fuchsia',
    palette: {
      50: '#fdf4ff',
      100: '#fae8ff',
      200: '#f5d0fe',
      300: '#f0abfc',
      400: '#e879f9',
      500: '#d946ef',
      600: '#c026d3',
      700: '#a21caf',
      800: '#86198f',
      900: '#701a75',
      950: '#4a044e',
    },
  },
  {
    name: 'pink',
    palette: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#f9a8d4',
      400: '#f472b6',
      500: '#ec4899',
      600: '#db2777',
      700: '#be185d',
      800: '#9d174d',
      900: '#831843',
      950: '#500724',
    },
  },
  {
    name: 'rose',
    palette: {
      50: '#fff1f2',
      100: '#ffe4e6',
      200: '#fecdd3',
      300: '#fda4af',
      400: '#fb7185',
      500: '#f43f5e',
      600: '#e11d48',
      700: '#be123c',
      800: '#9f1239',
      900: '#881337',
      950: '#4c0519',
    },
  },
];
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
    case 'workspace':
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

function getPresetExt() {
  const color = primaryColors.find((c) => c.name === selectedPrimaryColor.value);
  if (color?.name === 'noir') {
    return {
      semantic: {
        primary: {
          50: '{surface.50}',
          100: '{surface.100}',
          200: '{surface.200}',
          300: '{surface.300}',
          400: '{surface.400}',
          500: '{surface.500}',
          600: '{surface.600}',
          700: '{surface.700}',
          800: '{surface.800}',
          900: '{surface.900}',
          950: '{surface.950}',
        },
      },
    };
  }
  return {
    semantic: {
      primary: color?.palette,
    },
  };
}

function updateColors(type: 'primary', color: any) {
  if (type === 'primary') {
    selectedPrimaryColor.value = color.name;
    updatePreset(getPresetExt());
  }
}

// Открытие модулей
function openNewModule(id: string) {
  const module = store.modules.find((mod) => mod.isActive === false);
  const workspace = store.workspaces.find(
    (wk) => wk.name === store.currentUserInfo[store.currentUserInfoId].workspace,
  );
  console.log('wk1', workspace);

  if (!workspace) {
    toast.add({
      severity: 'warn',
      summary: 'Пространство не выбрано',
      // detail: 'Нет свободного модуля для открытия',
      life: 3000,
    });
    return;
  }

  if (!module) {
    toast.add({
      severity: 'warn',
      summary: 'Модули закончились',
      detail: 'Нет свободного модуля для открытия',
      life: 3000,
    });
    return;
  }

  if (store.isFull) {
    store.isFull = false;
  }

  switch (id) {
    case 'workspace':
      module.isActive = true;
      module.type = TypeModule.Space;
      break;

    case 'users':
      module.isActive = true;
      module.type = TypeModule.AddUser;
      break;

    case 'securityGroups':
      module.isActive = true;
      module.type = TypeModule.AddSecurityGroup;
      break;
  }

  if (workspace) {
    console.log(workspace, 'wr');
    store.currentWorkspaces[module.location] = workspace;
    store.currentUserInfoId = module.location;
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
.settings-panel {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  min-width: 240px;
  gap: 1rem;
}

.settings-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.95rem;
  font-weight: 500;
  color: #374151;
}

.logout {
  color: #dc3545;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #b91c1c;
  }
}

.accordion {
  cursor: pointer;
  padding: 0.5rem 0;
  border-top: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.accordion-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  font-weight: 600;
  color: #111827;

  .pi-palette {
    color: var(--p-primary-color);
  }

  .chevron {
    margin-left: auto;
    color: #6b7280;
  }
}

.theme-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.section-label {
  font-size: 0.875rem;
  color: #4b5563;
  font-weight: 500;
}

.theme-colors {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 0.4rem;
}

.theme-colors.limited-width {
  grid-template-columns: repeat(7, 1fr); // уменьшаем количество столбцов
}

.theme-color {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  outline: 2px solid;
  outline-offset: 2px;
  border: none;
  cursor: pointer;
  transition: outline-color 0.2s ease-in-out;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
