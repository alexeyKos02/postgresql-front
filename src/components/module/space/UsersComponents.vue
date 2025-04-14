<script setup lang="ts">
import { UserRole, type User } from '@/types/entities';
import TableComponent from '../TableComponent.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ScrollPanel from 'primevue/scrollpanel';
import { useRenderStore } from '@/stores';
import { useToast } from 'primevue/usetoast';
import { TypeModule } from '@/types/components';
import { ref } from 'vue';

const toast = useToast();
const store = useRenderStore();
const generateRandomEmail = (index: number): string => `user${index + 1}@mail.ru`;

const roles = [UserRole.ADMIN, UserRole.EDITOR, UserRole.VIEWER];

const users = ref<User[]>(
  Array.from({ length: 15 }, (_, index) => ({
    email: generateRandomEmail(index),
    role: roles[index % roles.length],
  })),
);

function remove(id: string) {
  users.value = users.value.filter((users) => users.email !== id);
  toast.add({ severity: 'error', summary: `Удален`, detail: id, life: 3000 });
}

function action() {
  if (store.modules[0]) {
    store.modules[0].type = TypeModule.AddUser;
    store.centerModuleHistory = [...store.centerModuleHistory, TypeModule.AddUser];
  }
}
</script>
<template>
  <div class="icon" @click="action">
    <FontAwesomeIcon icon="fa-solid fa-plus" />
  </div>
  <ScrollPanel
    style="width: 100%; height: 200px"
    class="table"
    :dt="{
      bar: {
        background: '{primary.color}',
      },
    }"
  >
    <TableComponent :users="users" :functions="[remove]" />
  </ScrollPanel>
</template>
<style scoped>
.icon {
  display: flex;
  justify-content: end;
}
.table {
  flex: 1;
  padding-right: 3px;
  margin: 20px auto; /* Центрование */
}
</style>
