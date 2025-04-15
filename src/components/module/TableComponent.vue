<script lang="ts" setup>
import { useRenderStore } from '@/stores';
import { TypeModule } from '@/types/components';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { defineProps } from 'vue';
import { UserRole, type SecurityGroup, type User } from '@/types/entities';
import Tag from 'primevue/tag';

const props = defineProps<{
  users?: User[];
  securityGoups?: SecurityGroup[];
  functions?: ((id: string) => void)[];
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
    <!-- Users -->
    <div v-for="user in props.users" :key="user.email" class="item" @click="openInfo">
      <div class="info">
        <span>{{ user.email }}</span>
        <Tag severity="info" value="ADMIN" rounded v-if="user.role === 2" class="tag" />
        <Tag severity="info" value="EDITOR" rounded v-if="user.role === 1" class="tag" />
        <Tag severity="info" value="VIEWER" rounded v-if="user.role === 0" class="tag" />
      </div>
      <button class="btn-icon" @click.stop="props.functions?.[0]?.(user.email)">
        <FontAwesomeIcon icon="fa-solid fa-trash" />
      </button>
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
  </div>
</template>

<style scoped lang="scss">
/* 🌿 Фон всей области */
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 12px;
  background-color: #f7f9fb; /* светлый фон */
  padding: 16px;
  border-radius: 8px;
}

/* 🧩 Карточка элемента */
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
    color: #1f2937; /* чуть темнее для лучшего контраста */
  }
}

/* 🗑 Кнопка удаления */
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
  transition: background-color 0.2s ease, transform 0.2s ease;

  &:hover {
    background-color: rgba(231, 76, 60, 0.12);
    transform: scale(1.1);
  }

  &:focus {
    outline: none;
  }
}

/* 🎖 Тег роли */
.tag {
  font-size: 12px;
  padding: 2px 8px;
}
</style>
