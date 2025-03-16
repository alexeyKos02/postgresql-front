<script setup lang="ts">
import { type Cluster } from '@/types/entities';
import TableComponent from '../TableComponent.vue';
import { TypeModule } from '@/types/components';
import { useRenderStore } from '@/stores';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ScrollPanel from 'primevue/scrollpanel';
const store = useRenderStore();
const clusters: Cluster[] = Array.from({ length: 15 }, (_, index) => ({
  name: `Элемент ${index + 1}`,
}));
function action() {
  if (store.modules[0]) {
    store.modules[0].type = TypeModule.CreateCluster;
    store.centerModuleHistory = [...store.centerModuleHistory, TypeModule.CreateCluster];
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
    <TableComponent :clusters="clusters"></TableComponent>
  </ScrollPanel>
</template>
<style scoped>
.icon {
  display: flex;
  justify-content: end;
}
.table {
  flex: 1;
  margin: 20px auto; /* Центрование */
}
</style>
