<template>
  <div class="card">
    <Toast />

    <div class="tree-scroll-container">
      <Tree
        v-model:selectionKeys="selectedKey"
        :value="nodes"
        selectionMode="single"
        :metaKeySelection="false"
        class="w-full md:w-[30rem]"
        @node-select="onNodeSelect"
      >
        <template #default="slotProps">
          <div class="node-content">
            <span>{{ slotProps.node.label }}</span>
          </div>
        </template>
      </Tree>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useToast } from 'primevue/usetoast';
import type { TreeNode } from 'primevue/treenode';
import Tree from 'primevue/tree';
import { useRenderStore } from '@/stores';
import { storeToRefs } from 'pinia';

const store = useRenderStore();
const { workspaces } = storeToRefs(store); // Референс на store

const toast = useToast();
const selectedKey = ref({});

// ✅ Динамически формируем nodes
const nodes = computed<TreeNode[]>(() => [
  {
    label: 'Пространства',
    key: '0',
    icon: 'pi pi-inbox',
    children: workspaces.value.map((workspace, index) => ({
      label: workspace.name,
      key: `0-${index}`,
      icon: 'pi pi-file',
      data: workspace, // добавляем workspace в data узла
    })),
  },
]);

const onNodeSelect = (node: TreeNode) => {
  const selectedWorkspace = node.data;

  if (!selectedWorkspace) {
    toast.add({
      severity: 'warn',
      summary: 'Нет данных',
      detail: 'Workspace не найден',
      life: 3000,
    });
    return;
  }

  store.currentWorkspaces[0] = selectedWorkspace;

  // toast.add({
  //   severity: 'success',
  //   summary: 'Пространство выбрано',
  //   detail: selectedWorkspace.name,
  //   life: 3000,
  // });
};
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  display: flex;
  flex-direction: column;

  .p-tree {
    border-radius: 10px;
  }

  .tree-scroll-container {
    flex: 1;
    overflow-y: auto;
    height: 100%;
    padding-right: 4px; // маленький отступ для скролла
  }

  .node-content {
    display: flex;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
  }
}
</style>
