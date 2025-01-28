<script setup lang="ts">
import type { SecurityGroup } from '@/types/entities';
import TableComponent from '../TableComponent.vue';
import ScrollPanel from 'primevue/scrollpanel';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useRenderStore } from '@/stores';
import { TypeModule } from '@/types/components';

const store = useRenderStore();

const securityGroups: SecurityGroup[] = [
  { name: 'SecurityGroup1', id: 'SG-001' },
  { name: 'SecurityGroup2', id: 'SG-002' },
  { name: 'SecurityGroup3', id: 'SG-003' },
  { name: 'SecurityGroup4', id: 'SG-004' },
  { name: 'SecurityGroup5', id: 'SG-005' },
  { name: 'SecurityGroup6', id: 'SG-006' },
  { name: 'SecurityGroup7', id: 'SG-007' },
  { name: 'SecurityGroup8', id: 'SG-008' },
  { name: 'SecurityGroup9', id: 'SG-009' },
  { name: 'SecurityGroup10', id: 'SG-010' },
];
function action() {
  if (store.centerModule) {
    store.centerModule.type = TypeModule.AddSecurityGroup;
    store.centerModuleHistory = [...store.centerModuleHistory, TypeModule.AddSecurityGroup];
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
    <TableComponent :security-goups="securityGroups"></TableComponent>
  </ScrollPanel>
</template>
<style scoped>
.icon {
  display: flex;
  justify-content: end;
  cursor: pointer;
}
.table {
  flex: 1;
  margin: 20px auto; /* Центрование */
}
</style>
