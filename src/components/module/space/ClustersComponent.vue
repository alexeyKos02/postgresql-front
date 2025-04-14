<script setup lang="ts">
import { type Cluster } from '@/types/entities';
import TableComponent from '../TableComponent.vue';
import { TypeModule } from '@/types/components';
import { useRenderStore } from '@/stores';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import ScrollPanel from 'primevue/scrollpanel';
import { useToast } from 'primevue/usetoast';
import { ref } from 'vue';

const toast = useToast();
const store = useRenderStore();
const clusters = ref<Cluster[]>(
  Array.from({ length: 15 }, (_, index) => ({
    name: `Кластер ${index + 1}`,
  })),
);

function reload(id: string) {
  toast.add({ severity: 'success', summary: `Перезагружен`, detail: id, life: 3000 });
}
function stop(id: string) {
  toast.add({ severity: 'warn', summary: `Остановлен`, detail: id, life: 3000 });
}

function remove(id: string) {
  clusters.value = clusters.value.filter((cluster) => cluster.name !== id);
  toast.add({ severity: 'error', summary: `Удален`, detail: id, life: 3000 });
}

async function action() {
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
    <TableComponent :clusters="clusters" :functions="[reload, stop, remove]"></TableComponent>
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
