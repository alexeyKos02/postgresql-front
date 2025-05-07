<script setup lang="ts">
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Tag from 'primevue/tag';
import Password from 'primevue/password';
import Calendar from 'primevue/calendar';
import MultiSelect from 'primevue/multiselect';
import Button from 'primevue/button';
import { useRenderStore } from '@/stores';
import type { User, SecurityGroup } from '@/types/entities';
import type { DeadlockStat, ResponseClusterUser, BackupData } from '@/types/api';
import { TypeModule } from '@/types/components';

const props = defineProps<{
  users?: User[];
  securityGoups?: SecurityGroup[];
  databases?: string[];
  clusterUsers?: ResponseClusterUser[];
  functions?: ((id: string) => void)[];
  deadlocks?: DeadlockStat[];
  replicationHosts?: string[];
  backups?: BackupData[];
  availableRoles?: string[];
  workspaceId?: number;
  clusterId?: number;
}>();

const emit = defineEmits<{
  (e: 'save', user: ResponseClusterUser, changes: typeof editFields.value): void;
}>();

function emitSave(user: ResponseClusterUser) {
  emit('save', user, { ...editFields.value });
  editingUser.value = null;
}

const store = useRenderStore();
const currentUser = computed(() => store.currentUserInfo[store.currentUserInfoId]);
const isAdmin = computed(() => currentUser.value?.role === 'Admin');

function openInfo() {
  if (store.modules[0]) {
    store.modules[0].type = TypeModule.ClusterInfo;
  }
}

const editingUser = ref<string | null>(null);
const editFields = ref({
  password: '',
  expiryDate: null as Date | null,
  roles: [] as string[],
});

function toggleEdit(username: string) {
  if (editingUser.value === username) {
    editingUser.value = null;
  } else {
    editingUser.value = username;
    editFields.value = {
      password: '',
      expiryDate: null,
      roles: [],
    };
  }
}
</script>

<template>
  <div class="container">
    <!-- App Users -->
    <div v-for="user in props.users" :key="user.email" class="item" @click="openInfo">
      <div class="info">
        <span>{{ user.email }}</span>
        <Tag v-if="user.role === 2" severity="info" value="ADMIN" rounded class="tag" />
        <Tag v-if="user.role === 1" severity="info" value="EDITOR" rounded class="tag" />
        <Tag v-if="user.role === 0" severity="info" value="VIEWER" rounded class="tag" />
      </div>
      <button v-if="isAdmin" class="btn-icon" @click.stop="props.functions?.[0]?.(user.email)">
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>
    </div>

    <!-- Security Groups -->
    <div v-for="group in props.securityGoups" :key="group.id" class="item" @click="openInfo">
      <div class="info">
        <span>{{ group.name }}</span>
      </div>
      <button
        v-if="isAdmin"
        class="btn-icon"
        @click.stop="props.functions?.[0]?.(String(group.id))"
      >
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>
    </div>

    <!-- Databases -->
    <div v-for="(db, index) in props.databases" :key="index" class="item">
      <div class="info">
        <FontAwesomeIcon icon="fa-solid fa-database" />
        <span>{{ db }}</span>
      </div>
      <button v-if="isAdmin" class="btn-icon" @click.stop="props.functions?.[0]?.(db)">
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>
    </div>

    <div v-for="(user, index) in props.clusterUsers" :key="index" class="item">
      <!-- Отображение ИМЕНИ и ИКОНКИ удаления только если НЕ редактируется -->
      <div
        v-if="editingUser !== user.username"
        class="info"
        :class="{ 'non-editable': !user.canBeEdited }"
        @click="
          () => {
            if (user.canBeEdited) toggleEdit(user.username);
          }
        "
      >
        <FontAwesomeIcon icon="fa-solid fa-user" />
        <span>{{ user.username }}</span>
        <Tag
          v-if="user.expiryDate"
          severity="warning"
          :value="`до ${new Date(user.expiryDate).toLocaleDateString()}`"
          rounded
          class="tag"
        />
        <Tag
          v-if="user.roles?.length"
          severity="success"
          :value="user.roles.join(', ')"
          rounded
          class="tag"
        />
      </div>

      <button
        v-if="isAdmin && editingUser !== user.username"
        class="btn-icon"
        @click.stop="props.functions?.[0]?.(user.username)"
      >
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>

      <!-- Редактируемая форма -->
      <div v-if="editingUser === user.username" class="edit-form">
        <!-- Вместо отдельного блока .form-footer -->
        <div class="db-form-grid with-button">
          <div class="db-field">
            <label>Пароль</label>
            <Password v-model="editFields.password" toggleMask />
          </div>
          <div class="db-field">
            <label>Дата истечения</label>
            <Calendar v-model="editFields.expiryDate" showIcon showTime hourFormat="24" />
          </div>
          <div class="db-field">
            <label>Роли</label>
            <MultiSelect
              v-model="editFields.roles"
              :options="props.availableRoles || []"
              placeholder="Выберите роли"
              display="chip"
            />
          </div>
          <!-- Добавленная кнопка прямо в сетку -->
          <div class="db-field btn-field">
            <div class="buttons-inline">
              <Button label="Сохранить" icon="pi pi-check" @click="emitSave(user)" />
              <Button
                label="Отмена"
                icon="pi pi-times"
                class="p-button-secondary"
                @click="editingUser = null"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Deadlocks -->
    <div v-for="(item, index) in props.deadlocks" :key="index" class="item">
      <div class="info">
        <FontAwesomeIcon icon="fa-solid fa-bolt" />
        <span>{{ item.database }}</span>
        <Tag :value="`${item.deadlockCount}`" severity="danger" rounded class="tag" />
      </div>
    </div>

    <!-- Replication Hosts -->
    <div v-for="(host, index) in props.replicationHosts" :key="index" class="item">
      <div class="info">
        <FontAwesomeIcon icon="fa-solid fa-server" />
        <span>{{ host }}</span>
      </div>
    </div>

    <!-- Backups -->
    <div v-for="(backup, index) in props.backups" :key="index" class="item">
      <div class="info">
        <FontAwesomeIcon icon="fa-solid fa-database" />
        <span>{{ backup.status.backupName }}</span>
        <Tag
          :value="backup.status.phase"
          :severity="backup.status.phase === 'completed' ? 'success' : 'danger'"
          class="tag"
        />
        <Tag
          v-if="backup.status.startedAt"
          :value="new Date(backup.status.startedAt).toLocaleString()"
          class="tag"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  background-color: #f7f9fb;
  padding: 16px;
  border-radius: 8px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 18px;
  background-color: #ffffff;
  border-radius: 10px;
  border: 1px solid #e0e6ed;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    border-color: #d0d7de;
    background-color: #fcfcfc;
  }
}

.info {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
  color: #333;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 220px;
    color: #1f2937;
  }
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #e74c3c;
  border-radius: 50%;
  transition:
    background-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background-color: rgba(231, 76, 60, 0.12);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
}

.tag {
  font-size: 12px;
  padding: 2px 8px;
}

.scroll-section {
  max-height: 260px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #c4c4c4;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-track {
    background-color: transparent;
  }
}

.db-form-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  align-items: end;
}

.db-field {
  flex: 1 1 220px;
  min-width: 220px;
  max-width: 220px;
  label {
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 4px;
    display: block;
  }

  // Все вложенные поля должны растягиваться на всю ширину
  :deep(.p-inputtext),
  :deep(.p-password),
  :deep(.p-calendar),
  :deep(.p-multiselect),
  :deep(.p-dropdown),
  :deep(.p-button),
  input,
  span,
  select {
    width: 100% !important;
  }

  // У MultiSelect контейнер с чипами тоже должен быть ограничен
  :deep(.p-multiselect-label-container) {
    max-width: 100%;
    flex-wrap: wrap;
  }
}

.btn-field {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding-top: 20px;
  width: 100%;

  // убираем обёртку с переносом строк
  .buttons-inline {
    display: flex;
    gap: 8px;
    flex-wrap: nowrap;
    width: 100%;

    // заставим кнопки ужиматься
    .p-button {
      flex: 1 1 auto;
      max-width: 150px;
    }
  }
}

.buttons-inline {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.non-editable {
  cursor: not-allowed;
  opacity: 0.6;
  pointer-events: auto;

  &:hover {
    background-color: inherit; // убираем hover эффект
  }
}

// .db-form-grid {
//   display: flex;
//   flex-wrap: wrap;
//   gap: 12px;
//   margin-top: 16px;
//   align-items: end;

//   // ✅ Ограничение максимальной ширины
//   max-width: 100%;
//   box-sizing: border-box;
//   overflow-x: hidden;
// }
</style>
