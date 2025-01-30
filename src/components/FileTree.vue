<template>
  <div class="card">
    <Toast />
    <Tree
      v-model:selectionKeys="selectedKey"
      :value="nodes"
      selectionMode="single"
      :metaKeySelection="false"
      @nodeSelect="onNodeSelect"
      @nodeUnselect="onNodeUnselect"
      @nodeExpand="onNodeExpand"
      @nodeCollapse="onNodeCollapse"
      class="w-full md:w-[30rem]"
    ></Tree>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import type { TreeNode } from 'primevue/treenode';

import Tree from 'primevue/tree';

const nodes = ref<TreeNode[]>([
  {
    label: 'first',
    key: '0',
    icon: 'pi pi-inbox',
    children: [
      {
        label: 'first1',
        key: '0-0',
        icon: 'pi pi-file',
      },
    ],
  },
  {
    label: 'first',
    key: '0',
    icon: 'pi pi-inbox',
    children: [
      {
        label: 'first1',
        key: '0-0',
        icon: 'pi pi-file',
      },
    ],
  },
  {
    label: 'first',
    key: '0',
    icon: 'pi pi-inbox',
    children: [
      {
        label: 'first1',
        key: '0-0',
        icon: 'pi pi-file',
      },
    ],
  },
  {
    label: 'first',
    key: '0',
    icon: 'pi pi-inbox',
    children: [
      {
        label: 'first1',
        key: '0-0',
        icon: 'pi pi-file',
      },
    ],
  },
]);
const selectedKey = ref({});
const toast = useToast();

const onNodeSelect = (node: TreeNode) => {
  console.log(node);
  toast.add({ severity: 'success', summary: 'Node Selected', detail: node.label, life: 3000 });
};

const onNodeUnselect = (node: TreeNode) => {
  toast.add({ severity: 'warn', summary: 'Node Unselected', detail: node.label, life: 3000 });
};

const onNodeExpand = (node: TreeNode) => {
  toast.add({ severity: 'info', summary: 'Node Expanded', detail: node.label, life: 3000 });
};

const onNodeCollapse = (node: TreeNode) => {
  toast.add({ severity: 'info', summary: 'Node Collapsed', detail: node.label, life: 3000 });
};
</script>
<style lang="scss" scoped>
.card {
  .p-tree {
    border-radius: 10px;
  }
}
</style>
