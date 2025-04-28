<script setup lang="ts">
import { defineProps } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Tag from 'primevue/tag';
import { useRenderStore } from '@/stores';
import { TypeModule } from '@/types/components';
import type { User, SecurityGroup } from '@/types/entities';
import type { DeadlockStat, ResponseClusterUser, BackupData } from '@/types/api';

const props = defineProps<{
  users?: User[];
  securityGoups?: SecurityGroup[];
  databases?: string[];
  clusterUsers?: ResponseClusterUser[];
  functions?: ((id: string) => void)[];
  deadlocks?: DeadlockStat[];
  replicationHosts?: string[];
  backups?: BackupData[];
}>();

const store = useRenderStore();

function openInfo() {
  if (store.modules[0]) {
    store.modules[0].type = TypeModule.ClusterInfo;
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
      <!-- <button class="btn-icon" @click.stop="props.functions?.[0]?.(user.email)">
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button> -->
    </div>

    <!-- Security Groups -->
    <div v-for="group in props.securityGoups" :key="group.id" class="item" @click="openInfo">
      <div class="info">
        <span>{{ group.name }}</span>
      </div>
      <button class="btn-icon" @click.stop="props.functions?.[0]?.(String(group.id))">
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>
    </div>

    <!-- Databases -->
    <div v-for="(db, index) in props.databases" :key="index" class="item">
      <div class="info">
        <FontAwesomeIcon icon="fa-solid fa-database" />
        <span>{{ db }}</span>
      </div>
      <button class="btn-icon" @click.stop="props.functions?.[0]?.(db)">
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>
    </div>

    <!-- Cluster Users -->
    <div v-for="(user, index) in props.clusterUsers" :key="index" class="item">
      <div class="info">
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
      <button class="btn-icon" @click.stop="props.functions?.[0]?.(user.username)">
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>
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
</style>
